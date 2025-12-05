# Load .env.local from project root
$envPath = "C:\Users\Jacob\racelay\.env.local"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match "^(?<key>[^#=]+)=(?<value>.+)$") {
            $key = $matches['key'].Trim()
            $value = $matches['value'].Trim('"')
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "[WARN] .env.local not found. Using default values."
}
# RACELAY n8n Deploy Script v1.0 - PowerShell version
# Debug: Logs to n8n-logs.txt; Loading: Progress echoes

Write-Host "🚀 [LOADING] Initializing n8n for RACELAY Dev Automation..."

try {
    docker volume create racelay_n8n_data 2>> n8n-logs.txt | Out-Null
    Write-Host "[DEBUG] Volume created or already exists."
} catch {
    Write-Host "[DEBUG] Volume exists - idempotent"
}

# Read N8N credentials directly from .env.local (sanity & to avoid boolean misassignment)
if (Test-Path $envPath) {
    $n8nUser = (Get-Content $envPath | Where-Object { $_ -match '^N8N_USER' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') } | Select-Object -Last 1)
    $n8nPass = (Get-Content $envPath | Where-Object { $_ -match '^N8N_PASS' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') } | Select-Object -Last 1)
} else {
    $n8nUser = $env:N8N_USER
    $n8nPass = $env:N8N_PASS
}

if (-not $n8nUser -or $n8nUser -eq "") { $n8nUser = "admin" }
if (-not $n8nPass -or $n8nPass -eq "") { $n8nPass = "your-vault-pass" }

Write-Host "[DEBUG] N8N user (from env): $n8nUser"
Write-Host "[DEBUG] N8N pass length (not printed): $(if ($n8nPass) { $n8nPass.Length } else { 0 })"

if (Test-Path $envPath) {
    $supabaseServiceRoleKey = (Get-Content $envPath | Where-Object { $_ -match '^SUPABASE_SERVICE_ROLE_KEY' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') } | Select-Object -Last 1)
    $openAiKeyProd = (Get-Content $envPath | Where-Object { $_ -match '^OPENAI_API_KEY_PROD' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') } | Select-Object -Last 1)
    $openAiKeyDev = (Get-Content $envPath | Where-Object { $_ -match '^OPENAI_API_KEY_DEV' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') } | Select-Object -Last 1)
    $openAiKey = $openAiKeyProd
    if (-not $openAiKey -or $openAiKey -eq "") { $openAiKey = $openAiKeyDev }
    if (-not $openAiKey -or $openAiKey -eq "") { $openAiKey = (Get-Content $envPath | Where-Object { $_ -match '^OPENAI_API_KEY' } | ForEach-Object { ($_ -split '=')[1].Trim().Trim('"') }) }
} else {
    $supabaseServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
    $openAiKey = $env:OPENAI_API_KEY
}

Write-Host "[DEBUG] SUPABASE_SERVICE_ROLE_KEY length: $(if ($supabaseServiceRoleKey) { $supabaseServiceRoleKey.Length } else { 0 })"
Write-Host "[DEBUG] OPENAI key present: $(if ($openAiKey) { 'yes' } else { 'no' })"

$dockerRun = @(
    "docker run -d",
    "--name racelay-n8n",
    "-p 5678:5678",
    "-v racelay_n8n_data:/home/node/.n8n",
    "-e N8N_BASIC_AUTH_ACTIVE=true",
    "-e N8N_BASIC_AUTH_USER=$($n8nUser)",
    "-e N8N_BASIC_AUTH_PASSWORD=$($n8nPass)",
    "-e SUPABASE_SERVICE_ROLE_KEY=$($supabaseServiceRoleKey)",
    "-e OPENAI_API_KEY=$($openAiKey)",
    "-e WEBHOOK_URL=https://dev.racelay.com/webhook",
    "-e GENERIC_TIMEZONE=America/New_York",
    "docker.n8n.io/n8nio/n8n:latest"
) -join " "

$runResultCmd = "$dockerRun 2>> n8n-logs.txt"
Write-Host "[DEBUG] Docker run command: $dockerRun"
$runResult = Invoke-Expression $runResultCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ [SUCCESS] n8n deployed. Access UI: http://localhost:5678"
    Write-Host "🔄 [LOADING] Waiting for startup (10s)..."
    Start-Sleep -Seconds 10
    try {
        Invoke-WebRequest -Uri "http://localhost:5678/healthz" -UseBasicParsing | Out-Null
        Write-Host "[HEALTH] n8n is healthy."
    } catch {
        Write-Host "[DEBUG] Health check failed - retry in prod"
    }
} else {
    Write-Host "❌ [ERROR] Deployment failed. Check n8n-logs.txt"
    exit 1
}

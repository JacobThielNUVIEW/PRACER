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

$env:N8N_USER = $env:N8N_USER -or "admin"
$env:N8N_PASS = $env:N8N_PASS -or "your-vault-pass"

$dockerRun = @(
    "docker run -d",
    "--name racelay-n8n",
    "-p 5678:5678",
    "-v racelay_n8n_data:/home/node/.n8n",
    "-e N8N_BASIC_AUTH_ACTIVE=true",
    "-e N8N_BASIC_AUTH_USER=$($env:N8N_USER)",
    "-e N8N_BASIC_AUTH_PASSWORD=$($env:N8N_PASS)",
    "-e WEBHOOK_URL=https://dev.racelay.com/webhook",
    "-e GENERIC_TIMEZONE=America/New_York",
    "docker.n8n.io/n8nio/n8n:latest"
) -join " "

$runResult = Invoke-Expression "$dockerRun 2>> n8n-logs.txt"

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

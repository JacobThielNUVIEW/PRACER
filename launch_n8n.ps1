# Launch and open n8n

# Run the deployment script
& "$PSScriptRoot\..\scripts\deploy_n8n.ps1"

# Wait a few seconds for n8n to start (adjust as needed)
Start-Sleep -Seconds 5

# Open n8n in the default browser (change port if needed)
Start-Process "http://localhost:5678"

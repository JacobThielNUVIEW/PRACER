#!/bin/bash
# RACELAY n8n Deploy Script v1.0 - Segmented for dev/prod
# Debug: Logs to n8n-logs.txt; Loading: Progress echoes

echo "🚀 [LOADING] Initializing n8n for RACELAY Dev Automation..."
docker volume create racelay_n8n_data 2>> n8n-logs.txt || echo "[DEBUG] Volume exists - idempotent"

docker run -d \
  --name racelay-n8n \
  -p 5678:5678 \
  -v racelay_n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=${N8N_USER:-admin} \
  -e N8N_BASIC_AUTH_PASSWORD=${N8N_PASS:-your-vault-pass} \
  -e WEBHOOK_URL=https://dev.racelay.com/webhook \
  -e GENERIC_TIMEZONE=America/New_York \
  docker.n8n.io/n8nio/n8n:latest 2>> n8n-logs.txt

if [ $? -eq 0 ]; then
  echo "✅ [SUCCESS] n8n deployed. Access UI: http://localhost:5678"
  echo "🔄 [LOADING] Waiting for startup (10s)..."
  sleep 10
  curl -f http://localhost:5678/healthz || echo "[DEBUG] Health check failed - retry in prod"
else
  echo "❌ [ERROR] Deployment failed. Check n8n-logs.txt"
  exit 1
fi

#!/bin/bash
# Helper to run SQL against the Supabase project via Management API
set -e
TOKEN=$(cat ~/.supabase/access-token)
PROJECT="umqdxszsdkbhxxxydtih"
SQL="$1"

curl -s -X POST "https://api.supabase.com/v1/projects/${PROJECT}/database/query" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL" | jq -Rs .)}"
#!/bin/bash
set -e
TOKEN=$(cat ~/.supabase/access-token)
PROJECT="umqdxszsdkbhxxxydtih"
SQLFILE="$1"
SQL=$(cat "$SQLFILE")

curl -s -X POST "https://api.supabase.com/v1/projects/${PROJECT}/database/query" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$(jq -Rs --arg sql "$SQL" '{query: $sql}' <<< '{}')" 2>&1
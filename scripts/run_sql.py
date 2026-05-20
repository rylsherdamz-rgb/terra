#!/usr/bin/env python3
import json, sys, urllib.request

TOKEN = open("/home/richie/.supabase/access-token").read().strip()
PROJECT = "umqdxszsdkbhxxxydtih"

sql = sys.stdin.read()
data = json.dumps({"query": sql}).encode()

req = urllib.request.Request(
    f"https://api.supabase.com/v1/projects/{PROJECT}/database/query",
    data=data,
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json",
    },
)

with urllib.request.urlopen(req) as resp:
    print(resp.read().decode())
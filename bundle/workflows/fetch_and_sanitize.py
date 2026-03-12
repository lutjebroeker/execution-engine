#!/usr/bin/env python3
"""
Fetch all 21 AM workflows from n8n, sanitize personal credentials,
and save as bundle/workflows/am-workflows-v1.json
"""

import json
import urllib.request
import urllib.error
import re

N8N_BASE = "https://n8n.jellespek.nl"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNjNlNjgzZS0yZmRjLTQwYWYtODlkNi1jODI1MmMxNmNkYTciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzcyMTMwODk5LCJleHAiOjE3Nzk4NTQ0MDB9.NIQPhuNOyjmqArVCStiAx-tCQeTh6ga9yDuzYdyTKCo"

WORKFLOW_IDS = [
    "njsE67iI52fQX4hL",       # AM - Morning - Start routine
    "gAsP9p3oCGsS4zmv",       # AM - Morning - Reflection
    "tO2eI2p3WJSTaMB60_Dlq",  # AM - Morning - Goal Selection
    "90bjkgWdqs7ABXlE",       # AM - Evening - Start routine
    "9uDvviG2Rslu6iUC",       # AM - Evening - Reflection
    "zRwoR6vIksVEoc1f",       # AM - Week - Planning v2 (Claude)
    "Igq9tGCOS0PPCqGL",       # AM - Week - Review v2 (Claude)
    "9C2CnTp3jWfdW9kM",       # AM - Quarter - Review
    "8dYTSiCStFigrlOC",       # AM - Telegram - Message trigger - Quarter Review
    "dYJeEzaCSJvtwOnx",       # AM - Quarter - Create Cycle
    "i45JHGvuDJTmm6q2wM-Mu",  # AM - Telegram - Message trigger
    "yAi3TJwPHLteoDUO",       # AM - Telegram - Message trigger - Goals Confirm
    "1HfX7UcNQerN2RCR",       # AM - Telegram - Message trigger - Goal Select
    "hR1AHNrIOQKPlPK4",       # AM - Telegram - Tactic Selection Flow
    "QvkyA79Kxqx4mpHi",       # AM - Telegram - Message trigger - Tactic Select
    "PvX3O2s7BqjeeVE6",       # AM - Telegram - Message trigger - Weekly Review
    "fYjAWA6EiUn7zYfh",       # AM - Telegram - Message trigger - Weekly Feedback
    "uOZwSUL34lnB3PWO",       # AM - Telegram - Message trigger - Process Reflection
    "U5s7yGoTPgbVVh0u",       # AM - Telegram - Message trigger - ap_morning
    "X1n1xaMlb8RkqHJG",       # AM - Telegram - Message trigger - weekly_struggles
    "PZdWbcFtFT3EvM3t",       # AM - Create daily note if not exists
    "8FAzNPSpbA14pBIl",       # AM - Waitlist - Subscribe Handler
]

# Personal values to replace (ordered longest-first to avoid partial matches)
REPLACEMENTS = [
    # Anthropic/Claude API key
    ("YOUR_CLAUDE_API_KEY", "YOUR_CLAUDE_API_KEY"),
    # Telegram bot token
    ("YOUR_BOT_TOKEN", "YOUR_BOT_TOKEN"),
    # Obsidian API key
    ("YOUR_OBSIDIAN_API_KEY", "YOUR_OBSIDIAN_API_KEY"),
    # Vault paths (with trailing slash first)
    ("/home/obsidian/Documents/PersonalAssistant/", "/path/to/your/vault/"),
    ("/home/obsidian/Documents/PersonalAssistant", "/path/to/your/vault"),
    # Node-RED URL
    ("http://192.168.1.158:1880", "http://YOUR_NODERED_HOST:1880"),
    # Obsidian Local REST API URL
    ("http://192.168.1.158:27123", "http://YOUR_OBSIDIAN_HOST:27123"),
    # n8n instance URL
    ("https://n8n.jellespek.nl", "https://YOUR_N8N_HOST"),
    # Telegram chat ID as string
    ('"chatId": "6897758158"', '"chatId": "YOUR_TELEGRAM_CHAT_ID"'),
    ("'6897758158'", "'YOUR_TELEGRAM_CHAT_ID'"),
    ('"6897758158"', '"YOUR_TELEGRAM_CHAT_ID"'),
]

KEYS_TO_STRIP = {"pinData", "shared", "tags", "activeVersion", "versionId", "meta"}


def fetch_workflow(wf_id):
    url = f"{N8N_BASE}/api/v1/workflows/{wf_id}"
    req = urllib.request.Request(url, headers={"X-N8N-API-KEY": API_KEY})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code} fetching {wf_id}: {e.reason}")
        return None
    except Exception as e:
        print(f"  ERROR fetching {wf_id}: {e}")
        return None


def sanitize_workflow(wf):
    raw = json.dumps(wf)

    for old, new in REPLACEMENTS:
        raw = raw.replace(old, new)

    # Catch bare numeric chat ID in JSON values
    raw = re.sub(r':\s*6897758158([,}\]])', r': "YOUR_TELEGRAM_CHAT_ID"\1', raw)

    data = json.loads(raw)

    # Strip sensitive/unnecessary top-level keys
    for key in KEYS_TO_STRIP:
        data.pop(key, None)

    # Force inactive
    data["active"] = False

    # Strip credential IDs from nodes (keep name, remove id)
    for node in data.get("nodes", []):
        if "credentials" in node:
            for cred_type, cred_val in node["credentials"].items():
                if isinstance(cred_val, dict) and "id" in cred_val:
                    del cred_val["id"]

    return data


def main():
    workflows = []

    for wf_id in WORKFLOW_IDS:
        print(f"Fetching {wf_id}...", end=" ", flush=True)
        wf = fetch_workflow(wf_id)
        if wf is None:
            print("SKIPPED")
            continue

        name = wf.get("name", "unknown")
        print(f"OK ({name})")

        clean = sanitize_workflow(wf)
        workflows.append(clean)

    print(f"\nFetched {len(workflows)}/{len(WORKFLOW_IDS)} workflows")

    output_path = "/root/projects/personal/execution-engine/bundle/workflows/am-workflows-v1.json"
    with open(output_path, "w") as f:
        json.dump(workflows, f, indent=2)

    print(f"Saved to {output_path}")

    # Verify no personal values leaked
    with open(output_path) as f:
        content = f.read()

    leaks = []
    check_values = [
        "8227272160:AAH",
        "6897758158",
        "7d0aaeb3205659b21effb8c48b73445d2d0f5e",
        "sk-ant-api03-WVZ6",
        "192.168.1.158",
        "/home/obsidian/Documents/PersonalAssistant",
        "n8n.jellespek.nl",
    ]
    for v in check_values:
        if v in content:
            leaks.append(v)

    if leaks:
        print(f"\nWARNING - LEAKS DETECTED: {leaks}")
    else:
        print("\nNo personal values detected in output - clean!")


if __name__ == "__main__":
    main()

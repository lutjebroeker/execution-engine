---
phase: 04-obsidian-vault-sync
plan: "01"
subsystem: vault-infrastructure
tags: [file-system-access-api, indexeddb, react-context, markdown, obsidian]
dependency_graph:
  requires: []
  provides: [VaultContext, useVaultSync, vaultStorage]
  affects: [04-02-settings-ui, 04-03-callsite-wiring]
tech_stack:
  added: [idb-keyval@6.2.2]
  patterns: [react-context, tdd, fire-and-forget-writes, try-finally-writable]
key_files:
  created:
    - /root/projects/flow-year-coach/src/lib/vaultStorage.ts
    - /root/projects/flow-year-coach/src/lib/vaultStorage.test.ts
    - /root/projects/flow-year-coach/src/contexts/VaultContext.tsx
    - /root/projects/flow-year-coach/src/contexts/VaultContext.test.tsx
    - /root/projects/flow-year-coach/src/hooks/useVaultSync.ts
    - /root/projects/flow-year-coach/src/hooks/useVaultSync.test.ts
  modified: []
decisions:
  - "obsidianMode stored in localStorage key ee-obsidian-mode (device preference, not cross-device)"
  - "writeNote uses try/finally to ensure writable.close() always runs — data integrity guarantee"
  - "needsReconnect flag set on mount when stored handle exists but queryPermission returns prompt — avoids illegal requestPermission outside user gesture"
  - "Goal slug uses title.toLowerCase().replace(/[^a-z0-9]+/g, '-') for human-readable vault filenames"
  - "buildReviewNote frontmatter uses type: quarterly (matching Phase 2 vault starter)"
metrics:
  duration: "~8 minutes"
  completed_date: "2026-03-21"
  tasks_completed: 2
  files_created: 6
  tests_written: 24
  tests_passing: 24
---

# Phase 04 Plan 01: Vault Infrastructure Layer Summary

**One-liner:** File System Access API vault infrastructure — VaultContext (directory handle lifecycle with IndexedDB persistence), vaultStorage (idb-keyval wrappers), and useVaultSync (7 Markdown builder functions + backfill hook) — complete write pipeline from app data to Obsidian .md files.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | vaultStorage.ts + VaultContext.tsx | 1c44691 | src/lib/vaultStorage.ts, src/contexts/VaultContext.tsx + tests |
| 2 | useVaultSync.ts — Markdown formatters + backfill hook | 244e3a2 | src/hooks/useVaultSync.ts + test |

## What Was Built

### vaultStorage.ts
Thin wrappers around idb-keyval for persisting the `FileSystemDirectoryHandle` across browser sessions:
- `saveHandle(handle)` — stores to IndexedDB key `vault-directory-handle`
- `loadHandle()` — retrieves stored handle (undefined if not set)
- `clearHandle()` — removes stored handle on disconnect
- `isVaultApiSupported()` — feature detection guard for Chrome/Edge vs Firefox/Safari

### VaultContext.tsx
Full React context providing the vault directory handle lifecycle to any component:
- **Mount rehydration:** loads stored handle from IndexedDB, calls `queryPermission()` — sets `dirHandle` only if granted, sets `needsReconnect` if prompt
- **connect():** calls `showDirectoryPicker({ mode: 'readwrite' })`, saves to IndexedDB, returns vault folder name
- **disconnect():** clears IndexedDB, resets dirHandle, sets obsidianMode false
- **writeNote():** always calls `queryPermission()` before write, calls `requestPermission()` if not granted, uses try/finally to ensure `writable.close()` always runs
- **obsidianMode:** stored in localStorage key `ee-obsidian-mode` (device preference)
- **needsReconnect:** flag for when handle exists but permission needs re-granting (handles browser session restart edge case)

### useVaultSync.ts
Pure Markdown builder functions (7 data types) + backfill hook:

| Function | Vault Path | Key Frontmatter |
|----------|-----------|----------------|
| `buildCheckInNote` | `Daily/YYYY-MM-DD-{morning\|evening}.md` | date, type, week, quarter |
| `buildFlowSessionNote` | `Daily/YYYY-MM-DD-flow-{id}.md` | date, type: flow, duration_minutes |
| `buildReflectionNote` | `Weekly/YYYY-Www.md` | week, type: weekly, execution_score |
| `buildWeeklyPlanNote` | `Weekly/YYYY-Www-plan.md` | week, type: weekly-plan |
| `buildGoalNote` | `Goals/{slug}.md` | goal, status, 12_week_cycle, target_date |
| `buildReviewNote` | `Quarterly/YYYY-Qq.md` | quarter, type: quarterly |
| `buildVisionNote` | `vision.md` | type: vision |

`useVaultBackfill` fetches all data types from Supabase in parallel and writes them sequentially to avoid overwhelming the File System API. Returns `{ written, errors }` count.

## Verification

- Build passes: zero TypeScript errors
- 24 tests passing (9 for vaultStorage/VaultContext, 15 for useVaultSync)
- All 3 files created; no existing files modified
- idb-keyval@6.2.2 added to dependencies
- VaultContext exports: VaultProvider, useVaultContext
- useVaultSync exports: 7 build functions + useVaultBackfill
- vaultStorage exports: saveHandle, loadHandle, clearHandle, isVaultApiSupported

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

Files verified:
- FOUND: /root/projects/flow-year-coach/src/lib/vaultStorage.ts
- FOUND: /root/projects/flow-year-coach/src/contexts/VaultContext.tsx
- FOUND: /root/projects/flow-year-coach/src/hooks/useVaultSync.ts

Commits verified:
- FOUND: 1c44691 (feat(04-01): vaultStorage + VaultContext)
- FOUND: 244e3a2 (feat(04-01): useVaultSync — Markdown formatters + backfill hook)

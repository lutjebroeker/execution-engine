# Phase 4: Obsidian Vault Sync - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Pro users can choose between Supabase cloud sync (default) and local Obsidian vault as their data storage backend. The vault is a write target — the app is the source of truth. Two-way sync (vault → app) is out of scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Sync Direction
- One-way only: app writes to vault, vault changes do not sync back
- All data types sync: check-ins, reflections, cycle goals/tactics, flow sessions, weekly plans, vision — everything
- One note per entry (not aggregated) — matches Phase 2 vault starter structure and supports Obsidian Dataview queries
- Dual-write: Supabase remains active in the background even in Obsidian mode — vault is a live mirror, not a replacement

### Write Trigger
- Auto-write on every save — vault stays current without user action
- Deleted entries in app: vault files are left untouched (user manages their vault)
- First enable: backfill all historical data to vault immediately (write all existing Supabase records as .md files)
- Failed vault writes: silent retry — no user interruption (Supabase dual-write ensures data is safe)

### Vault Path Setup
- Connection method: browser File System Access API — user clicks "Select Vault Folder", grants permission via native folder picker
- Target browser: Chrome/Edge (File System Access API — not supported in Firefox/Safari)
- Folder structure: follow Phase 2 vault starter exactly — Daily/ for check-ins, Weekly/ for reflections, Goals/ for cycle goals, Quarterly/ for reviews
- Permission persists across sessions (browser remembers the folder grant — no re-prompt on revisit)
- Connection status shown in Settings page only: "Connected: [vault name]" or "Not connected"

### Mode Switching
- Settings UI: toggle inside the existing Settings card — "Storage: Cloud / Obsidian" — switching to Obsidian mode reveals folder picker and connection status inline
- Switching back to Cloud: instant, no data loss (Supabase was always current due to dual-write). Show a warning: "Edits made directly in Obsidian won't sync back to the app"
- Pro-gated: wrap entire Obsidian sync feature in ProGate component — Free users see upgrade CTA
- Toggle is instant with a success toast confirming the switch (and triggering backfill when enabling Obsidian mode) — no confirmation modal

### Claude's Discretion
- Exact .md frontmatter format for each note type
- How to handle File System Access API permission expiry edge cases
- Retry logic implementation for failed vault writes

</decisions>

<specifics>
## Specific Ideas

- Vault structure must match the Phase 2 Obsidian Vault Starter exactly — the target user already has this starter; files should land where they expect them
- The "Connected: [vault name]" indicator in Settings should feel like the account/subscription cards — same `ee-card` pattern

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/useDataExport.ts`: already collects all data types (vision, cycles, reviews, reflections, checkIns, flowSessions, streaks) — the file writer hook can use the same data fetching logic
- `src/components/ProGate.tsx`: wraps Pro-gated features with upgrade CTA — use for the entire Obsidian sync section
- `src/pages/Settings.tsx`: uses `ee-card` pattern with icon + title + content structure — new Obsidian card follows same pattern
- `src/contexts/SubscriptionContext.tsx`: `isPro` boolean available for conditional rendering

### Established Patterns
- Settings cards use `ee-card` CSS class with consistent icon (lucide), title, description layout
- Supabase writes go through individual hook functions (useCheckIns, useFlowSessions, etc.) — vault writer will hook into these same save points
- `useLocalStorage.ts`: cross-tab sync pattern — vault writes are fire-and-forget on top of existing save flows

### Integration Points
- Settings page (`/instellingen`): new "Vault Sync" card added below Subscription card
- Each data hook's save function: vault write triggered after successful Supabase write
- `useDataExport.ts` data-gathering logic: reused for the initial backfill on first enable
- Phase 2 Obsidian Vault Starter folder structure: `bundle/obsidian-vault-starter/` defines the target directory layout

</code_context>

<deferred>
## Deferred Ideas

- Two-way sync (Obsidian → app) — significant added complexity, its own phase if ever needed
- Firefox/Safari support — requires a different approach (download-based or local bridge)
- Scheduled batch sync — auto-write on save covers this use case already

</deferred>

---

*Phase: 04-obsidian-vault-sync*
*Context gathered: 2026-03-21*

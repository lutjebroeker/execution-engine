# Phase 4: Obsidian Vault Sync — Research

**Researched:** 2026-03-21
**Domain:** File System Access API + React hook integration + Markdown frontmatter templating
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sync Direction**
- One-way only: app writes to vault, vault changes do not sync back
- All data types sync: check-ins, reflections, cycle goals/tactics, flow sessions, weekly plans, vision — everything
- One note per entry (not aggregated) — matches Phase 2 vault starter structure and supports Obsidian Dataview queries
- Dual-write: Supabase remains active in the background even in Obsidian mode — vault is a live mirror, not a replacement

**Write Trigger**
- Auto-write on every save — vault stays current without user action
- Deleted entries in app: vault files are left untouched (user manages their vault)
- First enable: backfill all historical data to vault immediately (write all existing Supabase records as .md files)
- Failed vault writes: silent retry — no user interruption (Supabase dual-write ensures data is safe)

**Vault Path Setup**
- Connection method: browser File System Access API — user clicks "Select Vault Folder", grants permission via native folder picker
- Target browser: Chrome/Edge (File System Access API — not supported in Firefox/Safari)
- Folder structure: follow Phase 2 vault starter exactly — Daily/ for check-ins, Weekly/ for reflections, Goals/ for cycle goals, Quarterly/ for reviews
- Permission persists across sessions (browser remembers the folder grant — no re-prompt on revisit)
- Connection status shown in Settings page only: "Connected: [vault name]" or "Not connected"

**Mode Switching**
- Settings UI: toggle inside the existing Settings card — "Storage: Cloud / Obsidian" — switching to Obsidian mode reveals folder picker and connection status inline
- Switching back to Cloud: instant, no data loss (Supabase was always current due to dual-write). Show a warning: "Edits made directly in Obsidian won't sync back to the app"
- Pro-gated: wrap entire Obsidian sync feature in ProGate component — Free users see upgrade CTA
- Toggle is instant with a success toast confirming the switch (and triggering backfill when enabling Obsidian mode) — no confirmation modal

### Claude's Discretion

- Exact .md frontmatter format for each note type
- How to handle File System Access API permission expiry edge cases
- Retry logic implementation for failed vault writes

### Deferred Ideas (OUT OF SCOPE)

- Two-way sync (Obsidian → app) — significant added complexity, its own phase if ever needed
- Firefox/Safari support — requires a different approach (download-based or local bridge)
- Scheduled batch sync — auto-write on save covers this use case already
</user_constraints>

---

## Summary

Phase 4 introduces a new storage output layer: the browser File System Access API writes app data as Markdown files directly into the user's Obsidian vault folder. The architecture is additive — Supabase continues writing in all cases (dual-write), and the vault writer fires as a fire-and-forget side effect after each successful Supabase save.

The File System Access API (`showDirectoryPicker()` / `FileSystemDirectoryHandle`) is the only viable browser-native solution for writing to an arbitrary local folder without a native app. It requires Chrome 86+ or Edge 86+ — which is precisely the stated constraint (Firefox/Safari deferred). The directory handle must be stored in IndexedDB (via idb-keyval) to survive page reloads; permissions, however, require re-verification on each new browser session via `queryPermission()` / `requestPermission()`. The CONTEXT.md states "permission persists across sessions" — this is TRUE in that the stored handle survives, but a re-prompt may appear on a new session if Chrome's permission state was not retained. The implementation must handle this gracefully (re-prompt is native Chrome dialog, user experience remains acceptable).

The implementation has three discrete pieces: (1) a `useVaultWriter` hook that holds the directory handle, exposes connect/disconnect, and provides a `writeNote(path, content)` function; (2) a `useVaultSync` hook that contains per-data-type formatter functions (Markdown + frontmatter builders); and (3) mutation callsite changes in each existing data hook to call vault write after Supabase succeeds. The Settings page gets a new Obsidian Sync card following the existing `ee-card` pattern, wrapped in `<ProGate>`.

**Primary recommendation:** Build `useVaultWriter` as a React context (not just a hook) so any data hook can reach it without prop drilling. Store `obsidianMode` in localStorage (persists free/cloud state). Store the directory handle in IndexedDB. Trigger vault writes as fire-and-forget Promises with silent error logging.

---

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `react` | ^18.3.1 | UI + context for VaultWriter provider | Installed |
| `@tanstack/react-query` | ^5.83.0 | Hooks for existing data; backfill uses query client directly | Installed |
| `date-fns` | installed | Date formatting for note filenames and frontmatter | Installed |
| `shadcn/ui` + Radix | various | Toggle/Switch component for Storage mode UI | Installed |

### New Dependencies to Install

| Library | Version | Purpose | Install Command |
|---------|---------|---------|----------------|
| `idb-keyval` | ^6.2.1 | Store `FileSystemDirectoryHandle` in IndexedDB across sessions | `npm install idb-keyval` |

**Installation:**
```bash
cd /root/projects/flow-year-coach
npm install idb-keyval
```

### Supporting (No Install Needed)

| API | Browser Support | Purpose |
|-----|----------------|---------|
| `window.showDirectoryPicker()` | Chrome 86+, Edge 86+ | Prompt user to select vault folder |
| `FileSystemDirectoryHandle` | Chrome 86+, Edge 86+ | Navigate subdirectories, create files |
| `FileSystemFileHandle.createWritable()` | Chrome 86+, Edge 86+ | Write Markdown content to .md files |
| `FileSystemHandle.queryPermission()` | Chrome 86+, Edge 86+ | Check existing permission without prompting |
| `FileSystemHandle.requestPermission()` | Chrome 86+, Edge 86+ | Re-request permission in new session |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| idb-keyval | Raw IndexedDB API | idb-keyval is 1KB, ergonomic, widely used; no reason to use raw IDB |
| File System Access API | Download-as-zip approach | Download can't write to specific folder; deferred for Firefox/Safari users |
| React context for vault writer | Module-level singleton | Context integrates cleanly with existing AuthContext/SubscriptionContext pattern |

---

## Architecture Patterns

### Recommended Project Structure Additions

```
src/
├── contexts/
│   └── VaultContext.tsx          # NEW — provides dirHandle, isConnected, writeNote(), obsidianMode
├── hooks/
│   └── useVaultSync.ts           # NEW — per-data-type Markdown formatters + write orchestration
├── lib/
│   └── vaultStorage.ts           # NEW — idb-keyval get/set for persisting directory handle
└── pages/
    └── Settings.tsx              # MODIFY — add Obsidian Sync card below Subscription card
```

Data hooks to modify (add vault write after Supabase mutate):
- `useCheckIns.ts` — after `addMorningCheckIn` / `addEveningCheckIn`
- `useFlowSessions.ts` — after `insertMutation`
- `useWeeklyReflections.ts` — after `upsertMutation`
- `useTwelveWeekReview.ts` — after upsert
- `useActiveCycle.ts` — after cycle create/update (goals)
- `useVision.ts` — after vision upsert
- `useWeeklyPlans.ts` — after weekly plan upsert

### Pattern 1: VaultContext — Directory Handle Lifecycle

**What:** React context that holds the `FileSystemDirectoryHandle`, persists it to IndexedDB on connect, rehydrates it on mount, and exposes `connect()`, `disconnect()`, `writeNote()`, and `obsidianMode` state.

**When to use:** Wrap app root (or Settings + all data hooks that need vault writes).

```typescript
// Source: MDN File System Access API + idb-keyval docs
// src/contexts/VaultContext.tsx

import { get, set, del } from 'idb-keyval';

const IDB_KEY = 'vault-directory-handle';
const OBSIDIAN_MODE_KEY = 'ee-obsidian-mode';

export function VaultProvider({ children }: { children: ReactNode }) {
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [obsidianMode, setObsidianMode] = useLocalStorage<boolean>(OBSIDIAN_MODE_KEY, false);

  // Rehydrate handle on mount
  useEffect(() => {
    get(IDB_KEY).then(async (stored: FileSystemDirectoryHandle | undefined) => {
      if (!stored) return;
      // Verify permission without prompting
      const perm = await stored.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') setDirHandle(stored);
      // If not granted: dirHandle stays null, UI shows "reconnect" state
    });
  }, []);

  const connect = async () => {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await set(IDB_KEY, handle);
    setDirHandle(handle);
    return handle.name; // vault folder name for Settings UI
  };

  const disconnect = async () => {
    await del(IDB_KEY);
    setDirHandle(null);
  };

  const writeNote = async (relativePath: string, content: string): Promise<void> => {
    if (!dirHandle) return;
    // Ensure permission is still valid (re-request if needed)
    const perm = await dirHandle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') {
      const req = await dirHandle.requestPermission({ mode: 'readwrite' });
      if (req !== 'granted') return; // silent fail — Supabase has the data
    }
    // Navigate/create subdirectory path
    const parts = relativePath.split('/');
    const filename = parts.pop()!;
    let current: FileSystemDirectoryHandle = dirHandle;
    for (const part of parts) {
      current = await current.getDirectoryHandle(part, { create: true });
    }
    const fileHandle = await current.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  };

  return (
    <VaultContext.Provider value={{ dirHandle, obsidianMode, setObsidianMode, connect, disconnect, writeNote, isConnected: !!dirHandle }}>
      {children}
    </VaultContext.Provider>
  );
}
```

### Pattern 2: Markdown + Frontmatter Builder Functions

**What:** Pure functions in `useVaultSync.ts` that take app data objects and return Markdown strings with YAML frontmatter. One function per data type.

**When to use:** Called from `writeNote()` callsites in each data hook.

**Frontmatter design (Claude's Discretion — recommendation):**

Each note type maps to its vault starter folder and uses frontmatter fields that work with Obsidian Dataview queries. The user's Phase 2 vault starter uses these templates:

```
Daily/     — date, type, week, quarter, mood, energy, focus_score
Weekly/    — week, type, start_date, end_date, execution_score
Goals/     — goal, target_date, status, 12_week_cycle
Quarterly/ — quarter, type, execution_score
```

App data → vault file mapping:

| Data Type | Vault Path | Filename Format |
|-----------|-----------|----------------|
| Morning check-in | `Daily/YYYY-MM-DD-morning.md` | `2026-03-21-morning.md` |
| Evening check-in | `Daily/YYYY-MM-DD-evening.md` | `2026-03-21-evening.md` |
| Weekly reflection | `Weekly/YYYY-[W]WW.md` | `2026-W12.md` |
| Cycle goal | `Goals/[goal-title-slug].md` | `build-saas-product.md` |
| 12-week review | `Quarterly/YYYY-[Q]Q.md` | `2026-Q1.md` |
| Flow session | `Daily/YYYY-MM-DD-flow-[id].md` | `2026-03-21-flow-abc123.md` |
| Vision | `vision.md` (vault root) | `vision.md` |
| Weekly plan | `Weekly/YYYY-[W]WW-plan.md` | `2026-W12-plan.md` |

```typescript
// Source: Phase 2 vault starter templates + CONTEXT.md decisions
// src/hooks/useVaultSync.ts

export function buildCheckInNote(checkIn: CheckIn): { path: string; content: string } {
  const date = checkIn.date; // 'YYYY-MM-DD'
  const weekNum = format(parseISO(date), "yyyy-'W'ww");
  const quarter = format(parseISO(date), "yyyy-'Q'Q");
  const suffix = checkIn.type === 'morning' ? 'morning' : 'evening';

  const frontmatter = [
    '---',
    `date: ${date}`,
    `type: ${suffix}`,
    `week: ${weekNum}`,
    `quarter: ${quarter}`,
    '---',
  ].join('\n');

  // Body varies by morning vs evening check-in data
  const body = checkIn.type === 'morning'
    ? buildMorningBody(checkIn.data as MorningCheckIn)
    : buildEveningBody(checkIn.data as EveningCheckIn);

  return {
    path: `Daily/${date}-${suffix}.md`,
    content: `${frontmatter}\n\n${body}`,
  };
}
```

### Pattern 3: Fire-and-Forget Vault Write After Supabase Mutation

**What:** After each successful Supabase mutation, call `writeNote()` without awaiting it and without blocking the user-facing flow.

**When to use:** In every data hook's `onSuccess` or post-mutation callsite.

```typescript
// In useCheckIns.ts — after addMutation succeeds
// Source: CONTEXT.md pattern + existing useCheckIns.ts mutation structure

const { writeNote, obsidianMode } = useVaultContext();

const addMutation = useMutation({
  mutationFn: async ({ data, type }) => {
    // ... existing Supabase insert ...
  },
  onSuccess: (newCheckIn) => {
    queryClient.invalidateQueries({ queryKey: ['check_ins', user?.id] });
    // Vault write: fire-and-forget, never blocks UI
    if (obsidianMode) {
      const { path, content } = buildCheckInNote(newCheckIn);
      writeNote(path, content).catch(err => console.warn('[vault] write failed:', err));
    }
  },
});
```

### Pattern 4: Backfill on First Enable

**What:** When user switches to Obsidian mode for the first time, read all existing data from Supabase and write every record to the vault.

**When to use:** Triggered from Settings when the toggle fires AND the vault folder is connected.

```typescript
// In useVaultSync.ts — backfill function
export function useVaultBackfill() {
  const { writeNote } = useVaultContext();
  const queryClient = useQueryClient();

  const backfill = async () => {
    // Fetch all data types from Supabase
    const [checkIns, reflections, sessions, reviews, vision, cycle, weeklyPlans] = await Promise.all([
      supabase.from('check_ins').select('*').eq('user_id', uid),
      supabase.from('weekly_reflections').select('*').eq('user_id', uid),
      supabase.from('flow_sessions').select('*').eq('user_id', uid),
      supabase.from('twelve_week_reviews').select('*').eq('user_id', uid),
      supabase.from('vision').select('*').eq('user_id', uid).single(),
      supabase.from('cycles').select('*').eq('user_id', uid),
      supabase.from('weekly_plans').select('*').eq('user_id', uid),
    ]);

    // Write each record — sequential to avoid overwhelming FS API
    const writes: Array<{ path: string; content: string }> = [
      ...(checkIns.data ?? []).map(r => buildCheckInNote(mapRowToCheckIn(r))),
      ...(reflections.data ?? []).map(r => buildReflectionNote(mapRowToReflection(r))),
      // ... etc
    ];

    for (const { path, content } of writes) {
      await writeNote(path, content).catch(e => console.warn('[vault backfill]', path, e));
    }
  };

  return { backfill };
}
```

### Pattern 5: Settings UI — Obsidian Sync Card

**What:** New `ee-card` in Settings below the Subscription card. Toggle reveals folder picker and connection status. Wrapped in `<ProGate>`.

**When to use:** Settings.tsx

```tsx
// Source: existing Settings.tsx ee-card pattern + CONTEXT.md decisions

<ProGate feature="Obsidian vault sync">
  <div className="ee-card space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center">
        <FolderOpen className="w-5 h-5 text-[#1D4ED8]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1a1a2e]">Vault Sync</p>
        <p className="text-xs text-[#9CA3AF]">Storage: Cloud / Obsidian</p>
      </div>
      <Switch checked={obsidianMode} onCheckedChange={handleModeToggle} className="ml-auto" />
    </div>

    {obsidianMode && (
      <div className="space-y-2">
        {isConnected ? (
          <p className="text-xs text-[#6B7280]">Connected: <span className="font-medium">{dirHandle?.name}</span></p>
        ) : (
          <Button onClick={connect} variant="outline" className="w-full text-sm">
            Select Vault Folder
          </Button>
        )}
        {!isConnected && (
          <p className="text-xs text-[#9CA3AF]">Chrome/Edge required. Firefox and Safari are not supported.</p>
        )}
      </div>
    )}
  </div>
</ProGate>
```

### Anti-Patterns to Avoid

- **Awaiting vault writes in the critical save path**: vault writes are always fire-and-forget. Blocking the user on FS failure degrades UX unnecessarily — Supabase is the source of truth.
- **Storing obsidianMode in Supabase**: this is a local device preference, not cross-device state. localStorage is correct.
- **Calling `showDirectoryPicker()` without user gesture**: the browser blocks the picker if not triggered by click. Never call it on mount or in useEffect.
- **Writing directly to vault root**: always use subdirectories matching the Phase 2 vault starter (`Daily/`, `Weekly/`, `Goals/`, `Quarterly/`). Do not flatten.
- **One large aggregate file per data type**: each record is one note. This matches the vault starter and enables per-note Dataview queries.
- **Forgetting `await writable.close()`**: the file is not persisted to disk until `.close()` is called. Always close in a try/finally block.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| IndexedDB CRUD for handle storage | Raw IndexedDB boilerplate | `idb-keyval` (get/set/del) | idb-keyval is 3 lines vs 40 lines of raw IDB; widely used, well-tested |
| Permission re-verification | Custom permission polling | `queryPermission()` + `requestPermission()` | Native browser API — exact semantics match the spec |
| Nested directory creation | Custom recursive mkdir | `getDirectoryHandle(name, { create: true })` chained | The API handles this natively |
| Markdown frontmatter serialization | YAML library | Template literal strings | Obsidian frontmatter is simple key-value; a YAML parser adds 10KB+ for no benefit |

**Key insight:** The File System Access API handles all the hard parts (sandbox escaping, user permission, nested dir creation). The app only needs to format strings and call three API methods: `getDirectoryHandle`, `getFileHandle`, `createWritable`.

---

## Common Pitfalls

### Pitfall 1: "Permission Persists" vs "Permission Must Be Re-Verified"

**What goes wrong:** Developer stores the handle in IndexedDB and assumes it just works on next page load. The vault write silently fails because `createWritable()` throws `NotAllowedError`.

**Why it happens:** Permission state is NOT stored with the handle in IndexedDB. The handle survives, but the browser may have cleared the permission grant after the tab/session closed.

**How to avoid:** Always call `queryPermission({ mode: 'readwrite' })` before any write attempt. If result is `'prompt'` or `'denied'`, call `requestPermission()` — this shows a single native Chrome dialog (not a custom UI). Do this inside `writeNote()` so it's automatic.

**Warning signs:** `NotAllowedError: The request is not allowed by the user agent or the platform in the current context` from `createWritable()`.

**Note on CONTEXT.md claim:** "Permission persists across sessions" is correct for the stored handle identity but requires one `requestPermission()` call per new browser session if Chrome chose not to retain the grant. This is one small native dialog — acceptable UX and matches user expectation.

### Pitfall 2: `showDirectoryPicker()` Requires User Gesture

**What goes wrong:** Trying to auto-connect on app load or re-connect on mount causes `SecurityError: Must be handling a user gesture`.

**Why it happens:** Browser requires the picker to be triggered by an explicit user interaction (click, keydown, etc.).

**How to avoid:** Only call `showDirectoryPicker()` from button `onClick` handlers. On mount, use the stored handle (no picker needed).

**Warning signs:** `DOMException: showDirectoryPicker() must be triggered by user activation` in the console.

### Pitfall 3: Forgetting `writable.close()`

**What goes wrong:** File appears to write but data is 0 bytes or truncated when opened in Obsidian.

**Why it happens:** `FileSystemWritableFileStream` buffers writes — data is not flushed to disk until `.close()` is called.

**How to avoid:** Always use try/finally:
```typescript
const writable = await fileHandle.createWritable();
try {
  await writable.write(content);
} finally {
  await writable.close();
}
```

### Pitfall 4: Backfill Blocks the UI

**What goes wrong:** For a user with 300 check-ins, backfill takes several seconds and freezes the page.

**Why it happens:** Sequential `await writeNote()` calls in a tight loop on the main thread.

**How to avoid:** Run backfill as a background process. Show a toast like "Syncing your vault... (142/300)" and use `setTimeout(() => ..., 0)` between batches, or write a small batch loop with `requestIdleCallback`.

### Pitfall 5: Frontmatter Field Name Collision with Vault Starter

**What goes wrong:** App writes notes with frontmatter fields that differ from what the vault starter uses, breaking existing Dataview queries the user has set up.

**Why it happens:** Developer designs frontmatter independently without checking the Phase 2 vault starter templates.

**How to avoid:** Map app field names to the Phase 2 template field names exactly:
- `date` (not `created_at`)
- `week` (format: `YYYY-Www`)
- `quarter` (format: `YYYY-Qq`)
- `execution_score` (not `completionScore`)
- `type` (value: `daily`, `weekly`, `quarterly`)

The vault starter templates are at: `/root/projects/execution-engine/bundle/obsidian-vault-starter/`

### Pitfall 6: File System Access API Not Available (non-Chrome)

**What goes wrong:** User opens app in Firefox/Safari. `window.showDirectoryPicker` is `undefined`. Clicking "Select Vault Folder" crashes with a JS error.

**Why it happens:** Firefox has explicitly marked this API as "harmful". Safari has no support.

**How to avoid:** Guard all vault API calls with a feature check:
```typescript
const isVaultSupported = () => 'showDirectoryPicker' in window;
```
Show a note in Settings: "Vault sync requires Chrome or Edge." Hide the folder picker button and disable the toggle if not supported.

---

## Code Examples

Verified patterns from official sources:

### showDirectoryPicker with permission mode

```typescript
// Source: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
await set('vault-directory-handle', dirHandle); // idb-keyval
```

### Permission verification before write

```typescript
// Source: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access#stored_file_or_directory_handles_and_permissions
async function verifyPermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
  const opts = { mode: 'readwrite' as FileSystemPermissionMode };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  if ((await handle.requestPermission(opts)) === 'granted') return true;
  return false;
}
```

### Write a Markdown file to a subdirectory

```typescript
// Source: MDN FileSystemDirectoryHandle docs
async function writeNote(dirHandle: FileSystemDirectoryHandle, path: string, content: string) {
  const parts = path.split('/');
  const filename = parts.pop()!;
  let dir = dirHandle;
  for (const part of parts) {
    dir = await dir.getDirectoryHandle(part, { create: true });
  }
  const fileHandle = await dir.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  try {
    await writable.write(content);
  } finally {
    await writable.close();
  }
}
```

### Restore handle from IndexedDB on page load

```typescript
// Source: idb-keyval docs + Chrome File System Access API guide
import { get } from 'idb-keyval';

useEffect(() => {
  get('vault-directory-handle').then(async (handle: FileSystemDirectoryHandle | undefined) => {
    if (!handle) return;
    const perm = await handle.queryPermission({ mode: 'readwrite' });
    if (perm === 'granted') setDirHandle(handle);
    // If 'prompt': wait for user to interact; do not call requestPermission() here
    // (requires user gesture — defer to next write attempt)
  });
}, []);
```

### Feature detection guard

```typescript
// Source: MDN compatibility notes
const isVaultApiSupported = (): boolean =>
  typeof window !== 'undefined' && 'showDirectoryPicker' in window;
```

---

## Vault Folder → Data Type Mapping

Reference for the Markdown formatter functions:

| App Data Type | Vault Folder | Filename Pattern | Key Frontmatter Fields |
|--------------|-------------|-----------------|----------------------|
| Morning check-in | `Daily/` | `YYYY-MM-DD-morning.md` | `date, type: morning, week, quarter` |
| Evening check-in | `Daily/` | `YYYY-MM-DD-evening.md` | `date, type: evening, week, quarter` |
| Flow session | `Daily/` | `YYYY-MM-DD-flow-[id].md` | `date, type: flow, duration_minutes` |
| Weekly reflection | `Weekly/` | `YYYY-Www.md` | `week, type: weekly, execution_score` |
| Weekly plan | `Weekly/` | `YYYY-Www-plan.md` | `week, type: weekly-plan` |
| Cycle goal | `Goals/` | `[slug].md` | `goal, status, 12_week_cycle` |
| 12-week review | `Quarterly/` | `YYYY-Qq.md` | `quarter, type: quarterly, execution_score` |
| Vision | (vault root) | `vision.md` | `type: vision` |

Notes:
- Week format: `date-fns` `format(date, "yyyy-'W'ww")` → `2026-W12`
- Quarter format: `date-fns` `format(date, "yyyy-'Q'Q")` → `2026-Q1`
- Goal slugs: `title.toLowerCase().replace(/[^a-z0-9]+/g, '-')` — stable slug for upsert behavior

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| File download (Blob + anchor) | File System Access API (direct folder write) | Chrome 86 (2020) | Can write to specific folder, not just trigger download |
| `webkitdirectory` input | `showDirectoryPicker()` | Chrome 86 | Proper async API with handle persistence |
| Raw IndexedDB for handle storage | `idb-keyval` | Always (ergonomics) | 3-line CRUD vs 40-line IDB boilerplate |

**Deprecated/outdated:**
- `window.requestFileSystem` (Chrome File System API, pre-2020): deprecated, sandboxed, no access to real user files. Do not use.
- `webkitGetAsEntry()` on drag-and-drop: read-only, no write support.

---

## Open Questions

1. **Permission re-prompt UX on new browser session**
   - What we know: Chrome may require `requestPermission()` after session restart. This shows a native browser dialog.
   - What's unclear: How often Chrome retains permission vs forces re-prompt (depends on Chrome's permission model, not deterministic).
   - Recommendation: Accept it — the native dialog is brief and Chrome typically retains permission for trusted origins. Log a warning if permission is denied; show a "Reconnect vault" button in Settings.

2. **Slug collision for goal filenames**
   - What we know: Goal titles like "Build SaaS product" → `build-saas-product.md`. If user renames a goal, the old file remains and a new one is created.
   - What's unclear: Whether this causes noticeable clutter for power users.
   - Recommendation: Use the goal's Supabase `id` in the filename for uniqueness (`goal-[id].md`) but include the slug for readability: `goal-[slug]-[short-id].md`. Decide at plan time.

3. **`requestPermission()` outside user gesture (background re-verify)**
   - What we know: `requestPermission()` requires a user gesture. Background auto-reconnect on mount is not possible if permission was cleared.
   - What's unclear: Whether `queryPermission()` returning `'prompt'` can be silently handled (defer to next user click).
   - Recommendation: On mount, only call `queryPermission()`. If result is `'granted'`, restore handle silently. If `'prompt'`, set a `needsReconnect` flag and show "Reconnect vault" UI in Settings — do NOT call `requestPermission()` on mount.

---

## Sources

### Primary (HIGH confidence)

- MDN Web Docs — File System Access API — https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API — full API reference, permission model
- Chrome Developers — File System Access — https://developer.chrome.com/docs/capabilities/web-apis/file-system-access — `verifyPermission()` pattern, IndexedDB storage, user gesture requirement
- idb-keyval README — https://github.com/jakearchibald/idb-keyval — get/set/del API
- Direct codebase audit: `/root/projects/flow-year-coach/src/` — all hooks, Settings.tsx, ProGate.tsx, SubscriptionContext.tsx
- Phase 2 vault starter templates: `/root/projects/execution-engine/bundle/obsidian-vault-starter/` — frontmatter schemas

### Secondary (MEDIUM confidence)

- caniuse.com — native-filesystem-api — Chrome 86+, Edge 86+, Firefox: not supported, Safari: not supported

### Tertiary (LOW confidence — verify at implementation)

- Chrome permission retention duration across sessions: behavior varies by Chrome version and site trust level; test empirically during implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — File System Access API is well-documented on MDN + Chrome Developers; idb-keyval is stable at v6
- Architecture: HIGH — pattern is derived from official API examples + direct codebase audit of existing hooks and Settings patterns
- Frontmatter design: MEDIUM — derived from Phase 2 vault starter templates (verified); exact field naming is Claude's Discretion
- Permission model: HIGH — verified from Chrome Developers official docs
- Pitfalls: HIGH — derived from API spec behavior (verified) + common implementation errors documented in official sources

**Research date:** 2026-03-21
**Valid until:** 2026-05-21 (File System Access API is stable; Chrome 86+ support established since 2020)

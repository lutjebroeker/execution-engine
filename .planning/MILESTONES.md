# Milestones

## v1.0 — LifeEngine (Gumroad Bundle)

**Completed:** 2026-03-21
**Phases:** 1–4
**Last phase number:** 5 (Phase 5 planned but superseded by v2.0 pivot)

### What shipped

| Phase | Name | Delivered |
|-------|------|-----------|
| 1 | Landing Page | HTML landing page at execution-engine-lake.vercel.app, waitlist capture via Supabase |
| 2 | AM Bundle Packaging | 22 n8n workflows exported, README setup guide, Obsidian Vault Starter, Gumroad listing |
| 3 | Web App Pro Tier | Supabase auth + cloud sync, Stripe subscription (€19.99/mo), Claude AI coaching, Vercel deploy |
| 4 | Obsidian Vault Sync | File System Access API vault writer, Settings UI storage switch, VaultProvider + useVaultSync |

### What was NOT shipped (superseded)

- Phase 5: Hosted VPS Package — superseded by v2.0 multi-tenant architecture

### Key validated decisions carried forward

- Claude API with tool-use is the right AI architecture (no Ollama per-client)
- Supabase as data layer
- Telegram as the primary client interaction channel
- n8n on Proxmox as orchestration layer
- engine-site (Astro + Tailwind) as primary landing page

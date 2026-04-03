# Engine Ecosystem — Status & Gap Analysis
> Gebaseerd op Master Plan v4.1 (2026-04-03)
> Dit document vergelijkt wat er bestaat met wat het masterplan vereist.

---

## 1. WAT ER AL STAAT

### engine-site (lutjebroeker/engine-site)
**Status:** ✅ Live op https://engine-site-six.vercel.app

| Component | Gebouwd | Werkt |
|-----------|---------|-------|
| Landing page (Hero, Problem, HowItWorks, Pricing, etc.) | ✅ | ✅ |
| `/score` Execution Score Assessment (10 vragen, 4 tiers) | ✅ | Deels |
| ScoreQuiz.astro — submit naar Supabase + n8n webhook | ✅ code | ❌ Supabase tabel mist |
| supabase.ts client | ✅ | ❌ env vars niet ingesteld in Vercel |
| n8n webhook URL (`n8n.jellespek.nl/webhook/score-submission`) | ✅ in config | ❌ workflow bestaat niet |
| Booking link (Cal.com/Calendly) | ❌ `'#'` in config.ts | — |
| OG image | ✅ (SVG) | ✅ |

**Wat ontbreekt in engine-site:**
1. Supabase tabel `score_submissions` aanmaken
2. Vercel env vars: `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY`
3. Cal.com of Calendly URL in `src/config.ts → urls.bookCall`
4. n8n workflow op `n8n.jellespek.nl` die scorecard submissions verwerkt

---

### execution-engine (lutjebroeker/execution-engine) — DIT REPO
**Status:** ⚠️ Masterplan zegt: archiveren / redirecten

| Wat er zit | Nieuwe status |
|------------|--------------|
| Oude landing page (execution-engine-lake.vercel.app) | ❌ Verkeerde pricing (€4.997/€2.497 + Gumroad) — offline halen |
| AM bundle (22 workflows, Node-RED, Ollama) | 🗂️ Referentie voor eigen gebruik — niet meer het product |
| Phase 1–4 GSD planning (.planning/) | 🗂️ Archief — superseded |
| Phase 5 VPS plan (net gemaakt) | ❌ Superseded door nieuwe infra-aanpak |

**Actie:** repo archiveren, domein redirecten naar engine-site-six.vercel.app of toekomstig execution-engine.com.

---

### Proxmox / eigen infra
**Status:** Deels operationeel (gebaseerd op wat bekend is)

| Component | Status |
|-----------|--------|
| Proxmox server | ✅ Draait |
| n8n (n8n.jellespek.nl) | ✅ Bereikbaar (webhook URL werkt in config.ts) |
| Ollama | ✅ Aanwezig (gebruikt in oude AM bundle) |
| Cloudflare Tunnel | Vermoedelijk ✅ (n8n heeft publiek URL) |
| Supabase project (eigen) | ❓ Onbekend of aangemaakt |
| EE systeem voor jezelf | ❌ Niet gebouwd |

---

### Overige repos

| Repo | Relevant voor masterplan | Status |
|------|--------------------------|--------|
| `intelligence_engine` | IE workflows (Phase 3+) | Bestaat, last push 2026-03-16, geen tree zichtbaar |
| `n8n-workflows` | Starfleet — 70% herbruikbaar | Bestaat, last push 2026-02-14 |
| `flow-year-coach` | EE App (ex-Flow Year Coach) | Bestaat, last push 2026-03-22 |
| `engine-infra` | Docker + client deploy scripts (Phase 1) | ❌ Bestaat nog niet |
| `engine-intelligence` | IE + Publish Engine | ❌ Bestaat nog niet |

---

## 2. WAT HET MASTERPLAN VEREIST (per fase)

### Phase 1: BUILD & USE — jouw eigen EE systeem (4–6 weken)
**Doel:** 2+ weken dagelijks check-ins + execution scores. Systeem werkt zonder n8n aanraken.

| Taak | Repo | Status |
|------|------|--------|
| Docker Compose op Proxmox: n8n + Cloudflare Tunnel | `engine-infra` (nieuw) | ❌ |
| Supabase project + volledig schema | — | ❌ |
| Telegram bot geconfigureerd | — | ❌ |
| Core workflow: Telegram → Claude API (tools) → Telegram | n8n | ❌ |
| System prompt: EE sectie | — | ❌ |
| Tools: `manage_goal`, `log_progress`, `get_goals_overview` | n8n/Supabase | ❌ |
| Crons: morning 07:00, check-in 17:00, weekly review zo 18:00 | n8n | ❌ |
| PE basics: `save_memory`, `search_memory` | n8n/Supabase | ❌ |
| Keystone extraction (vault → operating system) | n8n/Claude | ❌ |
| **2+ weken zelf gebruiken + screenshots** | — | ❌ |

**Supabase schema dat aangemaakt moet worden:**
```sql
conversations (id, channel, role, content, metadata, created_at)
config (key, value, updated_at)
goals (id, title, description, deadline, status, progress_pct, milestones, created_at, updated_at)
goal_logs (id, goal_id, log_type, content, created_at)
daily_priorities (id, date, priorities, reflection, created_at)
weekly_reviews (id, week_start, summary, wins, blockers, execution_score, created_at)
-- + later: memory, knowledge, topics, staging_items, content_items
```

---

### Phase 2: PUBLISH ENGINE (parallel aan Phase 1 dogfooding, 2–3 weken)
**Doel:** Content pipeline draait. IE signaal → Claude draft → Telegram review → gepubliceerd op LinkedIn + X.

| Taak | Repo | Status |
|------|------|--------|
| Postiz deployen op Proxmox (Docker, pin v2.11.3) | Proxmox | ❌ |
| LinkedIn + X koppelen via Postiz OAuth | Postiz | ❌ |
| Supabase: `content_items` + `published_posts` tabellen | eigen project | ❌ |
| n8n Workflow 2: draft generation (idee → Claude → Supabase) | n8n | ❌ |
| n8n Workflow 4: scheduled publishing (cron → Postiz API) | n8n | ❌ |
| Migreren van Ziplined: brand voice → Claude system prompt | — | ❌ |
| Workflow 3 (Telegram approve/reject): later, als volume het vraagt | n8n | ⏸️ |
| YouTube/Instagram/TikTok: later | — | ⏸️ |

---

### Phase 3: PRODUCTIZE & MARKET (3–4 weken)
**Doel:** Pilot client onboarden in <4 uur. Scorecard werkt. Content via Publish Engine.

| Taak | Repo | Status |
|------|------|--------|
| Supabase `score_submissions` tabel aanmaken | Supabase | ❌ |
| Vercel env vars instellen voor engine-site | Vercel | ❌ |
| n8n webhook voor scorecard submissions | n8n.jellespek.nl | ❌ |
| Cal.com/Calendly link in `engine-site/src/config.ts` | engine-site | ❌ |
| Client onboarding script (Hetzner → Docker → Supabase → bot) | `engine-infra` | ❌ |
| Templatized system prompt met `{{variables}}` | engine-infra | ❌ |
| Onboarding playbook (stap-voor-stap doc) | engine-infra | ❌ |
| Test: deploy voor één vriend, tijd de process | — | ❌ |
| Oude execution-engine site offline/redirect | Vercel/GitHub | ❌ |
| LinkedIn content 2–3×/week via Publish Engine | — | ❌ |
| IE MVP voor jezelf (RSS + Ollama + briefing) | engine-intelligence | ❌ |

---

### Phase 4: PILOT (6–8 weken)
**Doel:** 3–5 pilot clients @ €997. Data + quotes.

| Taak | Status |
|------|--------|
| Scorecard CTA op LinkedIn | ❌ |
| Email waitlist pilot offer (€997) | ❌ |
| Persoonlijk outreach 10–20 scorecard respondenten | ❌ |
| 1 client/week onboarden | ❌ |
| Week 4 check-ins + refund checkpoint | ❌ |
| Week 12: case studies met before/after execution scores | ❌ |

---

## 3. ARCHITECTUURVERSCHILLEN: OUD VS. NIEUW

### Infra per client

| Aspect | Oud (execution-engine plan) | Nieuw (masterplan v4.1) |
|--------|----------------------------|------------------------|
| Server | Hostinger KVM2 (€10/mo) | **Hetzner CX22 (€5/mo)** |
| Kosten model | €49/mo all-in (Jelle betaalt VPS) | **€50/mo managed hosting add-on** |
| Dataopslag | n8n Data Tables + Obsidian vault | **Supabase Cloud per client** |
| AI routing | Ollama (lokaal) + Claude API | **Claude API only** (geen Ollama per client) |
| Vault bridge | Node-RED `/find_file` + `/create_file` | **Geen** — Supabase is de datastore |
| Workflow logica | 22 afzonderlijke n8n workflows | **1 centrale workflow: Telegram → Claude API met tools** |
| Features toevoegen | Nieuwe workflow bouwen | **System prompt aanpassen + optioneel tool toevoegen** |
| SSL | Caddy self-signed / self-managed | **Caddy met auto-SSL (Let's Encrypt)** |

### AI agent architectuur

**Oud:** 22 workflows, elk met eigen logica en Config nodes.

**Nieuw:**
```
Telegram bericht
  → n8n webhook (3 nodes)
  → Claude API met tools (manage_goal, log_progress, search_knowledge, save_memory…)
  → Claude besluit wat er moet gebeuren
  → Tool calls → n8n voert uit (Supabase queries)
  → Claude genereert antwoord
  → n8n stuurt terug naar Telegram
```
Nieuwe feature = system prompt editen. Geen nieuwe workflow.

---

## 4. WAT WE UIT DE OUDE CODEBASE MEENEMEN

Uit `n8n-workflows` (Starfleet) — ~70% herbruikbaar:

| Bestaande workflow | Hergebruik |
|--------------------|------------|
| AM Telegram hub (26 nodes) | ✅ Direct — centrale router |
| Morning/Evening routines | ✅ Direct — reflectievragen via Telegram |
| Weekly Review/Planning (Claude) | ✅ Direct — zo/ma |
| Quarterly Review/Create Cycle | ✅ Direct |
| IE RSS/Reddit scrapers | ✅ Direct |
| IE Score & Summarize (Ollama) | ✅ Direct |
| Slack agent router | ✅ Direct |
| Waitlist handlers | ✅ Direct |
| Claude via SSH | 🔧 Aanpassen → directe Claude API met tool-use |
| Obsidian datastore | 🔧 Aanpassen → Supabase voor clients |
| AI Agent chat memory | 🔧 Aanpassen → Supabase pgvector |
| Morning + IE digest | 🔧 Samenvoegen → gecombineerde cross-engine briefing |
| Contradiction detector | ❌ Nieuw bouwen |
| Publish Engine workflows | ❌ Nieuw bouwen |

---

## 5. VALIDATIE GATE (voordat pilots starten)

Priestley 30/150 test — dit moet eerst:

```
150  LinkedIn connecties die regelmatig content zien
 30  Mensen die de Execution Score Assessment invullen
 10  Gesprekken (DM, call, reply) over execution/accountability
  3  Mensen die zeggen "I'd pay for that" of "When can I start?"
```

**Timeline:** 6–8 weken na eerste LinkedIn post.

**Scorecard werkt pas als:**
- Supabase tabel bestaat
- Vercel env vars ingesteld zijn
- n8n webhook actief is op n8n.jellespek.nl

---

## 6. SAMENVATTING: PRIORITEITSVOLGORDE

### Nu (deze week) — Phase 3 quick wins, 2–4 uur werk
1. `score_submissions` tabel aanmaken in Supabase
2. Vercel env vars instellen voor engine-site
3. Cal.com/Calendly account aanmaken → link in config.ts
4. n8n webhook workflow bouwen voor scorecard submissions (Telegram notificatie + opslaan)
5. Oude execution-engine site offline / redirect instellen

### Daarna — Phase 1 (de echte bouw, 4–6 weken)
6. `engine-infra` repo aanmaken
7. Docker Compose op Proxmox: n8n + Caddy + Cloudflare Tunnel
8. Supabase schema volledig uitrollen
9. Core Telegram → Claude API workflow bouwen
10. Crons: morning / check-in / weekly review
11. **2 weken zelf gebruiken**

### Parallel aan Phase 1 dogfooding — Phase 2
12. Postiz deployen op Proxmox
13. LinkedIn + X OAuth koppelen
14. Draft generation workflow (Workflow 2)
15. Scheduled publishing (Workflow 4)

---

## 7. REPOS OVERZICHT (eindstand)

| Repo | Doel | Actie |
|------|------|-------|
| `lutjebroeker/engine-site` | Landing page + scorecard | ✅ Actief — quick wins uitvoeren |
| `lutjebroeker/execution-engine` | Oud product (dit repo) | ⚠️ Archiveren na redirect |
| `lutjebroeker/engine-infra` | Docker configs + client deploy scripts | ❌ Aanmaken (Phase 1) |
| `lutjebroeker/engine-intelligence` | IE workflows + Publish Engine | ❌ Aanmaken (Phase 2–3) |
| `lutjebroeker/flow-year-coach` | EE App (React) — later rebranden | ⏸️ Later |
| `lutjebroeker/n8n-workflows` | Starfleet — bronmateriaal | 🗂️ Referentie |
| `lutjebroeker/intelligence_engine` | Mogelijk IE basis | ❓ Beoordelen vs. engine-intelligence |

---

*Gegenereerd op basis van Master Plan v4.1 (ENGINE ECOSYSTEM — MASTER PLAN) + codebase analyse.*

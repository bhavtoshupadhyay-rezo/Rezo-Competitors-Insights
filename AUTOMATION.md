# Automation Brief — Rezo Intelligence Hub

> **How to use this document:** Hand this to Claude Code (or any engineer) in a
> fresh session along with the repo. It is self-contained — no prior context
> needed. Each workflow below has a schedule, inputs, outputs, sample artifact,
> and acceptance criteria. Implement in the order listed (Phase 1 first).

---

## 1. Why this exists

The current platform at `/Users/Bhavtosh-Upadhyay/competitor-insights-platform/`
is a static React dashboard for tracking competitors, AI voices, and language
normalization vendors. Today it requires a human to log in and look around.

We want it to **push insights to people instead of pulling people to it.**
Specifically: every Monday a weekly digest email lands in stakeholder inboxes
with what changed in the market last week.

## 2. Existing assets the automation must reuse

| File / Endpoint | Shape | Purpose |
|---|---|---|
| [src/data/competitorsData.js](src/data/competitorsData.js) | Array of 14+ company objects | Competitor master data |
| [src/data/topVoicesData.js](src/data/topVoicesData.js) | Array of global voice models | Voice AI catalog |
| [src/data/indianVoicesData.js](src/data/indianVoicesData.js) | Array of Indic-native voices | India-focused voice catalog |
| [src/data/languageNormalizationData.js](src/data/languageNormalizationData.js) | Array of normalization vendors + feature matrix | Normalization tracker |
| [src/data/aiNewsData.js](src/data/aiNewsData.js) | Array of editorial news items | Curated analyst notes |
| `GET /api/news` (server) | RSS-aggregated AI/voice headlines | Live news feed (15-min cache) |
| `POST /api/news/refresh` | Force-refetch all RSS feeds | Manual refresh trigger |

**Each data object's relevant fields** are documented at the top of the file
itself (search for the `// ────────── ` section headers). Don't reinvent the
schema — read the existing files.

---

## 3. The seven workflows

### Workflow 1 — Weekly Competitor Digest 📧

**Purpose:** Monday morning email to leadership with what moved in the
competitor landscape last week.

| Attribute | Value |
|---|---|
| **Schedule** | Every Monday at 09:00 IST (cron: `0 9 * * 1` in `Asia/Kolkata`) |
| **Inputs** | `competitorsData`, `aiNewsData`, live `/api/news` items from last 7 days |
| **Output** | HTML email + plain-text fallback |
| **Recipients** | List from `AUTOMATION_EMAIL_RECIPIENTS` env var (comma-separated) |

**Logic:**

1. Diff `competitorsData` against snapshot from previous run (stored at
   `automation/snapshots/competitors-YYYY-MM-DD.json`). Detect:
   - Changes to `totalFunding`, `lastRound`, `lastRoundDate`, `estimatedARR`
   - New entries in `recentFeatures` with `launchDate >= last 7 days`
   - New entries in `painPoints`
   - Buzz score deltas > 5 points
2. From `aiNewsData` + live RSS items, filter where:
   - `publishedAt >= last 7 days` AND
   - (`impact === 'high'` OR `related` includes any tracked competitor)
3. Detect new entrants: companies where `founded >= current year - 1` and not
   in last week's snapshot.

**Email sections (in order):**

```
Subject: Rezo Competitor Pulse — Week of {{date}}

1. TL;DR (3 bullets, top movers)
2. 🆕 New Entrants Detected ({count})
3. 💰 Funding Activity ({count rounds})
4. 🚀 Feature Launches ({count features})
5. ⚠️ High-Impact News ({count stories with Rezo Takeaway})
6. 📊 Buzz Score Movers (top 3 climbers, top 3 fallers)
7. Footer: link to dashboard, unsubscribe instructions
```

**Sample output:** see [Section 9 — Email Templates](#9-sample-email-templates).

**Acceptance:**
- Email sends successfully Monday 09:00 IST
- All numbers are accurate vs. underlying data
- Email renders correctly in Gmail, Outlook, mobile Gmail app
- Plain-text fallback works in mail clients without HTML

---

### Workflow 2 — Weekly Top Voices Digest 🎙

**Purpose:** Tuesday morning email tracking the voice AI infra landscape.

| Attribute | Value |
|---|---|
| **Schedule** | Every Tuesday at 09:00 IST (cron: `0 9 * * 2` in `Asia/Kolkata`) |
| **Inputs** | `topVoicesData`, `indianVoicesData`, AI News items tagged `relatedVoices` |
| **Output** | HTML email |
| **Recipients** | Same as Workflow 1 + voice engineering team |

**Logic:**

1. Top 5 voices by `buzzScore` (mark any with `isNew: true` with a 🆕 badge).
2. Top 3 voices by lowest `latencyMs`.
3. Top 3 Indian voices (from `indianVoicesData`) by `buzzScore`.
4. Any voice-related news from last 7 days (filter where `relatedVoices`
   non-empty and `publishedAt >= 7 days ago`).
5. **Latency / pricing movements**: diff against last week's snapshot. Flag
   any voice whose `latencyMs` dropped > 20% or `pricing` changed.

**Email sections:**

```
Subject: Voice AI Weekly — Week of {{date}}

1. 🏆 This Week's Top 5 (with latency, price, buzz badges)
2. 🇮🇳 Indic Voices Update (top 3 Indian-native voices)
3. ⚡ Latency Movers (anyone who got faster this week)
4. 💸 Pricing Movers (anyone who changed pricing)
5. 📰 Voice News (filtered AI News for voice-tagged items)
6. Footer: dashboard link
```

**Acceptance:**
- Sends Tuesday 09:00 IST
- Audio sample links to provider demo URLs (no broken links)
- "NEW" badge only on items with `isNew: true`

---

### Workflow 3 — Weekly Language Normalization Digest 🌐

**Purpose:** Wednesday email focused on Indic NLP + normalization vendors.
Especially relevant for product/eng teams building Indian-language features.

| Attribute | Value |
|---|---|
| **Schedule** | Every Wednesday at 09:00 IST (cron: `0 9 * * 3` in `Asia/Kolkata`) |
| **Inputs** | `normalizationCompanies`, `normalizationFeatures` |
| **Output** | HTML email with embedded matrix table |
| **Recipients** | Same as Workflow 1 + NLP/Indic engineering leads |

**Logic:**

1. Re-render the feature-coverage matrix as an HTML `<table>` (cap at top 8
   vendors by `featureCount`).
2. Diff against last week's snapshot. Flag any vendor where a `features.*`
   bit flipped from `false` to `true` — that's a new capability shipped.
3. Add a "Best for" recommendation block based on common Rezo use cases
   (BFSI, Tier 2/3, code-mixed Hinglish).
4. Highlight any India-region vendor's new milestone.

**Email sections:**

```
Subject: Language Normalization Weekly — Week of {{date}}

1. 📊 Coverage Matrix (top 8 vendors × 12 features)
2. 🆕 New Capabilities Shipped (vendors who flipped a feature bit this week)
3. 🇮🇳 Indian Vendor Spotlight (1 vendor / week, rotate)
4. 🎯 Best-for Recommendations (BFSI / Code-mixed / 22 Langs)
5. Footer: dashboard link
```

**Acceptance:**
- Sends Wednesday 09:00 IST
- Matrix renders correctly in HTML email (use inline CSS, no flexbox)
- Snapshot diff catches genuine vendor capability additions

---

### Workflow 4 — Real-time High-Impact News Alert 🚨

**Purpose:** Don't wait for Monday digest if something material happens.

| Attribute | Value |
|---|---|
| **Schedule** | Triggered by every `/api/news/refresh` (i.e. every 6 hours from frontend auto-refresh, or whenever cron job runs — see Workflow 5) |
| **Inputs** | Output of `fetchLiveNews({ force: true })` |
| **Output** | Slack message (preferred) OR email |
| **Recipients** | Slack channel `#rezo-competitive-intel` (env var `SLACK_WEBHOOK_URL`) |

**Logic:**

1. For each item where `impact === 'high'` AND not previously seen
   (hash of `title + source` stored in `automation/seen-news.json`):
   - Post one Slack message with:
     - 🔴 emoji + title (linkified)
     - Source + relative time
     - Affected parameters (chips)
     - One-line summary
2. Dedupe so the same story doesn't alert twice.
3. Rate-limit: max 5 alerts per refresh cycle (otherwise batch into a "5+ new
   high-impact items — see dashboard" summary message).

**Slack message format:**

```
🔴 *Bland AI raises $150M Series C*
   _TechCrunch · 2 hours ago · Global · Funding_
   Bland AI closed a $150M Series C led by Sequoia at a $1.2B valuation...
   📍 Affects: Funding & ARR, Market Position
   <https://techcrunch.com/.../bland-ai-series-c|Read full story →>
```

**Acceptance:**
- Same story never alerts twice (test by force-running twice)
- Only fires for `impact: high`
- Posts to Slack within 10 seconds of news appearing in cache

---

### Workflow 5 — Auto Data Refresh 🔄

**Purpose:** Keep the dashboard's live news current without anyone clicking
refresh. Also generate snapshots used by Workflows 1–3.

| Attribute | Value |
|---|---|
| **Schedule** | Every 6 hours (cron: `0 */6 * * *` in `Asia/Kolkata`) |
| **Inputs** | RSS feeds (handled by existing `fetchLiveNews()`) |
| **Output** | Updated cache + snapshot files in `automation/snapshots/` |
| **Recipients** | None (background job) |

**Logic:**

1. Call `fetchLiveNews({ force: true })`.
2. Save `automation/snapshots/news-YYYY-MM-DD-HH.json`.
3. Once daily (06:00 IST), also snapshot `competitorsData`, `topVoicesData`,
   `indianVoicesData`, `normalizationCompanies` → JSON files dated
   `competitors-YYYY-MM-DD.json` etc.
4. Trigger Workflow 4 (high-impact alerts) after each refresh.
5. Garbage-collect snapshots older than 60 days.

**Acceptance:**
- Snapshots accumulate daily, prune after 60 days
- News cache stays fresh (< 6 hr old)
- High-impact alerts fire from cron, not just from frontend clicks

---

### Workflow 6 — Field Notes Nudge 📝

**Purpose:** Get sales + CSM teams to log what they hear about competitors from
real customer calls. The Field Intelligence section in
[CompanyDetailModal](src/components/CompanyDetailModal.jsx) holds these notes —
currently empty for most companies.

| Attribute | Value |
|---|---|
| **Schedule** | Every Friday at 16:00 IST (cron: `0 16 * * 5` in `Asia/Kolkata`) |
| **Inputs** | List of competitors with `< 2 field notes` in last 30 days |
| **Output** | Personalized Slack DM (or email) per CSM/AE |
| **Recipients** | Sales team list from `AUTOMATION_SALES_TEAM` env var |

**Logic:**

1. For each competitor with low field-note volume, draft a one-line prompt:
   "Anything new from customers about *Bland AI* this week? Log here → {link}"
2. Pick top 3 competitors to nudge per person (rotate so it's not repetitive).
3. Slack DM each rep individually (or one summary email if no Slack).

**Acceptance:**
- Doesn't spam — same rep won't get nudged about same competitor 2 weeks in a row
- Click-through link goes directly to that competitor's Field Intel tab
- Sales team can opt out via reply

---

### Workflow 7 — New Entrant Auto-Discovery 🕵️

**Purpose:** Surface voice/contact-center AI startups before they show up in
"obvious" places. Feeds the New Entrant Scanner.

| Attribute | Value |
|---|---|
| **Schedule** | Daily at 07:00 IST (cron: `0 7 * * *` in `Asia/Kolkata`) |
| **Inputs** | RSS feeds, Crunchbase RSS (if available), HN front page, ProductHunt RSS |
| **Output** | New candidates appended to a queue at `automation/candidates.json` |
| **Recipients** | None (review queue) |

**Logic:**

1. Scan RSS for phrases like *"voice AI startup raises seed"*, *"emerges
   from stealth voice agents"*, *"YC voice AI"*, etc.
2. Extract company name (regex on title + first sentence).
3. Cross-reference with existing `competitorsData` — skip if known.
4. Append to `automation/candidates.json` with:
   ```json
   {
     "discoveredAt": "2026-05-08T07:00:00Z",
     "name": "Phonely",
     "source": "TechCrunch",
     "url": "https://...",
     "snippet": "...",
     "matchScore": 65,
     "reviewed": false
   }
   ```
5. Include the top 3 unreviewed candidates in the Monday digest (Workflow 1).

**Acceptance:**
- No duplicates with existing competitors
- Matches at least 3 real startups per month from real RSS data
- Discovery queue accessible from dashboard (new tab or section)

---

## 4. Implementation architecture

### Directory layout

```
automation/
├── index.js                 — bootstrap: load all jobs, start cron scheduler
├── jobs/
│   ├── weeklyCompetitorDigest.js
│   ├── weeklyVoicesDigest.js
│   ├── weeklyNormalizationDigest.js
│   ├── realtimeNewsAlert.js
│   ├── dataRefresh.js
│   ├── fieldNotesNudge.js
│   └── newEntrantDiscovery.js
├── lib/
│   ├── emailer.js           — SMTP wrapper (Resend / SendGrid / Nodemailer)
│   ├── slack.js             — Slack webhook wrapper
│   ├── snapshots.js         — read/write/diff snapshot helpers
│   ├── renderEmail.js       — HTML email templating (use MJML or plain HBS)
│   └── logger.js            — structured logging (pino or just console.log)
├── templates/
│   ├── competitorDigest.hbs
│   ├── voicesDigest.hbs
│   └── normalizationDigest.hbs
├── snapshots/               — daily JSON snapshots, gitignored
└── logs/                    — run logs, gitignored
```

### Libraries to use

| Need | Recommended |
|---|---|
| Cron scheduling | [`node-cron`](https://www.npmjs.com/package/node-cron) (in-process) — *or* deploy with Render Cron Jobs |
| Email sending | [Resend](https://resend.com) (simple API, free tier) or [SendGrid](https://sendgrid.com) |
| Slack | Native `fetch` to Slack incoming webhook URL — no SDK needed |
| Templating | [Handlebars](https://handlebarsjs.com) for HTML emails — keep templates inline-CSS for compatibility |
| HTML email CSS | Use [MJML](https://mjml.io) if you want responsive email, or hand-write inline-CSS tables |
| Date math | [date-fns](https://date-fns.org) — already lightweight |
| Logging | `pino` or just structured `console.log` with timestamps |

### Wiring into the existing server

The current server is at [server/index.js](server/index.js). Two options:

- **Option A (simpler):** add a separate Node process `automation/index.js`
  that boots cron jobs in-process. Runs alongside `server/index.js`. One extra
  service to deploy. Same Render Blueprint.
- **Option B (cloud-native):** use Render Cron Jobs (or GitHub Actions cron).
  Each workflow becomes a separate scheduled job that invokes a one-shot
  Node script. Cleaner failure isolation. Recommended for production.

Either way, the **jobs themselves** are stateless functions that read data
files + snapshots and produce emails/Slack messages. Choose deployment shape
based on org infra preferences.

### Environment variables required

```
# .env
NODE_ENV=production
SITE_PASSWORD=...                    # already in use, see DEPLOY.md

# Email
RESEND_API_KEY=re_...               # if using Resend
FROM_EMAIL=intel@rezo.ai
AUTOMATION_EMAIL_RECIPIENTS=ceo@rezo.ai,product@rezo.ai,sales-leadership@rezo.ai
AUTOMATION_SALES_TEAM=ae1@rezo.ai,csm1@rezo.ai,...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_CHANNEL_HIGH_IMPACT=#rezo-competitive-intel

# Optional — auto-discovery feeds
CRUNCHBASE_API_KEY=...              # if available, else skip Workflow 7
PRODUCTHUNT_API_KEY=...             # if available
```

### Failure handling

- Wrap each job in try/catch
- On failure, log to `automation/logs/YYYY-MM-DD.log` AND post to Slack
  `#rezo-intel-ops` channel via separate webhook
- Retry once after 5 min; if still failing, give up and alert
- Never let a failed job block other jobs

---

## 5. Phasing

**Phase 1 — Weekly digests (ship first)**
1. Workflow 5 (data refresh — generates snapshots that everything else needs)
2. Workflow 1 (competitor digest) — biggest stakeholder value
3. Workflow 2 (voices digest)

**Phase 2 — Real-time + nudges**
4. Workflow 4 (high-impact Slack alerts)
5. Workflow 3 (normalization digest)
6. Workflow 6 (field notes nudge)

**Phase 3 — Discovery**
7. Workflow 7 (new entrant auto-discovery)

Ship Phase 1 in one week; Phase 2 in the following week; Phase 3 once Phase
1–2 are stable.

---

## 6. Acceptance criteria (overall)

A reviewer should be able to verify each of these:

- [ ] Monday at 09:00 IST, recipient inboxes contain a Rezo Competitor Pulse email with accurate numbers
- [ ] Tuesday — Voice AI Weekly email lands
- [ ] Wednesday — Language Normalization Weekly email lands
- [ ] Slack channel receives ≤ 5 high-impact alerts per refresh cycle, never duplicates
- [ ] `automation/snapshots/` accumulates daily JSON files, prunes after 60 days
- [ ] Friday Field Notes nudges go out, rotate competitors per rep
- [ ] `automation/candidates.json` contains at least 2 new entrants per week
- [ ] If RSS feed is down, jobs degrade gracefully (log + Slack ops alert, no crash)
- [ ] Recipients can unsubscribe via a one-click link
- [ ] All emails pass GDPR/India DPDP (clear sender, unsubscribe, no tracking pixels)

---

## 7. Out of scope (don't build this yet)

- Multi-tenant dashboards (one Rezo deployment is enough)
- AI-generated commentary on news items (the editorial "Rezo Takeaway" stays manually written; if you want LLM-generated takeaways, that's a separate spec)
- SMS or WhatsApp delivery
- Per-recipient email preferences UI (one global recipient list is fine for v1)
- Mobile app
- Public API for third parties

---

## 8. Open product questions (resolve before building)

1. **Resend vs SendGrid vs in-house SMTP?** Recommendation: Resend (3K emails/mo free, simple API).
2. **Where do the snapshots live in production?** If Render free tier, ephemeral disk means snapshots are lost on restart. Recommendation: use Render Postgres free tier OR Cloudflare R2 for snapshot persistence.
3. **Who owns the recipient list?** Recommendation: product team owns, lives in env var initially, migrates to DB once > 20 recipients.
4. **Slack workspace details?** Confirm webhook URL, channel name, app permissions.
5. **Time zones for recipients in non-IST regions?** Recommendation: standardize on IST for v1 since stakeholders are India-based.

---

## 9. Sample email templates

### 9.1 Weekly Competitor Digest (HTML, illustrative)

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Rezo Competitor Pulse</title></head>
<body style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#0F172A">

  <div style="background:#E31C3D;color:white;padding:20px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;font-size:22px">Rezo Competitor Pulse</h1>
    <p style="margin:4px 0 0;opacity:0.9;font-size:13px">Week of May 8, 2026 · Issue 17</p>
  </div>

  <div style="background:#F8FAFC;padding:20px;border:1px solid #E2E8F0;border-top:none">

    <!-- TL;DR -->
    <h2 style="font-size:14px;color:#64748B;text-transform:uppercase;letter-spacing:1px">TL;DR</h2>
    <ul style="padding-left:20px;line-height:1.6">
      <li><b>Bland AI</b> closed $150M Series C — opening Bengaluru office in Q3 (high-impact)</li>
      <li><b>Vapi</b> launched Salesforce Service Cloud integration — channel threat</li>
      <li>1 new entrant detected — "Phonely" YC-backed, $0.07/min pricing</li>
    </ul>

    <!-- New entrants -->
    <h2 style="font-size:14px;color:#64748B;text-transform:uppercase;letter-spacing:1px">🆕 New Entrants (1)</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #E2E8F0"><b>Phonely</b><br><span style="color:#64748B;font-size:12px">YC-backed · $8M seed · SMB voice agents · TechCrunch</span></td></tr>
    </table>

    <!-- Funding activity -->
    <h2 style="font-size:14px;color:#64748B;text-transform:uppercase;letter-spacing:1px">💰 Funding (1)</h2>
    <p><b>Bland AI</b> · $150M Series C · Sequoia · $1.2B valuation · <a href="https://...">Read</a></p>

    <!-- Buzz score movers -->
    <h2 style="font-size:14px;color:#64748B;text-transform:uppercase;letter-spacing:1px">📊 Buzz Score Movers</h2>
    <table style="width:100%">
      <tr><td style="color:#10B981">▲ Bland AI</td><td>88 → 92 (+4)</td></tr>
      <tr><td style="color:#10B981">▲ Vapi</td><td>85 → 88 (+3)</td></tr>
      <tr><td style="color:#EF4444">▼ Corover.ai</td><td>70 → 67 (-3)</td></tr>
    </table>

    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">
      <a href="https://rezo-intelligence-hub.onrender.com" style="color:#3B82F6">View full dashboard →</a>
      <br>You're receiving this because you're on the Rezo Intel distribution list.
      <a href="{{unsubscribe_url}}">Unsubscribe</a>
    </div>

  </div>
</body>
</html>
```

### 9.2 Slack high-impact alert

```json
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "🔴 *Bland AI raises $150M Series C, eyes Indian market entry*\n_TechCrunch · 2 hours ago · Global_"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Bland AI closed a $150M Series C led by Sequoia at a $1.2B valuation. CEO confirmed plans to open a Bengaluru office in Q3 2026 targeting BFSI voice agents."
      }
    },
    {
      "type": "context",
      "elements": [
        {"type": "mrkdwn", "text": "📍 *Affects:* Bland AI · Funding · Market Position"},
        {"type": "mrkdwn", "text": "<https://techcrunch.com/...|Read full story →>"}
      ]
    }
  ]
}
```

---

## 10. Handoff checklist for the implementing engineer / Claude

Before starting:
- [ ] Read this entire document
- [ ] Skim [DEPLOY.md](DEPLOY.md) for hosting context
- [ ] Skim [server/index.js](server/index.js) and [server/services/newsService.js](server/services/newsService.js) — that's what the automation will sit alongside
- [ ] Confirm answers to the 5 open questions in [Section 8](#8-open-product-questions-resolve-before-building) with product
- [ ] Get Resend (or SendGrid) API key + Slack webhook URL into env
- [ ] Confirm recipient list with product team

When done:
- [ ] All 10 acceptance criteria in [Section 6](#6-acceptance-criteria-overall) pass
- [ ] One sample digest sent to a test inbox before going live to real recipients
- [ ] Docs updated: README mentions automation exists + how to run it locally
- [ ] On-call rotation knows how to disable any single workflow (kill switch via env var, e.g., `DISABLE_WORKFLOW_1=true`)

---

*Last updated: 2026-05-08 · Maintained by Rezo Product*

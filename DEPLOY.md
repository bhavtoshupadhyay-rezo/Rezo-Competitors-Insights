# Deploy Guide — Rezo Intelligence Hub

Single-URL deployment that serves both the frontend and the live RSS news backend.

---

## Recommended path: Render (free tier, ~5 min)

### One-time setup

1. **Push this repo to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Create a new repo at https://github.com/new (private recommended), then:
   git remote add origin https://github.com/<your-org>/<repo-name>.git
   git push -u origin main
   ```

2. **Sign in to Render** at <https://render.com> (free, GitHub login works).

3. **New → Blueprint** → select the GitHub repo you just pushed. Render reads
   `render.yaml` and provisions the service automatically.

4. **Set environment variables** (in the Render dashboard, Service → Environment):
   - `SITE_PASSWORD` — **strongly recommended.** Pick a shared password; everyone
     visiting the URL will get a Basic Auth prompt. Leaving this unset means
     the URL is fully public (competitors included).

5. **Deploy** — Render builds and starts the service. After ~3 min you get
   a URL like `https://rezo-intelligence-hub.onrender.com`. Share that with
   your team.

### What "free tier" means on Render

- The service spins down after 15 min of inactivity. First visit after that
  takes ~30 sec to wake up. After that it's snappy.
- 750 hours/month of compute (plenty for internal use).
- For an always-on instance, upgrade to the $7/mo Starter plan.

### Updating

Push to `main` → Render auto-redeploys. No manual step.

---

## Alternative: Fly.io

Same single-service shape works on Fly. After `flyctl launch`, set
`NODE_ENV=production` and `SITE_PASSWORD` as secrets:

```bash
flyctl secrets set NODE_ENV=production SITE_PASSWORD=<your-shared-password>
flyctl deploy
```

---

## Local production preview

To test the production build locally before deploying:

```bash
npm run build:full                       # builds frontend + installs server deps
NODE_ENV=production npm start            # serves on http://localhost:3001

# With password protection:
NODE_ENV=production SITE_PASSWORD=test123 npm start
```

Visit <http://localhost:3001> — single URL, both API and UI.

---

## Security notes

This dashboard contains internal commentary ("Rezo Takeaway"), competitor
strategic analysis, and field intelligence notes. Treat the URL as
**confidential**:

- Always set `SITE_PASSWORD` for any externally-shared deployment.
- Use a private GitHub repo (the `competitorsData.js` and `aiNewsData.js`
  files contain analyst commentary you don't want to leak).
- Rotate `SITE_PASSWORD` quarterly.
- For higher-security needs, consider putting the Render service behind
  Cloudflare Access (SSO) or your org's VPN.

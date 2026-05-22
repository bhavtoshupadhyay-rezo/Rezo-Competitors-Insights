# Getting Started Guide

Welcome to the Competitor Insights Platform for Rezo.ai! This guide will help you set up and start using the platform in minutes.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js** (version 18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm** (comes with Node.js)
  - Check: `npm --version`

- [ ] **Modern web browser**
  - Chrome, Firefox, Safari, or Edge (latest version)

- [ ] **Terminal/Command Line** access

- [ ] **Text editor** (VS Code recommended)

## 🚀 Installation (5 minutes)

### Step 1: Navigate to Project Directory

```bash
cd ~/competitor-insights-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. You should see output like:
```
added 234 packages in 45s
```

### Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Competitor Insights Platform dashboard! 🎉

## 🎯 First Steps (5 minutes)

### 1. Explore the Dashboard

The landing page shows:
- **3 Quick Stats** at the top (Total Competitors, New Entrants, Avg Buzz)
- **Search bar** to find companies
- **Filters** for categories and sorting
- **10 Company Cards** in a grid

### 2. View a Company

Click on any company card (try **Bland AI**):
- See full company details
- View the animated buzz meter
- Check products and capabilities
- Review security certifications

### 3. Compare with Rezo.ai

While viewing a company:
1. Click **"Compare with Rezo.ai"** button
2. See side-by-side feature comparison
3. Notice the green highlights showing Rezo's advantages
4. Check the Competitive Gap Score

### 4. Scan for New Entrants

Back on the dashboard:
1. Click **"Scan New"** button (yellow)
2. Watch the scanning animation
3. Review discovered companies
4. Check their Match Scores

### 5. Check Notifications

In the top right:
1. Click the **Bell icon** (🔔)
2. See different notification types
3. Try filtering by category
4. Mark notifications as read

### 6. Add to Watchlist

On any company card:
1. Click the **Star icon** (⭐)
2. Company is added to your watchlist
3. Star turns yellow when active

## 🎓 Learning the Interface

### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│ Header: Logo + Title + Actions                 │
├─────────────────────────────────────────────────┤
│ Stats: Total | New Entrants | Avg Buzz         │
├─────────────────────────────────────────────────┤
│ Search & Filters Bar                           │
├─────────────────────────────────────────────────┤
│ Company Cards Grid (3 columns)                 │
│ [Card] [Card] [Card]                           │
│ [Card] [Card] [Card]                           │
│ [Card] [Card] [Card]                           │
│ [Card]                                         │
└─────────────────────────────────────────────────┘
```

### Key Components

1. **Company Card** - Basic info, buzz score, watchlist
2. **Detail Modal** - Full company profile
3. **Comparison Modal** - Feature-by-feature analysis
4. **Scanner Modal** - New entrant discovery
5. **Notification Drawer** - Market updates

### Color Coding

- **Blue (Accent)** - Primary actions and links
- **Green (Success)** - Positive indicators, advantages
- **Yellow (Warning)** - New items, alerts
- **Red (Danger)** - Gaps, threats
- **Purple** - Voice Bot Specialist category
- **Blue** - Speech Analytics category
- **Green** - Omni Channel CX category

## 📊 Understanding the Data

### Rezo.ai (The Baseline)

Rezo.ai is always used as the "Gold Standard" for comparisons:
- **Engage AI** - Voice bots with 10+ languages
- **Analyse AI** - 100% call auditing
- **Native Dialer** - Predictive dialing
- **DIY Platform** - Self-serve bot builder

### Competitor Categories

1. **Voice Bot Specialist** - Companies focused on voice AI
2. **Speech Analytics** - Call analysis and insights
3. **Omni Channel CX** - Multi-channel customer experience
4. **Contact Center Tech** - Contact center infrastructure
5. **Core Tech & Models** - Underlying AI models and TTS

### Key Metrics

- **Buzz Score** (0-100) - Market popularity and activity
- **Match Score** (0-100) - Similarity to Rezo's capabilities
- **Funding** - Total capital raised
- **ARR** - Estimated annual recurring revenue

## 🔧 Common Tasks

### Task 1: Find All Voice Bot Competitors

1. Open the **Category** dropdown
2. Select **"Voice Bot Specialist"**
3. Results filtered automatically

### Task 2: Sort by Funding

1. Open the **Sort** dropdown
2. Select **"Funding"**
3. Companies sorted highest to lowest

### Task 3: Search for a Specific Company

1. Click in the **Search bar**
2. Type company name (e.g., "Vapi")
3. Results filtered as you type

### Task 4: Compare Two Features

1. Click **"Compare"** button in header
2. Select first competitor from dropdown
3. Note features where Rezo has advantage
4. Change dropdown to compare different competitor

### Task 5: Track High-Priority Competitors

1. Click **Star icon** on important companies
2. They're added to your watchlist
3. (In production: Would receive alerts)

## 🐛 Troubleshooting

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: npm install Fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Page is Blank

**Solution:**
1. Check browser console for errors (F12)
2. Ensure you ran `npm install` first
3. Try hard refresh (Cmd/Ctrl + Shift + R)
4. Clear browser cache

### Issue: Styles Not Loading

**Solution:**
```bash
# Ensure Tailwind is properly installed
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

### Issue: Changes Not Showing

**Solution:**
- Vite has hot module replacement (HMR)
- Save your file (Cmd/Ctrl + S)
- Browser should auto-refresh
- If not, manually refresh (F5)

## 💡 Tips & Best Practices

### Performance Tips

1. **Keep modals open briefly** - Close when done to free memory
2. **Use filters** - Narrow results before searching
3. **Limit concurrent modals** - One at a time works best

### Data Management Tips

1. **Regular updates** - Update competitor data monthly
2. **Verify sources** - Double-check funding numbers
3. **Track changes** - Note when competitors add features

### Usage Tips

1. **Start with search** - Fastest way to find specific companies
2. **Compare regularly** - Weekly checks on top 3 competitors
3. **Monitor notifications** - Check bell icon daily
4. **Use watchlist** - Track 3-5 key competitors closely

## 📚 Next Steps

### For Developers

1. **Explore the code**
   - `src/components/` - React components
   - `src/data/` - Mock data
   - `tailwind.config.js` - Styling

2. **Customize data**
   - Edit `src/data/competitorsData.js`
   - Add new competitors
   - Update Rezo's features

3. **Add features**
   - Create new components
   - Extend existing ones
   - Add new comparison metrics

### For Product Managers

1. **Gather feedback**
   - Share with stakeholders
   - Collect improvement ideas
   - Prioritize features

2. **Plan integrations**
   - Identify data sources
   - API requirements
   - Automation opportunities

3. **Define workflows**
   - Who uses which features?
   - How often to update data?
   - Alert triggers?

### For Stakeholders

1. **Regular reviews**
   - Weekly competitive analysis
   - Monthly trend reports
   - Quarterly strategy sessions

2. **Action planning**
   - Address feature gaps
   - Respond to threats
   - Capitalize on advantages

## 📖 Additional Resources

- **[README.md](README.md)** - Full project documentation
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to production
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - Visual feature walkthrough
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview

## 🆘 Getting Help

### Documentation

All features are documented in:
- This guide (quick start)
- README.md (comprehensive)
- Code comments (inline)

### Support Channels

- **GitHub Issues** - Report bugs or request features
- **Product Team** - Contact for strategic questions
- **Dev Team** - Technical implementation help

## ✅ Launch Checklist

Before sharing with team:

- [ ] Run `npm install` successfully
- [ ] Start dev server with `npm run dev`
- [ ] View dashboard in browser
- [ ] Click through all company cards
- [ ] Test comparison engine
- [ ] Try new entrant scanner
- [ ] Check notifications
- [ ] Test search functionality
- [ ] Try all filters
- [ ] Add companies to watchlist
- [ ] Close and reopen modals
- [ ] Test on mobile (responsive)

## 🎉 Ready to Go!

You're all set! The platform is running and ready to use.

**Quick Actions:**
- Browse competitors: Just start clicking cards
- Compare features: Click "Compare" button
- Discover new entrants: Click "Scan New"
- Check updates: Click bell icon

**Happy analyzing!** 🚀

---

Questions? Contact the Rezo.ai Product Team

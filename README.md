# Competitor Insights Platform - Rezo.ai

A comprehensive competitive intelligence platform built for Rezo.ai to track, analyze, and compare competitors in the Voice AI and Speech Analytics space.

## Features

### 1. Dashboard & Company Listing
- **Clean, minimalist tabular view** with sortable columns
- **Global search** by company name or description
- **Category filters**: Voice Bot Specialist, Speech Analytics, Omni Channel CX, Contact Center Tech, Core Tech & Models
- **Quick stats**: Total Competitors, New Entrants (Last 30 Days), Average Market Buzz
- **Company cards** with key information and buzz scores

### 2. Company Detail View
- **Comprehensive company profiles** with:
  - Header: Logo, Name, Founded Year, HQ Location
  - Financials: Funding Status, Total Raised, Investors, Estimated ARR/MRR
  - Product Suite: List of known products with flagship indicators
  - Buzz Meter: Visual gauge (0-100) indicating market popularity
  - Target Industries
  - Key Capabilities with checkmarks
  - Security Certifications

### 3. Comparison Engine (Critical Feature)
- **Split-screen comparison** with Rezo.ai as the fixed baseline
- **Feature-by-feature analysis** including:
  - Proprietary LLM/NLU
  - Native Predictive Dialer
  - 100% Automated QA Coverage
  - DIY Bot Builder (<20 min launch)
  - Security Certifications (SOC2, ISO, PCI)
- **Gap highlighting**: Clear visual indicators where competitors lack Rezo's features
- **Competitive Gap Score**: Percentage-based advantage metric
- **Security & Compliance comparison**
- **Key Competitive Advantages** summary

### 4. New Entrant Discovery & Watchlist
- **"Scan for New Competitors"** feature with animated scanning
- **Match Score**: Algorithmic scoring against Rezo's capabilities
- **Verification badges** for new entrants
- **Watchlist functionality**: Star icon to track important competitors
- **Threat assessment**: Alerts for high-match-score competitors

### 5. Notification Center
- **Three distinct alert types**:
  - **New Entry**: New competitor detected in category
  - **Feature Launch**: Competitor launched new feature
  - **Funding News**: Funding round announcements
- **Filterable notifications** by type
- **Mark as read/unread** functionality
- **Real-time updates** simulation

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **Recharts** - For data visualizations (buzz meters)

## Design Philosophy

- **Aesthetic**: Linear/Vercel style - Dark mode with high contrast
- **Typography**: Inter font family for crisp readability
- **Colors**:
  - Primary: #0F172A (Dark background)
  - Secondary: #1E293B (Card backgrounds)
  - Accent: #3B82F6 (Blue for actions)
  - Success: #10B981 (Green for positive indicators)
  - Warning: #F59E0B (Yellow for alerts)
  - Danger: #EF4444 (Red for gaps/threats)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
competitor-insights-platform/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Main dashboard with stats and filters
│   │   ├── CompanyCard.jsx         # Company card component
│   │   ├── CompanyDetailModal.jsx  # Detailed company view
│   │   ├── ComparisonModal.jsx     # Feature comparison engine
│   │   ├── NewEntrantScanner.jsx   # New competitor discovery
│   │   └── NotificationCenter.jsx  # Notification drawer
│   ├── data/
│   │   └── competitorsData.js      # Mock data for all competitors
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Key Components

### Dashboard
- Main container with search, filters, and company grid
- Manages state for modals and watchlist
- Displays quick stats and metrics

### CompanyCard
- Individual company display in grid
- Shows logo, name, category, buzz score
- Watchlist star button
- Click to open detail modal

### CompanyDetailModal
- Full company profile with all details
- Buzz meter visualization
- Compare button to launch comparison
- External website link

### ComparisonModal
- Side-by-side feature comparison
- Rezo.ai (fixed) vs Selected Competitor
- Color-coded gaps and advantages
- Security certifications comparison
- Competitive gap score calculation

### NewEntrantScanner
- Simulated market scanning with progress bar
- Discovery of new competitors
- Match score calculation vs Rezo.ai
- Add to watchlist functionality
- Threat assessment for high matches

### NotificationCenter
- Notification drawer with filters
- Three notification types with icons
- Mark as read/unread
- Timestamp formatting

## Data Structure

### Company Object
```javascript
{
  id: 'company-id',
  name: 'Company Name',
  logo: '🎯',
  category: 'Voice Bot Specialist',
  founded: 2023,
  hq: 'USA',
  agentAI: true,
  fundingStatus: 'Funded',
  totalFunding: '$40M+',
  lastRound: '$40M Series B',
  lastRoundDate: 'Jan 2025',
  estimatedARR: '$8M+',
  investors: ['Investor 1', 'Investor 2'],
  buzzScore: 88,
  description: 'Company description',
  products: [
    {
      name: 'Product Name',
      description: 'Product description',
      flagship: true
    }
  ],
  features: {
    proprietaryLLM: true,
    nativeDialer: false,
    automatedQA: true,
    // ... more features
  },
  industries: ['Banking', 'Telecom'],
  website: 'https://company.com'
}
```

## Rezo.ai Gold Standard

The platform uses Rezo.ai as the baseline for all comparisons:

- **Core Identity**: Unified CX Agentic AI Platform
- **Key Products**: Engage AI, Analyse AI, Dialer, DIY Platform
- **Differentiators**:
  - Voice-first Agentic AI with human-like interactions
  - Proprietary NLU/NLP engines
  - Extremely low latency (<1s response)
  - Comprehensive security certifications
  - 10+ vernacular languages

## Competitors Included

### Voice Bot Specialists
- Bland AI
- Vapi
- Retell AI

### Speech Analytics
- Observe.AI
- Level AI

### Omni Channel CX
- Corover.ai
- Yellow.ai
- Kapture CX

### Contact Center Tech
- Uniphore

### Core Tech & Models
- ElevenLabs

## Future Enhancements

- Real API integration for live competitor data
- Web scraping for automated discovery
- Email alerts for notifications
- Export comparison reports as PDF
- Historical trend tracking
- Competitive intelligence dashboard with charts
- Integration with CRM systems
- Collaborative features for team members

## Contributing

This is a prototype for internal use at Rezo.ai. For suggestions or improvements, please contact the product team.

## License

Proprietary - Rezo.ai Internal Use Only

---

Built with ❤️ for Rezo.ai Intelligence Team

# Setup Guide - Competitor Insights Platform

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Quick Start

### 1. Navigate to the project directory

```bash
cd ~/competitor-insights-platform
```

### 2. Install dependencies

```bash
npm install
```

This will install:
- React 18.2.0
- React DOM 18.2.0
- Lucide React (icons)
- Recharts (visualizations)
- Vite (build tool)
- Tailwind CSS (styling)
- PostCSS & Autoprefixer

### 3. Start the development server

```bash
npm run dev
```

The application will open at: **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

The production build will be in the `dist` directory.

### 5. Preview production build

```bash
npm run preview
```

## Project Structure Overview

```
competitor-insights-platform/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── CompanyCard.jsx
│   │   ├── CompanyDetailModal.jsx
│   │   ├── ComparisonModal.jsx
│   │   ├── NewEntrantScanner.jsx
│   │   └── NotificationCenter.jsx
│   ├── data/
│   │   └── competitorsData.js  # Mock data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Features to Explore

Once the app is running, you can:

1. **Browse Competitors** - View all competitors in a card grid
2. **Search & Filter** - Use the search bar and category filters
3. **View Details** - Click any company card to see full details
4. **Compare** - Click the "Compare" button to see side-by-side feature comparison
5. **Scan for New Entrants** - Click "Scan New" to discover new competitors
6. **Check Notifications** - Click the bell icon to see market updates
7. **Add to Watchlist** - Star companies to track them

## Customization

### Adding New Competitors

Edit `src/data/competitorsData.js` and add a new object to the `competitorsData` array:

```javascript
{
  id: 'new-company',
  name: 'New Company',
  logo: '🚀',
  category: 'Voice Bot Specialist',
  founded: 2024,
  // ... more fields
}
```

### Updating Rezo.ai Data

Edit the `rezoData` object in `src/data/competitorsData.js` to update Rezo's baseline information.

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: '#0F172A',    // Dark background
  secondary: '#1E293B',  // Card backgrounds
  accent: '#3B82F6',     // Blue accents
  // ...
}
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### Dependencies Not Installing

Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure you're using Node.js v18 or higher:
```bash
node --version
```

### Styling Not Working

Make sure Tailwind CSS is properly configured. Check that `postcss.config.js` and `tailwind.config.js` exist.

## Browser Compatibility

This application works best in modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

The app is optimized for:
- Fast initial load (<2s)
- Smooth animations (60fps)
- Responsive design (mobile, tablet, desktop)

## Next Steps

1. **Test all features** - Click through every component
2. **Customize data** - Add your own competitor information
3. **Deploy** - Use Vercel, Netlify, or any static hosting
4. **Integrate APIs** - Replace mock data with real API calls

## Support

For questions or issues, contact the Rezo.ai product team.

---

Built with React + Vite + Tailwind CSS

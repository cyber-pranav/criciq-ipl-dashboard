# CricIQ — IPL Intelligence Dashboard

> A real-time IPL cricket analytics dashboard powered by **Google Cloud** services. Built for the hackathon with a live broadcast command center aesthetic.

![CricIQ](https://img.shields.io/badge/CricIQ-IPL%20Intelligence-00D4FF?style=for-the-badge&labelColor=0B0F1A)
![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%26%20Firestore-F59E0B?style=for-the-badge&logo=firebase&labelColor=0B0F1A)
![Gemini](https://img.shields.io/badge/Gemini%20AI-1.5%20Flash-10B981?style=for-the-badge&logo=google&labelColor=0B0F1A)

---

## 🏏 What is CricIQ?

CricIQ is a data-dense, real-time IPL intelligence dashboard designed for cricket fans. It combines historical IPL data (2008–2024) with AI-powered insights from **Google Gemini 1.5 Flash** to deliver player stats, team analysis, head-to-head comparisons, and an interactive AI assistant.

### Design Philosophy
- **Live broadcast command center** aesthetic inspired by ESPN CricInfo, Bloomberg Terminal, and F1 telemetry dashboards
- Dark navy base (#0B0F1A) with electric cyan (#00D4FF) for live indicators
- Bloomberg-terminal style data tables with monospaced numbers
- No glassmorphism, no gradients — information-first design

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + Vite** | Frontend framework & build tool |
| **Tailwind CSS v4** | Styling with custom design tokens |
| **Zustand** | Lightweight global state management |
| **Recharts** | Interactive charts (Line, Bar, Radar, Area, Pie) |
| **React Router v6** | Client-side routing |
| **Firebase Firestore** | Cloud database for IPL data |
| **Firebase Anonymous Auth** | Seamless demo authentication |
| **Firebase Hosting** | Production deployment |
| **Google Gemini 1.5 Flash** | AI-powered cricket analyst (REST API) |

---

## 📊 Features

### Dashboard (Home)
- **Hero stats row** — Total Matches, Runs, Wickets, Highest Score with count-up animations
- **Live match ticker** — Scrolling CSS marquee with live score updates
- **Season runs timeline** — Interactive Recharts LineChart (2008–2024)
- **Top 5 batsmen** — Ranked list with mini proportion bars and delta badges
- **Wicket heatmap** — Color-coded danger levels per over (1–20)
- **Economy rate leaders** — Horizontal bar chart of top bowlers
- **Recent match results** — Last 5 match cards

### Player Profile (`/player/:id`)
- Player hero section with role badges and key stats
- 3-tab system: Batting (bar + radar charts), Bowling (line + pie charts), Career Summary
- "Ask AI about this player" button

### Team Analysis (`/team/:id`)
- Win/Loss donut chart (amber wins, muted losses)
- Home vs Away grouped bar chart
- Top match winners
- Season-wise points table
- Strongest Playing XI recommendation

### Head to Head (`/head-to-head`)
- Dual team selectors with VS badge
- All-time record split bar
- Last 5 encounters timeline
- Run margin AreaChart
- "Who will win today?" AI prediction (Gemini)

### Ask CricIQ (`/ask`)
- Terminal-style AI chat interface
- 8 suggested questions as clickable chips
- Follow-up question chips per response
- Powered by Google Gemini 1.5 Flash
- Skeleton loading states

---

## 🏗️ Project Structure

```
src/
  components/
    layout/     → Sidebar, TopBar, LiveTicker
    stats/      → StatCard, PlayerCard, MatchCard, StatTable, DeltaBadge
    charts/     → RunsChart, WicketHeatmap, PerformanceRadar
    ai/         → InsightPanel, AskCricIQ
  pages/
    Dashboard.jsx
    PlayerProfile.jsx
    TeamAnalysis.jsx
    HeadToHead.jsx
    AskAI.jsx
  store/
    useIPLStore.js    → Zustand state management
  services/
    firebase.js       → Firebase init + anonymous auth
    gemini.js         → Gemini 1.5 Flash REST API
    iplData.js        → IPL dataset + processing functions
  hooks/
    usePlayerStats.js
    useMatchData.js
  utils/
    formatters.js     → Number/date formatting utilities
```

---

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/criciq.git
cd criciq

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🚢 Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Live URL: `https://criciq-[hash].web.app`

---

## 🎯 Demo Flow (90 seconds)

1. **Dashboard** → Show season selector → Change to 2023
2. Stats update → Point to Live Ticker
3. Click top batsman → **Player Profile** loads
4. Show Radar chart → "See how well-rounded this player is"
5. **Head to Head** → Select MI vs CSK → Show all-time record
6. **Ask CricIQ** → Type "Who is the best finisher in IPL?" → Show Gemini response
7. Point to Firebase Hosting URL as live deploy link

---

## 📝 Google Cloud Services Used

- **Firebase Firestore** — Cloud NoSQL database for IPL data storage
- **Firebase Hosting** — Production deployment and CDN
- **Firebase Anonymous Auth** — Seamless user authentication for demo
- **Google Gemini 1.5 Flash API** — AI-powered cricket analysis and insights

---

## 📄 License

MIT License — Built for hackathon purposes.

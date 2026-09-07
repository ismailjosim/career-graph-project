# 🎯 Career Graph - Job Application Tracker

> A **premium, modern job application tracking system** with dark/light theme, responsive design, and professional UI built with cutting-edge 2026 design trends.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)

---

## ✨ Features

### 🎯 Core Functionality
- **Job Application Management** - Track all your applications with detailed information
- **Monthly Analytics** - Real-time statistics and performance metrics
- **Wishlist** - Save interesting jobs to review before applying
- **Job Fit Analysis** - AI-powered compatibility scoring (0-100%)
- **Resume Manager** - Store and manage multiple resume versions
- **Cover Letters** - Create, edit, and organize cover letters

### 🎨 Premium Design
- **Modern UI/UX** - 2026 design trends with glassmorphism effects
- **Dark/Light Theme** - Full theme support with system preference detection
- **Responsive Design** - Mobile-first approach with perfect desktop experience
- **Smooth Animations** - Micro-interactions and transitions throughout
- **Professional Typography** - Outfit + Space Grotesk fonts

### 📱 Mobile Ready
- **Responsive Sidebar** - Collapsible navigation on mobile
- **Touch-Friendly** - All buttons and inputs optimized for touch
- **Safe Area Support** - Notch and safe area inset support
- **App-Ready Architecture** - Ready for React Native conversion

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- pnpm or npm

### Installation

```bash
# Clone the repository
cd frontend

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local with your MongoDB URI
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/career-graph

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Dashboard Overview

```
┌─────────────────────────────────────────────────────┐
│                    CAREER GRAPH                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📊 STATS                                           │
│  ├─ Total Applications: 24                          │
│  ├─ Positive Responses: 8 (↑ 12%)                  │
│  ├─ Rejections: 4 (↓ 2%)                           │
│  └─ Interviews: 6 (↑ 15%)                          │
│                                                     │
│  📈 MONTHLY PERFORMANCE CHART                       │
│  [Interactive Bar Chart with Recharts]             │
│                                                     │
│  📋 RECENT APPLICATIONS                             │
│  ├─ Senior Frontend Dev @ Google (Applied)         │
│  ├─ Product Manager @ Microsoft (Interview)        │
│  └─ Backend Engineer @ Amazon (Offer)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

### Color Palette
```
🔵 Primary Blue:    #3b82f6
🟢 Success Green:   #22c55e
🟡 Warning Amber:   #f59e0b
🔴 Danger Red:      #ef4444
⚪ Neutral Slate:   #64748b
```

### Typography
```
Headlines:  Space Grotesk (Bold)
Body Text:  Outfit (Regular/Medium)
Monospace:  Geist Mono
```

### Responsive Breakpoints
```
Mobile:     < 768px   (Single column)
Tablet:     768-1024px (Two columns)
Desktop:    > 1024px  (Full layout)
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── applications/     # Job apps endpoints
│   │   │   ├── wishlist/         # Wishlist endpoints
│   │   │   ├── resumes/          # Resume endpoints
│   │   │   ├── cover-letters/    # Cover letter endpoints
│   │   │   └── stats/            # Statistics endpoints
│   │   ├── applications/         # App pages
│   │   ├── cover-letters/        # Cover letter UI
│   │   ├── resumes/              # Resume UI
│   │   ├── wishlist/             # Wishlist UI
│   │   ├── fit-analysis/         # Fit analysis UI
│   │   ├── dashboard/            # Main dashboard
│   │   ├── globals.css           # Design system
│   │   ├── layout.tsx            # Root layout
│   │   └── providers.tsx         # Theme provider
│   ├── components/
│   │   └── sidebar.tsx           # Navigation sidebar
│   ├── hooks/
│   │   └── useApi.ts             # API hooks
│   └── lib/
│       ├── db.ts                 # MongoDB connection
│       ├── models.ts             # Mongoose schemas
│       └── validation.ts         # Zod schemas
├── tailwind.config.ts            # Tailwind config
├── DESIGN_SYSTEM.md              # Design guidelines
├── QUICK_START.md                # Setup guide
├── PROJECT_COMPLETE.md           # Full summary
└── package.json
```

---

## 🔌 API Endpoints

### Applications
```
GET    /api/applications              # Get all applications
POST   /api/applications              # Create application
GET    /api/applications/[id]         # Get single application
PUT    /api/applications/[id]         # Update application
DELETE /api/applications/[id]         # Delete application
```

### Wishlist
```
GET    /api/wishlist                  # Get wishlist
POST   /api/wishlist                  # Add to wishlist
PUT    /api/wishlist/[id]             # Update wishlist item
DELETE /api/wishlist/[id]             # Remove from wishlist
```

### Resumes
```
GET    /api/resumes                   # Get all resumes
POST   /api/resumes                   # Upload resume
PUT    /api/resumes/[id]              # Update resume
DELETE /api/resumes/[id]              # Delete resume
```

### Cover Letters
```
GET    /api/cover-letters             # Get cover letters
POST   /api/cover-letters             # Create cover letter
PUT    /api/cover-letters/[id]        # Update cover letter
DELETE /api/cover-letters/[id]        # Delete cover letter
```

### Statistics
```
GET    /api/stats/monthly             # Get monthly stats
POST   /api/stats/monthly             # Recalculate stats
```

---

## 🛠️ Development

### Available Commands
```bash
# Development
pnpm dev          # Start dev server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run linter
pnpm format       # Format code

# Database
# Configure MONGODB_URI in .env.local
```

### Database Models
```typescript
// Job Application
interface JobApplication {
  jobTitle: string
  company: string
  status: 'applied' | 'interview_scheduled' | 'offer_received' | 'rejected'
  fitScore?: number
  appliedAt: Date
  responseAt?: Date
  // ... more fields
}

// Wishlist Item
interface Wishlist {
  title: string
  company: string
  link: string
  status: 'saved' | 'reviewing' | 'decided'
  // ... more fields
}

// Resume
interface Resume {
  name: string
  fileUrl: string
  isDefault: boolean
  // ... more fields
}

// Cover Letter
interface CoverLetter {
  title: string
  content: string
  // ... more fields
}
```

---

## 🎯 Feature Pages

### Dashboard (`/dashboard`)
- Real-time statistics cards
- Monthly performance chart
- Recent applications table
- Modal form for adding applications
- Quick navigation to all features

### Applications (`/applications`)
- Grid card layout
- Search functionality
- Status filtering
- Individual app details page
- Full edit capabilities

### Wishlist (`/wishlist`)
- Job post cards with details
- Status management
- Quick action buttons
- External link integration

### Fit Analysis (`/fit-analysis`)
- Skill matching algorithm
- Compatibility scoring
- Recommendation system
- Direct application creation

### Resume Manager (`/resumes`)
- Multiple resume versions
- Default selection
- Upload tracking
- Quick preview

### Cover Letters (`/cover-letters`)
- Full-featured editor
- Version control
- Quick access
- Search functionality

---

## 🌓 Theme System

### Features
- **Auto Detection** - Respects system theme preference
- **Manual Toggle** - Switch themes from sidebar
- **Persistent** - Theme preference saved to localStorage
- **Zero Flash** - No theme flash on page load
- **Complete Coverage** - All components theme-aware

### Toggle Location
Access from sidebar footer (available on all pages)

---

## 📱 Mobile Optimization

- ✅ Responsive grid to single column
- ✅ Collapsible sidebar with backdrop
- ✅ Touch-friendly button sizes (44x44px minimum)
- ✅ Optimized spacing for small screens
- ✅ Safe area inset support
- ✅ Landscape orientation support

---

## 🔐 Security & Validation

- **Type Safety** - Full TypeScript throughout
- **Input Validation** - Zod schemas on all inputs
- **Error Handling** - Comprehensive error management
- **API Security** - User ID validation on all endpoints
- **Data Protection** - No sensitive data in logs

---

## 📊 What You Can Track

| Metric | Tracked | Real-Time |
|--------|---------|-----------|
| Total Applications | ✅ | ✅ |
| Response Rate | ✅ | ✅ |
| Interview Rate | ✅ | ✅ |
| Success Rate | ✅ | ✅ |
| Job Fit Scores | ✅ | ✅ |
| Application Timeline | ✅ | ✅ |
| Skills Gaps | ✅ | ✅ |

---

## 🚀 Deployment

### Ready for
- ✅ **Vercel** (Recommended)
- ✅ **Netlify**
- ✅ **Docker**
- ✅ **Any Node.js Host**

### Environment Variables
```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup and usage guide
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design guidelines
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Feature documentation
- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Full summary

---

## 🎓 Future Roadmap

### Phase 2
- [ ] Email notifications
- [ ] AI-powered suggestions
- [ ] LinkedIn integration
- [ ] Interview scheduler

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Browser extensions

---

## 🤝 Contributing

This is a complete, production-ready application. Contributions and suggestions are welcome!

---

## 📄 License

MIT License - Feel free to use this project for any purpose

---

## 🎉 Summary

**Career Graph is a premium, production-ready job application tracking system that combines:**

- 🎯 Comprehensive job management
- 📊 Real-time analytics
- 🎨 Premium modern design
- 📱 Mobile-first responsive
- 🔐 Type-safe backend
- 🚀 Ready to deploy
- 📈 Mobile app ready

**Start tracking your job applications professionally today!**

---

**Built with ❤️ for job seekers who care about their career journey**

**Version 1.0.0** | **September 7, 2026** | **Production Ready** ✅

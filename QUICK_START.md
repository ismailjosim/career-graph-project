# Quick Start Guide - Career Graph

## 🎯 What's Been Built

Your Career Graph job application tracker is now fully implemented with all the features from your project goals. Here's everything that's ready to use:

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up MongoDB
```bash
# Create .env.local file
cp .env.example .env.local

# Add your MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career-graph
```

### 3. Start Development Server
```bash
pnpm dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
All features are located at:
├── Dashboard          → /dashboard
├── Applications       → /applications (view/edit) & /applications/new (add)
├── Wishlist          → /wishlist
├── Resumes           → /resumes
├── Cover Letters     → /cover-letters
└── Fit Analysis      → /fit-analysis
```

## ✨ Features Overview

### 1. Dashboard (`/dashboard`)
- View all job applications in a table
- See monthly statistics (applications, responses, rejections, interviews)
- Visual chart showing your progress
- Quick navigation to all features

### 2. Job Applications (`/applications`)
- **Add New** (`/applications/new`): Create job applications
- **View/Edit** (`/applications/[id]`): Update status, notes, and details
- Track application lifecycle: Applied → Interview → Offer/Rejection
- Store job descriptions, links, salary info, and location

### 3. Job Wishlist (`/wishlist`)
- Save interesting job posts from external sources
- Track status: Saved → Reviewing → Decided
- Move to applications when ready
- Keep notes on why you're interested

### 4. Job Fit Analysis (`/fit-analysis`)
- Paste job description and requirements
- Get fit score (0-100%)
- See matched and missing skills
- Get recommendation whether to apply
- Create applications with calculated fit score

### 5. Resume Management (`/resumes`)
- Upload multiple resume versions
- Set default resume
- Track upload dates
- Use different versions for different jobs

### 6. Cover Letters (`/cover-letters`)
- Create and edit cover letters
- Save multiple versions
- Edit anytime
- Link to applications

## 💾 Database Models

All data stored in MongoDB with these collections:

- **JobApplication** - Main job applications
- **Wishlist** - Saved job posts
- **Resume** - Resume versions
- **CoverLetter** - Cover letters
- **MonthlyStats** - Monthly statistics
- **JobMarket** - External job posts

## 🔌 API Endpoints

All endpoints are ready to use:

```
GET/POST    /api/applications
GET/PUT/DELETE /api/applications/[id]

GET/POST    /api/wishlist
GET/PUT/DELETE /api/wishlist/[id]

GET/POST    /api/resumes
GET/PUT/DELETE /api/resumes/[id]

GET/POST    /api/cover-letters
GET/PUT/DELETE /api/cover-letters/[id]

GET/POST    /api/stats/monthly
```

## 🚀 Next Steps

### Immediate (Required for Production)
1. [ ] Set up MongoDB Atlas or local MongoDB
2. [ ] Configure `.env.local` with MONGODB_URI
3. [ ] Implement user authentication (replace demo-user)
4. [ ] Add authentication middleware to API routes

### Short Term (Recommended)
1. [ ] Add file upload for resumes
2. [ ] Setup cloud storage (Google Drive, S3, etc.)
3. [ ] Add email notifications
4. [ ] Implement user accounts and login

### Future Enhancements
1. [ ] AI-powered resume matching
2. [ ] LinkedIn/Indeed API integration
3. [ ] Interview scheduling
4. [ ] Salary negotiation tracker
5. [ ] Mobile app version

## 🛠️ Development Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Lint code
pnpm lint
```

## 📝 Important Notes

### Authentication
- Currently using `USER_ID = "demo-user"` in all API hooks
- **Before going live**: Replace with actual authenticated user ID from your auth system
- Update all references in:
  - `src/hooks/useApi.ts` - useJobApplications, useMonthlyStats
  - Every page component - the `USER_ID` constant

### File Uploads
- Resumes need external storage (Google Drive, Dropbox, AWS S3, etc.)
- Store the sharable link in the database
- Can be enhanced later with direct file uploads

### Database
- All models have proper indexes for efficient queries
- Zod validation on all inputs
- MongoDB connection pooling configured

## 🎨 UI/UX

- Clean, modern design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Color-coded status indicators
- Loading states and error handling
- Intuitive navigation

## 📊 What You Can Track

- **Total applications** submitted per month
- **Response rate** (how many companies replied)
- **Interview rate** (how many interviews scheduled)
- **Offer rate** (how many offers received)
- **Rejection rate** (how many rejections)
- **Job fit scores** for each application
- **Skills gaps** for target roles
- **Resume versions** used for each job

## 🤝 Support & Troubleshooting

### MongoDB Connection Issues
```bash
# Check your connection string in .env.local
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

### Port Already in Use
```bash
# Use a different port
pnpm dev -- -p 3001
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📚 File Reference

- **Models**: `src/lib/models.ts`
- **Validation**: `src/lib/validation.ts`
- **Database Connection**: `src/lib/db.ts`
- **API Hooks**: `src/hooks/useApi.ts`
- **Pages**: `src/app/[feature]/page.tsx`
- **API Routes**: `src/app/api/[resource]/route.ts`

---

**You're all set! Start the dev server and begin tracking your job applications.** 🚀

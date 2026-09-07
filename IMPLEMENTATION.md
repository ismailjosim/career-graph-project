# Career Graph - Job Application Tracker

A comprehensive web application for managing your job search journey. Track applications, analyze job fit, save interesting positions, and maintain cover letters all in one place.

## 🎯 Features

### 1. **Job Applications Dashboard**
- View all your job applications in a centralized dashboard
- Track application status (applied, interviewed, offer received, rejected, etc.)
- Monthly statistics showing:
  - Total applications submitted
  - Responses received
  - Interview count
  - Offer count
  - Rejection count
- Quick overview with visual charts

### 2. **Job Application Management**
- Add new job applications with detailed information
- Track job title, company, location, salary range
- Set employment type (full-time, part-time, contract, internship)
- Store job descriptions and links
- Add personal notes for each application
- Update application status through the lifecycle
- Track response dates and types
- View and edit application details anytime

### 3. **Job Wishlist**
- Save interesting job posts from LinkedIn, Indeed, Glassdoor, or other sources
- Keep notes on why you're interested in each position
- Review saved jobs before deciding to apply
- Change status: Saved → Reviewing → Decided
- Move jobs directly from wishlist to applications
- Delete jobs you're no longer interested in

### 4. **Job Fit Analysis**
- Analyze how well your resume matches a job posting
- Get a fit score (0-100%)
- View matched skills from your resume
- Identify missing skills needed for the role
- Get recommendations on whether to apply
- Create applications directly from fit analysis with the calculated score

### 5. **Resume Management**
- Upload and manage multiple resume versions
- Set a default resume for quick application creation
- Store resume metadata and URLs
- Track when each resume was uploaded
- Use different resumes for different job types

### 6. **Cover Letter Management**
- Create and save cover letters for different roles
- Edit and update cover letters anytime
- Link cover letters to job applications
- View all your saved cover letters in one place
- Delete outdated cover letters

### 7. **Monthly Statistics**
- Automatic calculation of monthly job application stats
- Track trends in your job search
- See response rates at a glance
- Monitor interview success

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: MongoDB with Mongoose
- **Validation**: Zod for type-safe validation
- **Forms**: React Hook Form
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 📋 Project Structure

```
src/
├── app/
│   ├── api/                      # API routes
│   │   ├── applications/         # Job application endpoints
│   │   ├── wishlist/            # Wishlist endpoints
│   │   ├── resumes/             # Resume endpoints
│   │   ├── cover-letters/       # Cover letter endpoints
│   │   └── stats/               # Statistics endpoints
│   ├── applications/            # Job application pages
│   ├── wishlist/                # Wishlist page
│   ├── resumes/                 # Resume management page
│   ├── cover-letters/           # Cover letters page
│   ├── fit-analysis/            # Job fit analysis page
│   ├── dashboard/               # Main dashboard
│   └── page.tsx                 # Home (redirects to dashboard)
├── lib/
│   ├── db.ts                    # MongoDB connection
│   ├── models.ts                # Mongoose schemas
│   └── validation.ts            # Zod validation schemas
├── hooks/
│   └── useApi.ts                # API hooks for data fetching
└── components/                  # Reusable components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local and add your MongoDB URI
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 API Endpoints

### Job Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/[id]` - Get application details
- `PUT /api/applications/[id]` - Update application
- `DELETE /api/applications/[id]` - Delete application

### Wishlist
- `GET /api/wishlist` - Get all wishlist items
- `POST /api/wishlist` - Add to wishlist
- `GET /api/wishlist/[id]` - Get wishlist item
- `PUT /api/wishlist/[id]` - Update wishlist item
- `DELETE /api/wishlist/[id]` - Delete from wishlist

### Resumes
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Upload resume
- `GET /api/resumes/[id]` - Get resume details
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### Cover Letters
- `GET /api/cover-letters` - Get all cover letters
- `POST /api/cover-letters` - Create cover letter
- `GET /api/cover-letters/[id]` - Get cover letter details
- `PUT /api/cover-letters/[id]` - Update cover letter
- `DELETE /api/cover-letters/[id]` - Delete cover letter

### Statistics
- `GET /api/stats/monthly` - Get current month stats
- `POST /api/stats/monthly` - Recalculate monthly stats

## 🔐 Authentication

**Note**: Currently using a demo user ID. For production:
1. Implement proper user authentication (JWT, OAuth, etc.)
2. Replace `USER_ID = "demo-user"` with actual authenticated user
3. Add authentication middleware to API routes
4. Secure sensitive data in `.env` variables

## 📱 Usage Examples

### Adding a Job Application
1. Go to Dashboard → "Add Application"
2. Fill in job details
3. Select resume and cover letter (optional)
4. Submit to create application

### Using Job Fit Analysis
1. Go to "Job Fit Analysis"
2. Select your resume
3. Paste job title and description
4. Get fit score and skill analysis
5. Create application if interested

### Managing Wishlist
1. Go to "Job Wishlist"
2. Add job posts from external sources
3. Review and change status
4. Move to applications when ready to apply
5. Delete if no longer interested

## 🐛 Known Limitations

- Job fit analysis uses keyword matching (can be enhanced with AI)
- File uploads require external storage setup (Google Drive, Dropbox, etc.)
- Currently uses demo user ID (needs authentication implementation)

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] File upload functionality
- [ ] AI-powered resume optimization
- [ ] Email notifications for follow-ups
- [ ] Interview scheduling integration
- [ ] Salary negotiation tracker
- [ ] Mobile app version
- [ ] Export applications to PDF
- [ ] Integration with job boards (LinkedIn, Indeed API)
- [ ] Collaborative features for job search buddies

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For support, please open an issue in the repository.

---

**Built with ❤️ to help you track your career growth**

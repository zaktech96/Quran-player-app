# 📖 Quran Player

A modern, feature-rich web application for listening to and studying the Quran. Built with NextJS, this app provides a seamless experience for accessing Quranic recitations, translations, and study tools.

## ✨ Features

- 🎧 **Audio Player** - High-quality Quran recitations with playback controls
- 📚 **Multiple Reciters** - Access to various renowned reciters
- 🌐 **Translations** - Multiple language translations with synchronized text
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🔍 **Search Functionality** - Quick access to specific surahs and verses
- 💾 **Offline Support** - Download recitations for offline listening
- 📊 **Progress Tracking** - Track your listening progress and bookmarks
- 🔐 **User Accounts** - Save preferences and sync across devices

## ⚡️ Tech Stack

- **[NextJS 15](https://nextjs.org/)** - Full-Stack React framework
- **[Supabase](https://supabase.com/)** - Database for user data and preferences
- **[Clerk](https://clerk.com/)** - User authentication and management
- **[Tailwind CSS](https://tailwindcss.com/)** - Modern styling framework
- **[Vercel](https://vercel.com/)** - Deployment and hosting

## 🛠 Quick Setup

1. **Clone and Open**
```bash
git clone <repository-url> <your-project-name>
code -r <your-project-name>
```

2. **Set Up Git**
```bash
git remote remove origin
git remote add origin <your-new-repository-url>
git branch -M main
git push -u origin main
```

3. **Install Dependencies**
```bash
nvm use
pnpm i
```

4. **Local Development**
```bash
pnpm dev
```

## 🔑 Environment Setup

### Prerequisites
- Node.js and pnpm
- Supabase account for database
- Clerk account for authentication

### Required Services Setup
1. **Supabase**
   - Create database
   - Get connection strings from Dashboard > Connect

2. **Clerk**
   - Set up application
   - Get API keys

### Environment Variables
Create `.env` file:

```env
# Database (Required)
SUPABASE_URL=
SUPABASE_SERVICE_KEY=

# Auth (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Database Setup
```bash
pnpm prisma migrate dev --name add-initial-tables
```

## 🚀 Getting Started

1. **Clone the repository**
2. **Set up your environment variables**
3. **Run database migrations**
4. **Start development server**

### Project Structure

```
quran-player/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication routes
│   └── (player)/       # Player and Quran content routes
├── components/         # Reusable components
│   ├── player/        # Audio player components
│   ├── surah/         # Surah display components
│   └── ui/            # UI components
├── lib/               # Utility functions
├── prisma/            # Database schema
└── public/            # Static assets
```

### Key Features

#### Audio Player
- Play/pause controls
- Progress bar
- Volume control
- Playback speed adjustment
- Repeat functionality

#### Quran Content
- Surah list with metadata
- Verse-by-verse display
- Multiple translations
- Reciter selection
- Bookmarking system

#### User Features
- Account creation and management
- Progress tracking
- Custom playlists
- Offline downloads
- Settings synchronization

## 🚀 Deployment

1. Deploy to Vercel
2. Configure environment variables
3. Run database migrations:
   ```bash
   pnpm prisma db push
   ```

## 🔄 Database Migrations

```bash
# Create migration
pnpm prisma migrate dev --name <migration-name>

# Push to production
pnpm prisma db push
```

## 🔒 Security Best Practices

- Enable Row Level Security (RLS) in Supabase
- Keep service keys secure
- Use server-side Supabase calls
- Implement proper authentication checks

## 📚 Documentation

- [NextJS](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Clerk](https://clerk.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

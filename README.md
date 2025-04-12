# 📖 Quran Player

A modern, elegant web application for listening to and studying the Quran. Built with NextJS, this app provides a seamless experience for accessing Quranic recitations, translations, and study tools. Whether you're a student of the Quran, a regular listener, or someone looking to connect with the divine words, Quran Player offers a beautiful and intuitive interface for your spiritual journey.

## ✨ Key Features

- 🎧 **High-Quality Audio** - Crystal clear recitations from renowned reciters
- 📚 **Comprehensive Content** - Access to multiple translations
- 🔍 **Smart Search** - Find specific verses or topics instantly
- 📱 **Cross-Platform** - Seamless experience across all devices

## 🎯 Why Quran Player?

- **Beautiful Design** - Modern, clean interface that enhances your listening experience
- **Easy Navigation** - Intuitive controls and organized content structure
- **Rich Features** - Everything you need for Quran study in one place
- **Privacy Focused** - Your data stays secure and private

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

#### Quran Content
- Surah list with metadata
- Verse-by-verse display
- Multiple translations
- Reciter selection

## 🚀 Deployment

1. Deploy to Vercel
2. Configure environment variables
3. Run database migrations:
   ```bash
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

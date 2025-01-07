git # Quran Player App Documentation

## Project Overview
The Quran Player App is a modern web application built with Next.js that provides an interactive platform for reading and listening to the Quran. It features a clean, accessible interface with support for multiple reciters and translations.

## Project Structure

```
├── app/                    # Main application directory (Next.js 13+ app router)
│   ├── (auth)/            # Authentication related pages
│   ├── (marketing)/       # Landing and marketing pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── quran/             # Quran player component
│   └── layout.tsx         # Root layout component
├── components/            # Reusable UI components
├── lib/                   # Utility functions and core logic
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── prisma/               # Database schema and configurations
```

## Core Features

### 1. Quran Player (`/app/quran/page.tsx`)

#### State Management
```typescript
- surahs: Surah[]                 # List of all Quran chapters
- currentSurah: Surah | null      # Currently selected chapter
- currentAyahs: Ayah[]            # Verses of current chapter
- audioRef: HTMLAudioElement      # Audio player reference
- currentAyahIndex: number        # Current verse index
- isPlaying: boolean              # Playback state
- isContinuousPlay: boolean       # Auto-play next verse
- showFullSurah: boolean          # View mode toggle
- selectedReciter: string         # Current reciter ID
```

#### Key Functions

##### Surah Selection
```typescript
handleSurahSelect(surah: Surah): void
- Loads surah data
- Updates current surah state
- Prepares audio player
- Resets playback state
```

##### Audio Controls
```typescript
playAudio(): void       # Plays current verse
pauseAudio(): void     # Pauses playback
stopAudio(): void      # Stops and resets playback
playNextAyah(): void   # Moves to next verse
playPreviousAyah(): void # Moves to previous verse
```

##### Reciter Management
```typescript
handleReciterChange(reciterId: string): void
- Updates selected reciter
- Reloads audio with new reciter
- Maintains current verse position
```

### 2. UI Components

#### Surah List
- Displays all 114 surahs
- Shows surah number, name, and translation
- Highlights current selection
- Scrollable interface

#### Verse Display
Two view modes:
1. Single Verse
   - Focused view of current verse
   - Arabic text with translation
   - Verse navigation controls

2. Full Surah
   - Complete chapter view
   - Clickable verses for playback
   - Smooth scroll to selected verse

#### Audio Player
- Play/Pause controls
- Next/Previous verse navigation
- Stop button
- Continuous play toggle
- Reciter selection dropdown

### 3. API Integration

#### Quran.com API v4
```typescript
getAudioUrl(ayahNumber: number, reciterId: string): string
- Constructs API URL for verse audio
- Format: https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}/${ayahInSurah}
```

#### Data Fetching
```typescript
getAllSurahs(): Promise<Surah[]>    # Fetches all surahs
getSurah(number: number): Promise<{ayahs: Ayah[]}> # Fetches specific surah
```

## UI/UX Features

### 1. Styling
- TailwindCSS for responsive design
- Shadcn/ui components for consistent UI
- Custom color scheme and typography
- Responsive layout for all screen sizes

### 2. Accessibility
- RTL support for Arabic text
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly structure

### 3. Performance
- Dynamic loading of audio content
- Optimized verse rendering
- Smooth transitions and animations
- Efficient state management

## Technical Requirements

### Dependencies
```json
{
  "next": "^13.0.0",
  "react": "^18.0.0",
  "tailwindcss": "^3.0.0",
  "typescript": "^4.0.0"
}
```

### Environment Setup
1. Node.js (version specified in .nvmrc)
2. Package manager (npm/pnpm)
3. Environment variables (see .env.template)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.template .env
   ```
4. Run development server:
   ```bash
   pnpm dev
   ```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Submit pull request

## License
See LICENSE file for details. 
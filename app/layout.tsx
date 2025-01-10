import { Providers } from "./providers"
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Quran Sphere</title>
        <meta name="description" content="Digital Quran with beautiful recitations" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

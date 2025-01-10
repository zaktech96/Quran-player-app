'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong loading the Quran player!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
} 
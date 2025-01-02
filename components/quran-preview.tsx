"use client"

export default function QuranPreview() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm p-6 shadow-2xl">
      <div className="grid grid-cols-12 gap-6">
        {/* Surah List Preview */}
        <div className="col-span-4 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-primary/20 rounded"></div>
            <div className="h-4 w-16 bg-muted rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 rounded-lg bg-background/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-4 w-4 bg-primary/20 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-primary/20 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Preview */}
        <div className="col-span-8 space-y-6">
          <div className="rounded-lg bg-primary/5 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="h-8 w-48 bg-primary/20 rounded mb-2"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
              <div className="text-right">
                <div className="h-6 w-32 bg-primary/20 rounded mb-2"></div>
                <div className="h-4 w-24 bg-muted rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-6 w-32 bg-primary/10 rounded-full"></div>
              </div>
              <div className="h-32 bg-primary/10 rounded-xl"></div>
              <div className="h-24 bg-muted/30 rounded-lg"></div>
            </div>
          </div>

          {/* Audio Controls Preview */}
          <div className="rounded-lg bg-primary/5 p-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="h-12 w-12 rounded-full bg-primary"></div>
              <div className="h-10 w-10 rounded-full bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
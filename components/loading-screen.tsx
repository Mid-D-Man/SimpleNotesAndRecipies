"use client"

import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <BookOpen className="w-16 h-16 text-primary animate-pulse" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-serif text-foreground">Notes & Todos</h1>
          <p className="text-sm text-muted-foreground">Loading your notes...</p>
        </div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

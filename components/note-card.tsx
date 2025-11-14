"use client"

import { Star } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NoteCardProps {
  id: string
  title: string
  preview: string
  lastModified: string
  isBookmarked: boolean
  tags: string[]
  onToggleBookmark: (id: string) => void
  onClick: (id: string) => void
}

export function NoteCard({
  id,
  title,
  preview,
  lastModified,
  isBookmarked,
  tags,
  onToggleBookmark,
  onClick,
}: NoteCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow relative bg-card border-border"
      onClick={() => onClick(id)}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("absolute top-2 right-2 w-8 h-8", isBookmarked && "text-primary")}
        onClick={(e) => {
          e.stopPropagation()
          onToggleBookmark(id)
        }}
      >
        <Star className={cn("w-4 h-4", isBookmarked && "fill-current")} />
      </Button>

      <h3 className="font-semibold text-foreground mb-2 pr-8 line-clamp-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">{preview}</p>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-xs text-muted-foreground">{new Date(lastModified).toLocaleDateString()}</p>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}

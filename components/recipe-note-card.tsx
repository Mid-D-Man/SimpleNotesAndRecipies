"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Note {
  id: string
  category: string
  title: string
  content: string
}

interface RecipeNoteCardProps {
  note: Note
  onUpdate: (id: string, title: string, content: string) => void
  onDelete: (id: string) => void
}

export function RecipeNoteCard({ note, onUpdate, onDelete }: RecipeNoteCardProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onUpdate(note.id, newTitle, content)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onUpdate(note.id, title, newContent)
  }

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="h-7 text-xs font-medium border-none px-0 focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => onDelete(note.id)}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <Textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Write your note..."
        className="min-h-[80px] text-xs border-none p-0 focus-visible:ring-0 resize-none"
      />
    </Card>
  )
}

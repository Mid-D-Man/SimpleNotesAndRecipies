"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RecipeStepCardProps {
  stepNumber: number
  title: string
  content: string
  onUpdate: (title: string, content: string) => void
  onDelete: () => void
}

export function RecipeStepCard({ stepNumber, title, content, onUpdate, onDelete }: RecipeStepCardProps) {
  const [localTitle, setLocalTitle] = useState(title)
  const [localContent, setLocalContent] = useState(content)

  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle)
    onUpdate(newTitle, localContent)
  }

  const handleContentChange = (newContent: string) => {
    setLocalContent(newContent)
    onUpdate(localTitle, newContent)
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-semibold text-primary">Step {stepNumber}</span>
          <Input
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Step title..."
            className="flex-1 h-8 text-sm font-medium"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onDelete}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Textarea
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Describe this step in detail..."
        className="min-h-[100px] text-sm resize-none"
      />
    </Card>
  )
}

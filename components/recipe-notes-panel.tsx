"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Note {
  id: string
  category: string
  content: string
}

interface RecipeNotesPanelProps {
  notes: Note[]
  currentCategory: string
  onAddNote: (category: string) => void
  onUpdateNote: (id: string, content: string) => void
}

export function RecipeNotesPanel({ notes, currentCategory, onAddNote, onUpdateNote }: RecipeNotesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryNotes = notes.filter((note) => note.category === currentCategory)

  return (
    <div
      className={cn(
        "relative border-r border-border bg-card transition-all duration-300 flex flex-col",
        isExpanded ? "w-full" : "w-12",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </Button>

      {isExpanded ? (
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Notes</h3>
            <Button size="sm" variant="outline" onClick={() => onAddNote(currentCategory)} className="h-8 gap-1">
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {categoryNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No notes yet. Add one to get started!</p>
            ) : (
              categoryNotes.map((note) => (
                <Card key={note.id} className="p-3">
                  <Textarea
                    value={note.content}
                    onChange={(e) => onUpdateNote(note.id, e.target.value)}
                    placeholder="Write your note..."
                    className="min-h-[60px] text-xs border-none p-0 focus-visible:ring-0"
                  />
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-xs text-muted-foreground writing-mode-vertical transform rotate-180">Notes</span>
        </div>
      )}
    </div>
  )
}

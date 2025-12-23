"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RecipeNoteCard } from "@/components/recipe-note-card"

interface Note {
  id: string
  category: string
  title: string
  content: string
}

interface RecipeNotesSidebarProps {
  notes: Note[]
  currentCategory: string
  onAddNote: (category: string) => void
  onUpdateNote: (id: string, title: string, content: string) => void
  onDeleteNote: (id: string) => void
}

export function RecipeNotesSidebar({
  notes,
  currentCategory,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: RecipeNotesSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryNotes = notes.filter((note) => note.category === currentCategory)

  return (
    <div
      className={cn(
        "relative border-r border-border bg-card transition-all duration-300 flex flex-col overflow-hidden",
        isExpanded ? "w-[280px] sm:w-[320px] md:w-[360px]" : "w-14",
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-full top-6 z-20 h-8 w-8 rounded-l-full border-2 border-border bg-card shadow-md hover:bg-accent hover:shadow-lg transition-all flex items-center justify-center"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded ? (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-5 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">Notes</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddNote(currentCategory)}
                className="h-8 gap-1.5 px-3"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {categoryNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground mb-1">No notes yet.</p>
                <p className="text-xs text-muted-foreground">Add one to get started!</p>
              </div>
            ) : (
              categoryNotes.map((note) => (
                <RecipeNoteCard key={note.id} note={note} onUpdate={onUpdateNote} onDelete={onDeleteNote} />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full py-8">
          <span className="text-xs font-medium text-muted-foreground [writing-mode:vertical-lr] rotate-180 whitespace-nowrap">Notes</span>
        </div>
      )}
    </div>
  )
}

"use client"

import { ArrowLeft, Share2, Save, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RecipeEditorHeaderProps {
  onBack: () => void
  onSave: () => void
  onDelete: () => void
  onShare: () => void
}

export function RecipeEditorHeader({ onBack, onSave, onDelete, onShare }: RecipeEditorHeaderProps) {
  return (
    <header className="h-[12vh] min-h-[70px] max-h-[100px] border-b border-border bg-card px-4 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        <span className="sr-only">Back</span>
      </Button>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="w-5 h-5" />
          <span className="sr-only">Share</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={onSave}>
          <Save className="w-5 h-5" />
          <span className="sr-only">Save</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-5 h-5" />
          <span className="sr-only">Delete</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem>Print recipe</DropdownMenuItem>
            <DropdownMenuItem>Change category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

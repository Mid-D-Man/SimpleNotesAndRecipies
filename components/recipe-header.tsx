"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Save, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface RecipeHeaderProps {
  onBack: () => void
  onSave: () => void
  onDelete: () => void
  onShare: () => void
  category: string
  onCategoryChange: (category: string) => void
}

export function RecipeHeader({ onBack, onSave, onDelete, onShare, category, onCategoryChange }: RecipeHeaderProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await onSave()
    // Keep spinner visible for a moment to show feedback
    setTimeout(() => setIsSaving(false), 500)
  }

  return (
    <header className="h-full px-4 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back</span>
        </Button>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Breakfast">Breakfast</SelectItem>
            <SelectItem value="Lunch">Lunch</SelectItem>
            <SelectItem value="Dinner">Dinner</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
            <SelectItem value="Snacks">Snacks</SelectItem>
            <SelectItem value="Beverages">Beverages</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="w-5 h-5" />
          <span className="sr-only">Share</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Spinner className="w-5 h-5" /> : <Save className="w-5 h-5" />}
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
            <DropdownMenuItem>Add to favorites</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

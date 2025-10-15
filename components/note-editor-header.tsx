"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Save, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { storage } from "@/lib/storage"

interface NoteEditorHeaderProps {
  onBack: () => void
  noteId: string
  title: string
  content: string
  category: string
  onCategoryChange: (category: string) => void
}

export function NoteEditorHeader({
  onBack,
  noteId,
  title,
  content,
  category,
  onCategoryChange,
}: NoteEditorHeaderProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    const noteData = {
      id: noteId === "new" ? Date.now().toString() : noteId,
      title,
      content,
      preview: content.substring(0, 100),
      lastModified: new Date().toISOString(),
      isBookmarked: false,
      type: "regular" as const,
      category,
    }

    if (noteId === "new") {
      storage.addNote(noteData)
      router.push(`/note/${noteData.id}`)
    } else {
      storage.updateNote(noteId, noteData)
    }

    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    })

    // Keep spinner visible for a moment to show feedback
    setTimeout(() => setIsSaving(false), 500)
  }

  const handleDelete = () => {
    storage.deleteNote(noteId)
    toast({
      title: "Note deleted",
      description: "Your note has been deleted.",
      variant: "destructive",
    })
    router.push("/")
  }

  const handleShare = () => {
    toast({
      title: "Share note",
      description: "Share functionality coming soon.",
    })
  }

  return (
    <header className="h-[15vh] min-h-[80px] max-h-[120px] border-b border-border bg-card px-4 flex items-center justify-between">
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
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Ideas">Ideas</SelectItem>
            <SelectItem value="Shopping">Shopping</SelectItem>
            <SelectItem value="Travel">Travel</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="w-5 h-5" />
          <span className="sr-only">Share</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Spinner className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          <span className="sr-only">Save</span>
        </Button>

        <Button variant="ghost" size="icon" onClick={handleDelete}>
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

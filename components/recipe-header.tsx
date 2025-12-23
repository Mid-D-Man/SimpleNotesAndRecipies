"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Save, Trash2, MoreVertical, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { storage } from "@/lib/storage"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TagSelector } from "@/components/tag-selector"

interface RecipeHeaderProps {
  onBack: () => void
  todoId: string
  tags: string[]
  availableTags: string[]
  onTagsChange: (tags: string[]) => void
  onSave: () => Promise<void>
  onDelete: () => void
  onShare: () => void
  title?: string
  steps?: any[]
}

export function RecipeHeader({
  onBack,
  todoId,
  tags,
  availableTags,
  onTagsChange,
  onSave,
  onDelete,
  onShare,
  title = "Todo",
  steps = [],
}: RecipeHeaderProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      toast({
        title: "Todo saved",
        description: "Your todo has been saved successfully.",
      })
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }

  const handleBack = async () => {
    setIsSaving(true)
    try {
      await onSave()
    } finally {
      setIsSaving(false)
      onBack()
    }
  }

  const handleDeleteConfirmed = () => {
    onDelete()
    storage.deleteNote(todoId)
    router.push("/")
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag))
  }

  const handleDuplicate = () => {
    const newNote = {
      id: Date.now().toString(),
      title: `${storage.getNotes().find((n) => n.id === todoId)?.title || "Todo"} (Copy)`,
      content: storage.getNotes().find((n) => n.id === todoId)?.content || "",
      preview: "",
      lastModified: new Date().toISOString(),
      isBookmarked: false,
      type: "todo" as const,
      tags,
    }
    storage.addNote(newNote)
    router.push(`/todo/${newNote.id}`)
    toast({
      title: "Todo duplicated",
      description: "Your todo has been duplicated.",
    })
  }

  const handleDownload = () => {
    let content = `${title}\n\n`
    steps.forEach((step) => {
      content += `${step.title}\n${step.content}\n\n`
    })
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${title || "todo"}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(element.href)
    toast({
      title: "Todo downloaded",
      description: "Your todo has been downloaded as a text file.",
    })
  }

  return (
    <div className="h-full px-4 py-3 flex flex-col gap-3 border-b border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Back</span>
          </Button>
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

          <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)}>
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
              <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download as Text
              </DropdownMenuItem>
              <DropdownMenuItem>Add to favorites</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TagSelector
        selectedTags={tags}
        availableTags={availableTags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

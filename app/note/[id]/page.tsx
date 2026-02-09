"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { NoteEditorHeader } from "@/components/note-editor-header"
import { FormattingToolbar } from "@/components/formatting-toolbar"
import { NoteTitle } from "@/components/note-title"
import { NoteContent } from "@/components/note-content"
import { storage } from "@/lib/storage"

export default function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [noteId, setNoteId] = useState<string | null>(null)
  const [title, setTitle] = useState("Untitled Note")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    // Await params and load note data
    const loadNote = async () => {
      const resolvedParams = await params
      setNoteId(resolvedParams.id)
      
      // Load available tags
      setAvailableTags(storage.getTags("note"))

      if (resolvedParams.id !== "new") {
        const allNotes = storage.getNotes()
        const note = allNotes.find((n) => n.id === resolvedParams.id && n.type === "regular")
        if (note) {
          setTitle(note.title)
          setContent(note.content)
          setTags(note.tags || [])
        }
      }
    }
    
    loadNote()
  }, [params])

  const handleFormat = (format: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    if (format.startsWith("color:")) {
      const color = format.split(":")[1]
      document.execCommand("foreColor", false, color)
    } else {
      switch (format) {
        case "bold":
          document.execCommand("bold")
          break
        case "italic":
          document.execCommand("italic")
          break
        case "underline":
          document.execCommand("underline")
          break
        case "bulletList":
          document.execCommand("insertUnorderedList")
          break
        case "orderedList":
          document.execCommand("insertOrderedList")
          break
        case "alignLeft":
          document.execCommand("justifyLeft")
          break
        case "alignCenter":
          document.execCommand("justifyCenter")
          break
        case "alignRight":
          document.execCommand("justifyRight")
          break
      }
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  const handleSave = async () => {
    if (!noteId) return
    
    const noteData = {
      id: noteId === "new" ? Date.now().toString() : noteId,
      title,
      content,
      preview: content.substring(0, 100),
      lastModified: new Date().toISOString(),
      isBookmarked: false,
      type: "regular" as const,
      tags,
    }

    if (noteId === "new") {
      storage.addNote(noteData)
      router.push(`/note/${noteData.id}`)
    } else {
      storage.updateNote(noteId, noteData)
    }

    // Add tags to available tags
    tags.forEach((tag) => storage.addTag(tag, "note"))
    setAvailableTags(storage.getTags("note"))
  }

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background">
      {/* Header - 15% */}
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex-shrink-0">
        <NoteEditorHeader
          onBack={handleBack}
          noteId={noteId || ""}
          title={title}
          content={content}
          tags={tags}
          availableTags={availableTags}
          onTagsChange={setTags}
          onSave={handleSave}
        />
      </div>

      {/* Content area - 70% with proper spacing */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-8 pb-12 min-h-0">
        <div className="max-w-3xl mx-auto space-y-6">
          <NoteTitle value={title} onChange={setTitle} />
          <NoteContent value={content} onChange={setContent} />
        </div>
      </div>

      {/* Toolbar - 15% */}
      <div className="h-[15vh] min-h-[80px] max-h-[120px] flex-shrink-0">
        <FormattingToolbar onFormat={handleFormat} />
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { LoadingScreen } from "@/components/loading-screen"
import { AppHeader } from "@/components/app-header"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { storage, type Note } from "@/lib/storage"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [todos, setTodos] = useState<Note[]>([])
  const [activeView, setActiveView] = useState<"notes" | "todos">("notes")
  const [noteTags, setNoteTags] = useState<string[]>([])
  const [todoTags, setTodoTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    // Load notes from local storage
    const storedNotes = storage.getNotes()
    if (storedNotes.length === 0) {
      // Initialize with sample data
      const sampleNotes: Note[] = [
        {
          id: "1",
          title: "Shopping List",
          content: "Milk, eggs, bread, butter",
          preview: "Milk, eggs, bread, butter...",
          lastModified: new Date().toISOString(),
          isBookmarked: true,
          type: "regular",
          tags: ["Personal"],
        },
        {
          id: "2",
          title: "Meeting Notes",
          content: "Discussed project timeline and deliverables",
          preview: "Discussed project timeline and deliverables...",
          lastModified: new Date().toISOString(),
          isBookmarked: false,
          type: "regular",
          tags: ["Work"],
        },
      ]
      storage.saveNotes(sampleNotes)
      sampleNotes.forEach((n) => storage.addTag(n.tags[0], "note"))
      setNotes(sampleNotes.filter((n) => n.type === "regular"))
      setNoteTags(storage.getTags("note"))
    } else {
      const regularNotes = storedNotes.filter((n) => n.type === "regular")
      const todoNotes = storedNotes.filter((n) => n.type === "todo")
      setNotes(regularNotes)
      setTodos(todoNotes)
      setNoteTags(storage.getTags("note"))
      setTodoTags(storage.getTags("todo"))
    }
  }, [])

  const handleToggleBookmark = (id: string) => {
    const noteToUpdate = [...notes, ...todos].find((n) => n.id === id)
    if (noteToUpdate) {
      storage.updateNote(id, { isBookmarked: !noteToUpdate.isBookmarked })
      const updatedAll = storage.getNotes()
      setNotes(updatedAll.filter((n) => n.type === "regular"))
      setTodos(updatedAll.filter((n) => n.type === "todo"))
    }
  }

  const handleNoteClick = (id: string) => {
    const note = [...notes, ...todos].find((n) => n.id === id)
    if (note?.type === "todo") {
      router.push(`/todo/${id}`)
    } else {
      router.push(`/note/${id}`)
    }
  }

  const handleNewNote = () => {
    router.push("/note/new")
  }

  const handleNewTodo = () => {
    router.push("/todo/new")
  }

  const handleAddTag = (name: string) => {
    if (activeView === "notes") {
      storage.addTag(name, "note")
      setNoteTags(storage.getTags("note"))
    } else {
      storage.addTag(name, "todo")
      setTodoTags(storage.getTags("todo"))
    }
  }

  const handleRemoveTag = (name: string) => {
    if (activeView === "notes") {
      storage.removeTag(name, "note")
      setNoteTags(storage.getTags("note"))
    } else {
      storage.removeTag(name, "todo")
      setTodoTags(storage.getTags("todo"))
    }
  }

  const displayItems = activeView === "notes" ? notes : todos
  const filteredItems = selectedTag
    ? displayItems.filter((item) => item.tags.includes(selectedTag))
    : displayItems
  const currentTags = activeView === "notes" ? noteTags : todoTags

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background">
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex-shrink-0">
        <AppHeader />
      </div>

      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex">
          <button
            onClick={() => {
              setActiveView("notes")
              setSelectedTag(null)
            }}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeView === "notes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => {
              setActiveView("todos")
              setSelectedTag(null)
            }}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeView === "todos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 pb-8 min-h-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const tagName = prompt("Enter tag name:")
                  if (tagName) {
                    handleAddTag(tagName)
                  }
                }}
              >
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveTag(tag)
                      if (selectedTag === tag) setSelectedTag(null)
                    }}
                    className="ml-2 hover:opacity-70"
                  >
                    ×
                  </button>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {activeView === "notes" ? "All Notes" : "All Todos"}
              {selectedTag && ` - ${selectedTag}`}
            </h2>
            <Button size="default" className="gap-2" onClick={activeView === "notes" ? handleNewNote : handleNewTodo}>
              <Plus className="w-4 h-4" />
              {activeView === "notes" ? "New Note" : "New Todo"}
            </Button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base text-muted-foreground mb-6">
                No {activeView === "notes" ? "notes" : "todos"} yet. Create your first one!
              </p>
              <Button onClick={activeView === "notes" ? handleNewNote : handleNewTodo} size="lg">
                Create {activeView === "notes" ? "Note" : "Todo"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {filteredItems.map((item) => (
                <NoteCard
                  key={item.id}
                  {...item}
                  tags={item.tags}
                  onToggleBookmark={handleToggleBookmark}
                  onClick={handleNoteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

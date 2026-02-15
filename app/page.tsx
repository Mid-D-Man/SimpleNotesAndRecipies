"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { LoadingScreen } from "@/components/loading-screen"
import { AppHeader } from "@/components/app-header"
import { NoteCard } from "@/components/note-card"
import { AINoteCreator } from "@/components/ai-note-creator"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "bookmarked">("recent")

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
  
  const searchFilteredItems = filteredItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort items based on sortBy
  const sortedItems = [...searchFilteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "bookmarked":
        return (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0)
      default:
        return 0
    }
  })

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background no-horizontal-scroll">
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex-shrink-0">
        <AppHeader />
      </div>

      <div className="flex-shrink-0 border-b border-border bg-card overflow-x-auto">
        <div className="px-4 sm:px-6 flex">
          <button
            onClick={() => {
              setActiveView("notes")
              setSelectedTag(null)
              setSortBy("recent")
            }}
            className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
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
              setSortBy("recent")
            }}
            className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-colors text-sm sm:text-base whitespace-nowrap ${
              activeView === "todos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6 pb-8 min-h-0">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Filter and Sort Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder={`Search ${activeView === "notes" ? "notes" : "todos"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-border rounded-md bg-card text-foreground text-sm appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="recent">Recent</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="bookmarked">Bookmarked</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="pb-4 border-b border-border">
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
                  className="h-8 text-xs sm:text-sm"
                >
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(activeView === "notes" ? noteTags : todoTags).map((tag) => (
                  <div
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className="cursor-pointer hover:opacity-70"
                    >
                      {tag}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveTag(tag)
                        if (selectedTag === tag) setSelectedTag(null)
                      }}
                      className="hover:opacity-70 ml-1"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Note Creator - Only show in notes view */}
          {activeView === "notes" && (
            <AINoteCreator
              onNoteCreated={(note) => {
                const newNote: Note = {
                  id: Date.now().toString(),
                  title: note.title,
                  content: note.content,
                  preview: note.content.substring(0, 100) + "...",
                  lastModified: new Date().toISOString(),
                  isBookmarked: false,
                  type: "regular",
                  tags: ["AI Generated"],
                }
                storage.saveNote(newNote)
                storage.addTag("AI Generated", "note")
                setNotes([newNote, ...notes])
                setNoteTags(storage.getTags("note"))
              }}
            />
          )}

          {/* Header and New Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                {activeView === "notes" ? "All Notes" : "All Todos"}
                {selectedTag && ` - ${selectedTag}`}
              </h2>
            </div>
            <Button size="default" className="gap-2 w-full sm:w-auto" onClick={activeView === "notes" ? handleNewNote : handleNewTodo}>
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">{activeView === "notes" ? "New Note" : "New Todo"}</span>
            </Button>
          </div>

          {sortedItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base text-muted-foreground mb-6">
                No {activeView === "notes" ? "notes" : "todos"} found.
              </p>
              <Button onClick={activeView === "notes" ? handleNewNote : handleNewTodo} size="lg">
                Create {activeView === "notes" ? "Note" : "Todo"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {sortedItems.map((item) => (
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

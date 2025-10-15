"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { LoadingScreen } from "@/components/loading-screen"
import { AppHeader } from "@/components/app-header"
import { NoteCard } from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Plus, ChefHat } from "lucide-react"
import { storage, type Note } from "@/lib/storage"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [recipes, setRecipes] = useState<Note[]>([])

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
          category: "Groceries",
        },
        {
          id: "2",
          title: "Meeting Notes",
          content: "Discussed project timeline and deliverables",
          preview: "Discussed project timeline and deliverables...",
          lastModified: new Date().toISOString(),
          isBookmarked: false,
          type: "regular",
          category: "Work",
        },
      ]
      storage.saveNotes(sampleNotes)
      setNotes(sampleNotes.filter((n) => n.type === "regular"))
    } else {
      setNotes(storedNotes.filter((n) => n.type === "regular"))
      setRecipes(storedNotes.filter((n) => n.type === "recipe"))
    }
  }, [])

  const handleToggleBookmark = (id: string) => {
    storage.updateNote(id, { isBookmarked: !notes.find((n) => n.id === id)?.isBookmarked })
    setNotes(storage.getNotes().filter((n) => n.type === "regular"))
  }

  const handleNoteClick = (id: string) => {
    const note = [...notes, ...recipes].find((n) => n.id === id)
    if (note?.type === "recipe") {
      router.push(`/recipe/${id}`)
    } else {
      router.push(`/note/${id}`)
    }
  }

  const handleNewNote = () => {
    router.push("/note/new")
  }

  const handleNewRecipe = () => {
    router.push("/recipe/new")
  }

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background">
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex-shrink-0">
        <AppHeader />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 pb-8 min-h-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">All Notes</h2>
            <Button size="default" className="gap-2" onClick={handleNewNote}>
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base text-muted-foreground mb-6">No notes yet. Create your first note!</p>
              <Button onClick={handleNewNote} size="lg">
                Create Note
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  {...note}
                  category={note.category}
                  onToggleBookmark={handleToggleBookmark}
                  onClick={handleNoteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="h-[20vh] min-h-[140px] max-h-[200px] border-t border-border bg-card px-4 sm:px-6 py-5 overflow-hidden flex-shrink-0">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <ChefHat className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Recipes</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="min-w-[180px] max-w-[180px] p-4 cursor-pointer hover:shadow-lg transition-all flex-shrink-0 border-2 bg-card"
                onClick={() => handleNoteClick(recipe.id)}
              >
                <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-1">{recipe.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{recipe.preview}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(recipe.lastModified).toLocaleDateString()}</span>
                  {recipe.category && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {recipe.category}
                    </span>
                  )}
                </div>
              </Card>
            ))}
            <Button
              variant="outline"
              className="min-w-[180px] max-w-[180px] h-auto flex-shrink-0 flex flex-col items-center justify-center gap-2 py-6 bg-card border-2 border-dashed hover:border-primary hover:bg-accent/50 transition-all"
              onClick={handleNewRecipe}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">New Recipe</span>
            </Button>
          </div>
        </div>
      </footer>
    </main>
  )
}

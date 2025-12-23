"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { RecipeHeader } from "@/components/recipe-header"
import { RecipeNotesSidebar } from "@/components/recipe-notes-sidebar"
import { RecipeStepsSection } from "@/components/recipe-steps-section"
import { RecipeCategoryTabs } from "@/components/recipe-category-tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { storage } from "@/lib/storage"

interface RecipeStep {
  id: string
  category: string
  title: string
  content: string
}

interface Note {
  id: string
  category: string
  title: string
  content: string
}

export default function TodoEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("Untitled Todo")
  const [currentCategory, setCurrentCategory] = useState("Steps")
  const [categories, setCategories] = useState<string[]>(["Steps"])
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const [steps, setSteps] = useState<RecipeStep[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    setAvailableTags(storage.getTags("todo"))

    if (params.id !== "new") {
      const allNotes = storage.getNotes()
      const todo = allNotes.find((n) => n.id === params.id && n.type === "todo")
      if (todo) {
        setTitle(todo.title)
        setTags(todo.tags || [])
        if (todo.steps) {
          setSteps(todo.steps as any)
        }
        if (todo.notes) {
          setNotes(todo.notes as any)
        }
        if (todo.categories) {
          setCategories(todo.categories as any)
          setCurrentCategory((todo.categories as any)[0])
        }
      }
    }
  }, [params.id])

  const handleAddStep = () => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      category: currentCategory,
      title: "",
      content: "",
    }
    setSteps([...steps, newStep])
  }

  const handleUpdateStep = (id: string, title: string, content: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, title, content } : step)))
  }

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const handleAddNote = (category: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      category,
      title: "",
      content: "",
    }
    setNotes([...notes, newNote])
  }

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, title, content } : note)))
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleAddCategory = (name: string) => {
    if (!categories.includes(name)) {
      const newCategories = [...categories, name]
      setCategories(newCategories)
    }
  }

  const handleRemoveCategory = (name: string) => {
    const newCategories = categories.filter((c) => c !== name)
    setCategories(newCategories)
    const stepsInCategory = steps.filter((s) => s.category === name)
    if (stepsInCategory.length > 0) {
      setSteps(steps.filter((s) => s.category !== name))
    }
  }

  const handleSave = async () => {
    const todoData = {
      id: params.id === "new" ? Date.now().toString() : params.id,
      title,
      content: "",
      preview: `${steps.length} steps`,
      lastModified: new Date().toISOString(),
      isBookmarked: false,
      type: "todo" as const,
      tags,
      steps: steps,
      notes: notes,
      categories: categories,
    }

    if (params.id === "new") {
      storage.addNote(todoData)
      router.push(`/todo/${todoData.id}`)
    } else {
      storage.updateNote(params.id, todoData)
    }

    tags.forEach((tag) => storage.addTag(tag, "todo"))
    setAvailableTags(storage.getTags("todo"))
  }

  const handleDelete = () => {
    toast({
      title: "Todo deleted",
      description: "Your todo has been deleted.",
      variant: "destructive",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share todo",
      description: "Share functionality coming soon.",
    })
  }

  const handleBack = () => {
    router.push("/")
  }

  const categorySteps = steps.filter((step) => step.category === currentCategory)

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background no-horizontal-scroll">
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex flex-col border-b border-border bg-card flex-shrink-0">
        <RecipeHeader
          onBack={handleBack}
          todoId={params.id}
          tags={tags}
          availableTags={availableTags}
          onTagsChange={setTags}
          onSave={handleSave}
          onDelete={handleDelete}
          onShare={handleShare}
          title={title}
          steps={steps}
        />
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="hidden sm:flex sm:w-[200px] md:w-[280px] flex-shrink-0 border-r border-border">
          <RecipeNotesSidebar
            notes={notes}
            currentCategory={currentCategory}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-3 sm:p-4 md:p-6 border-b border-border bg-card space-y-3 sm:space-y-4 flex-shrink-0">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg sm:text-xl md:text-2xl font-semibold border-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
              placeholder="Todo title..."
            />
            <RecipeCategoryTabs
              categories={categories}
              currentCategory={currentCategory}
              onCategoryChange={setCurrentCategory}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />
          </div>

          <RecipeStepsSection
            steps={categorySteps}
            category={currentCategory}
            onAddStep={handleAddStep}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
          />
        </div>
      </div>
    </main>
  )
}

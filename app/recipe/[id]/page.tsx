"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function RecipeEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("Chocolate Chip Cookies")
  const [currentCategory, setCurrentCategory] = useState("ingredients")
  const [recipeCategory, setRecipeCategory] = useState("Desserts")

  const [steps, setSteps] = useState<RecipeStep[]>([
    {
      id: "1",
      category: "ingredients",
      title: "Dry ingredients",
      content: "2 cups all-purpose flour\n1 tsp baking soda\n1 tsp salt",
    },
    {
      id: "2",
      category: "ingredients",
      title: "Wet ingredients",
      content: "1 cup butter (softened)\n3/4 cup granulated sugar\n3/4 cup brown sugar\n2 eggs\n2 tsp vanilla extract",
    },
    {
      id: "3",
      category: "instructions",
      title: "Prepare ingredients",
      content: "Gather all ingredients and measure them out. Bring butter to room temperature.",
    },
    {
      id: "4",
      category: "instructions",
      title: "Mix dry ingredients",
      content: "In a bowl, whisk together flour, baking soda, and salt.",
    },
  ])

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "n1",
      category: "ingredients",
      title: "Shopping list",
      content: "Don't forget chocolate chips!\nUse good quality butter for best results.",
    },
    {
      id: "n2",
      category: "instructions",
      title: "Timing notes",
      content: "Bake for 10-12 minutes at 350°F\nCookies will look slightly underdone - that's perfect!",
    },
  ])

  useEffect(() => {
    if (params.id !== "new") {
      const allNotes = storage.getNotes()
      const recipe = allNotes.find((n) => n.id === params.id && n.type === "recipe")
      if (recipe) {
        setTitle(recipe.title)
        setRecipeCategory(recipe.category || "Uncategorized")
        if (recipe.steps) {
          setSteps(recipe.steps as any)
        }
        if (recipe.notes) {
          setNotes(recipe.notes as any)
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

  const handleSave = () => {
    const recipeData = {
      id: params.id === "new" ? Date.now().toString() : params.id,
      title,
      content: "", // Not used for recipes
      preview: `${steps.length} steps`,
      lastModified: new Date().toISOString(),
      isBookmarked: false,
      type: "recipe" as const,
      category: recipeCategory,
      steps: steps,
      notes: notes,
    }

    if (params.id === "new") {
      storage.addNote(recipeData)
      router.push(`/recipe/${recipeData.id}`)
    } else {
      storage.updateNote(params.id, recipeData)
    }

    toast({
      title: "Recipe saved",
      description: "Your recipe has been saved successfully.",
    })
  }

  const handleDelete = () => {
    storage.deleteNote(params.id)
    toast({
      title: "Recipe deleted",
      description: "Your recipe has been deleted.",
      variant: "destructive",
    })
    router.push("/")
  }

  const handleShare = () => {
    toast({
      title: "Share recipe",
      description: "Share functionality coming soon.",
    })
  }

  const handleBack = () => {
    router.push("/")
  }

  const categorySteps = steps.filter((step) => step.category === currentCategory)

  return (
    <main className="flex flex-col h-screen w-full overflow-x-hidden bg-background">
      <div className="h-[15vh] min-h-[100px] max-h-[140px] flex flex-col border-b border-border bg-card">
        <RecipeHeader
          onBack={handleBack}
          onSave={handleSave}
          onDelete={handleDelete}
          onShare={handleShare}
          category={recipeCategory}
          onCategoryChange={setRecipeCategory}
        />
      </div>

      <div className="flex-1 flex overflow-hidden overflow-x-hidden min-h-0">
        <RecipeNotesSidebar
          notes={notes}
          currentCategory={currentCategory}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />

        <div className="flex-1 flex flex-col overflow-hidden overflow-x-hidden bg-background">
          <div className="p-4 sm:p-6 border-b border-border bg-card space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl sm:text-2xl font-semibold border-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
              placeholder="Recipe title..."
            />
            <RecipeCategoryTabs currentCategory={currentCategory} onCategoryChange={setCurrentCategory} />
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

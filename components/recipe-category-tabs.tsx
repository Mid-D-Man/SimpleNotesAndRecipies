"use client"

import { useState } from "react"
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RecipeCategoryTabsProps {
  categories: string[]
  currentCategory: string
  onCategoryChange: (category: string) => void
  onAddCategory: (category: string) => void
  onRemoveCategory: (category: string) => void
}

export function RecipeCategoryTabs({
  categories,
  currentCategory,
  onCategoryChange,
  onAddCategory,
  onRemoveCategory,
}: RecipeCategoryTabsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim())
      setNewCategory("")
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Sub-categories</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(!isAdding)}
          className="h-7 gap-1 px-2"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCategory()
              if (e.key === "Escape") {
                setIsAdding(false)
                setNewCategory("")
              }
            }}
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddCategory}
            className="h-8 px-3"
          >
            Save
          </Button>
        </div>
      )}

      {categories.length > 0 ? (
        <Tabs value={currentCategory} onValueChange={onCategoryChange} className="w-full">
          <TabsList className="w-full grid gap-1" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(100px, 1fr))` }}>
            {categories.map((category) => (
              <div key={category} className="relative group">
                <TabsTrigger value={category} className="text-xs sm:text-sm">
                  {category}
                </TabsTrigger>
                {categories.length > 1 && (
                  <button
                    onClick={() => {
                      onRemoveCategory(category)
                      if (currentCategory === category && categories.length > 1) {
                        onCategoryChange(categories[0] === category ? categories[1] : categories[0])
                      }
                    }}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 bg-destructive text-destructive-foreground rounded-full p-0.5" />
                  </button>
                )}
              </div>
            ))}
          </TabsList>
        </Tabs>
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No categories yet. Add one to get started!
        </div>
      )}
    </div>
  )
}

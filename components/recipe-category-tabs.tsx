"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RecipeCategoryTabsProps {
  currentCategory: string
  onCategoryChange: (category: string) => void
}

export function RecipeCategoryTabs({ currentCategory, onCategoryChange }: RecipeCategoryTabsProps) {
  return (
    <Tabs value={currentCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

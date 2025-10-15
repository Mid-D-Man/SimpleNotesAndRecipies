"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecipeStepCard } from "@/components/recipe-step-card"

interface RecipeStep {
  id: string
  title: string
  content: string
}

interface RecipeStepsSectionProps {
  steps: RecipeStep[]
  category: string
  onAddStep: () => void
  onUpdateStep: (id: string, title: string, content: string) => void
  onDeleteStep: (id: string) => void
}

export function RecipeStepsSection({
  steps,
  category,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
}: RecipeStepsSectionProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>
          <Button size="sm" variant="default" onClick={onAddStep} className="h-8 gap-1">
            <Plus className="w-4 h-4" />
            Add Step
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-8 space-y-3">
        {steps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No steps yet.</p>
            <p className="text-sm text-muted-foreground">Click "Add Step" to get started!</p>
          </div>
        ) : (
          steps.map((step, index) => (
            <RecipeStepCard
              key={step.id}
              stepNumber={index + 1}
              title={step.title}
              content={step.content}
              onUpdate={(title, content) => onUpdateStep(step.id, title, content)}
              onDelete={() => onDeleteStep(step.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

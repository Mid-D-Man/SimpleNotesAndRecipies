"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface RecipeStepProps {
  stepNumber: number
  title: string
  content: string
  onUpdate: (title: string, content: string) => void
  onDelete: () => void
}

export function RecipeStep({ stepNumber, title, content, onUpdate, onDelete }: RecipeStepProps) {
  const [localTitle, setLocalTitle] = useState(title)
  const [localContent, setLocalContent] = useState(content)

  return (
    <Card className="p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-medium text-muted-foreground">Step {stepNumber}</span>
          <Input
            value={localTitle}
            onChange={(e) => {
              setLocalTitle(e.target.value)
              onUpdate(e.target.value, localContent)
            }}
            placeholder="Step title..."
            className="flex-1 h-8 text-sm"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1" onClick={onDelete}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Textarea
        value={localContent}
        onChange={(e) => {
          setLocalContent(e.target.value)
          onUpdate(localTitle, e.target.value)
        }}
        placeholder="Describe this step..."
        className="min-h-[80px] text-sm"
      />
    </Card>
  )
}

interface RecipeStepsProps {
  steps: Array<{ id: string; title: string; content: string }>
  onAddStep: () => void
  onUpdateStep: (id: string, title: string, content: string) => void
  onDeleteStep: (id: string) => void
}

export function RecipeSteps({ steps, onAddStep, onUpdateStep, onDeleteStep }: RecipeStepsProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Recipe Steps</h3>
        <Button size="sm" variant="outline" onClick={onAddStep} className="h-8 gap-1 bg-transparent">
          <Plus className="w-3 h-3" />
          Add Step
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {steps.map((step, index) => (
          <RecipeStep
            key={step.id}
            stepNumber={index + 1}
            title={step.title}
            content={step.content}
            onUpdate={(title, content) => onUpdateStep(step.id, title, content)}
            onDelete={() => onDeleteStep(step.id)}
          />
        ))}
      </div>
    </div>
  )
}

"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface NoteColorSelectorProps {
  currentColor?: string
  onColorChange: (color: string) => void
}

const noteColors = [
  { name: "White", value: "bg-white", border: "border-gray-200", textHint: "text-gray-900" },
  { name: "Cream", value: "bg-amber-50", border: "border-amber-100", textHint: "text-amber-900" },
  { name: "Blue", value: "bg-blue-50", border: "border-blue-100", textHint: "text-blue-900" },
  { name: "Green", value: "bg-green-50", border: "border-green-100", textHint: "text-green-900" },
  { name: "Rose", value: "bg-rose-50", border: "border-rose-100", textHint: "text-rose-900" },
  { name: "Purple", value: "bg-purple-50", border: "border-purple-100", textHint: "text-purple-900" },
  { name: "Slate", value: "bg-slate-100", border: "border-slate-200", textHint: "text-slate-900" },
  { name: "Indigo", value: "bg-indigo-50", border: "border-indigo-100", textHint: "text-indigo-900" },
]

export function NoteColorSelector({ currentColor = "bg-white", onColorChange }: NoteColorSelectorProps) {
  return (
    <div className="border-t border-border pt-4 mt-6">
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Note Color</p>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {noteColors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={cn(
              "relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110",
              color.value,
              color.border,
              currentColor === color.value ? "ring-2 ring-primary" : ""
            )}
            title={color.name}
          >
            {currentColor === color.value && (
              <Check className={cn("w-4 h-4 absolute inset-1/4", color.textHint)} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

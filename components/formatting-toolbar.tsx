"use client"

import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FormattingToolbarProps {
  onFormat: (format: string) => void
}

const colors = [
  { name: "Default", value: "#000000" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Green", value: "#22C55E" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#A855F7" },
]

export function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  return (
    <footer className="h-[15vh] min-h-[80px] max-h-[120px] border-t border-border bg-card px-4 py-3 overflow-x-auto">
      <div className="flex items-center gap-1 h-full">
        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("bold")}>
          <Bold className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("italic")}>
          <Italic className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("underline")}>
          <Underline className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1" />

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("bulletList")}>
          <List className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("orderedList")}>
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1" />

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("alignLeft")}>
          <AlignLeft className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("alignCenter")}>
          <AlignCenter className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={() => onFormat("alignRight")}>
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className="w-8 h-8 rounded-md border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => onFormat(`color:${color.value}`)}
                  title={color.name}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </footer>
  )
}

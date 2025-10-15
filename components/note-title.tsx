"use client"

import { Input } from "@/components/ui/input"

interface NoteTitleProps {
  value: string
  onChange: (value: string) => void
}

export function NoteTitle({ value, onChange }: NoteTitleProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-2xl font-medium border-none px-0 mb-6 focus-visible:ring-0"
      placeholder="Note title..."
    />
  )
}

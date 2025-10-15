"use client"

import { useRef, useEffect } from "react"

interface NoteContentProps {
  value: string
  onChange: (value: string) => void
}

export function NoteContent({ value, onChange }: NoteContentProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      // Auto-resize textarea
      contentRef.current.style.height = "auto"
      contentRef.current.style.height = contentRef.current.scrollHeight + "px"
    }
  }, [value])

  return (
    <textarea
      ref={contentRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[400px] outline-none notebook-lines pt-2 pb-8 text-foreground leading-8 resize-none bg-transparent border-none"
      style={{
        paddingLeft: "0",
        lineHeight: "32px",
      }}
      placeholder="Start typing..."
    />
  )
}

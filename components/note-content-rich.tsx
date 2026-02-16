"use client"

import { useRef, useEffect } from "react"

interface NoteContentRichProps {
  value: string
  onChange: (value: string) => void
}

export function NoteContentRich({ value, onChange }: NoteContentRichProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const initialLoadRef = useRef(true)

  useEffect(() => {
    if (contentRef.current && initialLoadRef.current && value) {
      contentRef.current.innerHTML = value
      initialLoadRef.current = false
    }
  }, [value])

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML)
    }
  }

  return (
    <div
      ref={contentRef}
      onInput={handleInput}
      contentEditable
      suppressContentEditableWarning
      className="w-full min-h-[400px] outline-none notebook-lines pt-2 pb-8 text-foreground leading-8 bg-transparent border-none focus:outline-none"
      style={{
        paddingLeft: "0",
        lineHeight: "32px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
      data-placeholder="Start typing..."
    />
  )
}

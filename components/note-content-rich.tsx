"use client"

import { useRef, useEffect, useState } from "react"

interface NoteContentRichProps {
  value: string
  onChange: (value: string) => void
}

export function NoteContentRich({ value, onChange }: NoteContentRichProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  // Only hydrate on client side to prevent mismatch
  useEffect(() => {
    setIsClient(true)
    if (contentRef.current && value) {
      contentRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML)
    }
  }

  // During SSR, render empty; content will be populated on client
  if (!isClient) {
    return (
      <div
        className="w-full min-h-[400px] outline-none notebook-lines pt-2 pb-8 text-foreground leading-8 bg-transparent border-none focus:outline-none"
        style={{
          paddingLeft: "0",
          lineHeight: "32px",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      />
    )
  }

  return (
    <div
      ref={contentRef}
      onInput={handleInput}
      contentEditable
      suppressContentEditableWarning
      suppressHydrationWarning
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

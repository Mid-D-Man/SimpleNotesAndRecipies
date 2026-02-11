"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Wand2, Copy, MessageSquare } from "lucide-react"

interface AITextMenuProps {
  selectedText: string
  position: { x: number; y: number }
  onClose: () => void
  onEnhance: (text: string) => Promise<string>
  onAsk: (text: string) => Promise<string>
  onExtract: (text: string) => Promise<string>
  onInsert: (text: string) => void
  userId: string
}

export function AITextMenu({
  selectedText,
  position,
  onClose,
  onEnhance,
  onAsk,
  onExtract,
  onInsert,
  userId,
}: AITextMenuProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleEnhance = async () => {
    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use AI features",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await onEnhance(selectedText)
      onInsert(result)
      toast({
        title: "Text enhanced",
        description: "Your text has been improved",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "Failed to enhance text",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAsk = async () => {
    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use AI features",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await onAsk(selectedText)
      // Create a new note with the Q&A
      onInsert(`**Q&A about your text:**\n\n${result}`)
      toast({
        title: "Question answered",
        description: "A new note has been created with the answer",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to answer question",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExtract = async () => {
    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use AI features",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await onExtract(selectedText)
      onInsert(result)
      toast({
        title: "Summary created",
        description: "A new note with the summary has been created",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to extract summary",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed z-50 bg-background border border-border rounded-lg shadow-lg p-2 flex gap-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEnhance}
        disabled={loading}
        title="Enhance text clarity and grammar"
      >
        <Wand2 className="w-4 h-4 mr-1" />
        Enhance
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleAsk}
        disabled={loading}
        title="Ask questions about the text"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        Ask
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleExtract}
        disabled={loading}
        title="Extract key points"
      >
        <Copy className="w-4 h-4 mr-1" />
        Extract
      </Button>
    </div>
  )
}

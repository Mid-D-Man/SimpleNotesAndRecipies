"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles } from "lucide-react"

interface AINote {
  title: string
  content: string
}

interface AINoteCreatorProps {
  onNoteCreated: (note: AINote) => void
}

export function AINoteCreator({ onNoteCreated }: AINoteCreatorProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerateNote = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter what you'd like to create a note about",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai-create-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate note")
      }

      const data = await response.json()
      
      if (data.note) {
        onNoteCreated(data.note)
        setPrompt("")
        toast({
          title: "Note created",
          description: "Your AI-generated note has been created!",
        })
      }
    } catch (error) {
      console.error("[v0] Note creation error:", error)
      toast({
        title: "Failed to create note",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault()
      handleGenerateNote()
    }
  }

  return (
    <Card className="p-6 border-dashed border-2 border-primary/30 bg-primary/5">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Create with AI</h3>
        </div>
        
        <Input
          placeholder="Describe what note you'd like to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="text-sm"
        />
        
        <Button
          onClick={handleGenerateNote}
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Generating..." : "Generate Note"}
        </Button>
      </div>
    </Card>
  )
}

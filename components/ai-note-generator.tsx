"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AINoteGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (content: string) => void
  userId: string
}

export function AINoteGenerator({ open, onOpenChange, onGenerate, userId }: AINoteGeneratorProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use AI features",
        variant: "destructive",
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe what note you want to create",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai/generate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prompt }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate note")
      }

      const data = await response.json()
      onGenerate(data.content)
      setPrompt("")
      onOpenChange(false)

      toast({
        title: "Note generated",
        description: `Created note using ${data.tokensUsed} tokens`,
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate note",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Generate Note with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want your note to be about, and our AI will create it for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your prompt</label>
            <Textarea
              placeholder="E.g., 'Create a weekly planning template for project management' or 'Write meeting notes from our 2pm standup'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="min-h-[150px]"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Generating..." : "Generate Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

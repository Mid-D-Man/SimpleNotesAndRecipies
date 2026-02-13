"use client"

import { useState } from "react"
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Suggestion {
  title: string
  description: string
}

interface AISuggestionsProps {
  content: string
  type: "note" | "todo"
  onApplySuggestion?: (suggestion: Suggestion) => void
}

export function AISuggestions({ content, type, onApplySuggestion }: AISuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetSuggestions = async () => {
    if (!content.trim()) {
      setError("Please add some content first")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const response = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[v0] AI suggestions API error:', { status: response.status, errorData })
        throw new Error(errorData?.error || "Failed to get suggestions")
      }

      const data = await response.json()
      console.log('[v0] AI suggestions response:', data)
      setSuggestions(data.suggestions || [])
      setIsExpanded(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Could not generate suggestions"
      setError(errorMsg)
      console.error("[v0] Suggestion error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="space-y-3">
        <Button
          onClick={handleGetSuggestions}
          disabled={isLoading}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? "Generating..." : "AI Suggestions"}
        </Button>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
            </button>

            {isExpanded && (
              <div className="space-y-2 bg-secondary/50 rounded-lg p-3">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-primary/50 pl-3 py-2">
                    <p className="font-medium text-foreground">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                    {onApplySuggestion && (
                      <Button
                        onClick={() => onApplySuggestion(suggestion)}
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                      >
                        Apply
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

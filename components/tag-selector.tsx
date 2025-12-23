'use client'

import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TagSelectorProps {
  selectedTags: string[]
  availableTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

export function TagSelector({
  selectedTags,
  availableTags,
  onAddTag,
  onRemoveTag,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag))
  const filteredTags = unselectedTags.filter(tag =>
    tag.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedTags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
        >
          {tag}
          <button
            onClick={() => onRemoveTag(tag)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-7 gap-1 text-xs"
        >
          Add Tag
          <ChevronDown className="w-3 h-3" />
        </Button>

        {isOpen && (
          <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-md z-50 min-w-max">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3 py-2 text-xs border-b border-border bg-card rounded-t-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="max-h-40 overflow-y-auto">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onAddTag(tag)
                      setIsOpen(false)
                      setSearchInput('')
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors"
                  >
                    {tag}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No tags available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

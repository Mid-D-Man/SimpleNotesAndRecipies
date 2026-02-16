"use client"

export interface Note {
  id: string
  title: string
  content: string
  preview: string
  lastModified: string
  isBookmarked: boolean
  type: "regular" | "todo"
  tags: string[]
  backgroundColor?: string
  steps?: Array<{ id: string; title: string; content: string }>
  notes?: Array<{ id: string; category: string; content: string }>
}

export interface Tag {
  name: string
  type: "note" | "todo"
}

const NOTES_KEY = "notes_app_data"
const USER_KEY = "notes_app_user"
const TAGS_KEY = "notes_app_tags"

export const storage = {
  getNotes: (): Note[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(NOTES_KEY)
    return data ? JSON.parse(data) : []
  },

  saveNotes: (notes: Note[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  },

  addNote: (note: Note) => {
    const notes = storage.getNotes()
    notes.push(note)
    storage.saveNotes(notes)
  },

  updateNote: (id: string, updates: Partial<Note>) => {
    const notes = storage.getNotes()
    const index = notes.findIndex((n) => n.id === id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, lastModified: new Date().toISOString() }
      storage.saveNotes(notes)
    }
  },

  deleteNote: (id: string) => {
    const notes = storage.getNotes()
    storage.saveNotes(notes.filter((n) => n.id !== id))
  },

  getTags: (type: "note" | "todo"): string[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(TAGS_KEY)
    const tags = data ? JSON.parse(data) : []
    return tags.filter((t: Tag) => t.type === type).map((t: Tag) => t.name)
  },

  addTag: (name: string, type: "note" | "todo") => {
    if (typeof window === "undefined") return
    const tags = localStorage.getItem(TAGS_KEY)
    const tagsList = tags ? JSON.parse(tags) : []
    if (!tagsList.some((t: Tag) => t.name === name && t.type === type)) {
      tagsList.push({ name, type })
      localStorage.setItem(TAGS_KEY, JSON.stringify(tagsList))
    }
  },

  removeTag: (name: string, type: "note" | "todo") => {
    if (typeof window === "undefined") return
    const tags = localStorage.getItem(TAGS_KEY)
    const tagsList = tags ? JSON.parse(tags) : []
    const filtered = tagsList.filter((t: Tag) => !(t.name === name && t.type === type))
    localStorage.setItem(TAGS_KEY, JSON.stringify(filtered))
  },

  getUser: () => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  },

  saveUser: (user: { email: string; name: string }) => {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearUser: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(USER_KEY)
  },

  syncToCloud: async (notes: Note[]) => {
    // Placeholder for cloud sync functionality
    // In a real app, this would send data to a backend API
    console.log("Syncing to cloud:", notes)
    return new Promise((resolve) => setTimeout(resolve, 1000))
  },
}

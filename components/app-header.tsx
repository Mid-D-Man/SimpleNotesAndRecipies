"use client"

import { Menu, LogIn, UserPlus, Cloud, LogOut, User } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AuthDialog } from "@/components/auth-dialog"
import { storage } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function AppHeader() {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setUser(storage.getUser())
  }, [])

  const handleSync = async () => {
    if (!user) {
      setAuthOpen(true)
      return
    }

    toast({
      title: "Syncing...",
      description: "Uploading your notes to the cloud",
    })

    const notes = storage.getNotes()
    await storage.syncToCloud(notes)

    toast({
      title: "Synced successfully",
      description: "Your notes are backed up to the cloud",
    })
  }

  const handleLogout = () => {
    storage.clearUser()
    setUser(null)
    setOpen(false)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <>
      <header className="h-[15vh] min-h-[80px] max-h-[120px] border-b border-border bg-card px-4 flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {user ? (
                <>
                  <div className="px-3 py-2 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="ghost" className="justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setOpen(false)
                      setAuthOpen(true)
                    }}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => {
                      setOpen(false)
                      setAuthOpen(true)
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-serif text-foreground">My Notes</h1>

        <Button variant="ghost" size="icon" className="text-foreground" onClick={handleSync}>
          <Cloud className="w-5 h-5" />
          <span className="sr-only">Store in cloud</span>
        </Button>
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => setUser(storage.getUser())} />
    </>
  )
}

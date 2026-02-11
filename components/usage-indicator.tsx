"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"

interface UsageIndicatorProps {
  userId: string
  onUpgradeClick?: () => void
}

export function UsageIndicator({ userId, onUpgradeClick }: UsageIndicatorProps) {
  const [usage, setUsage] = useState<{
    used: number
    limit: number
    percentage: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/user/usage?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
    // Refresh every 5 minutes
    const interval = setInterval(fetchUsage, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId])

  if (loading || !usage) return null

  const isCritical = usage.percentage >= 80
  const isExceeded = usage.percentage >= 100

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${isCritical ? "text-red-500" : "text-amber-500"}`} />
          <span className="font-medium">AI Usage</span>
        </div>
        <span className="text-sm font-medium">
          {Math.round(usage.percentage)}%
        </span>
      </div>

      <Progress value={Math.min(usage.percentage, 100)} className="h-2" />

      <div className="text-xs text-muted-foreground">
        {usage.used.toLocaleString()} / {usage.limit.toLocaleString()} tokens used this month
      </div>

      {isExceeded && (
        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
          <p className="text-sm font-medium text-red-700 dark:text-red-200 mb-2">
            Monthly limit reached
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onUpgradeClick}
            className="w-full"
          >
            Upgrade to Pro
          </Button>
        </div>
      )}

      {isCritical && !isExceeded && (
        <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-200 mb-2">
            Nearing your monthly limit
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onUpgradeClick}
            className="w-full"
          >
            Upgrade to Pro
          </Button>
        </div>
      )}
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, RefreshCw, Globe } from "lucide-react"

interface DashboardHeaderProps {
  onRefresh: () => void
  loading: boolean
}

export function DashboardHeader({ onRefresh, loading }: DashboardHeaderProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time insights and performance metrics</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              Live Data
            </Badge>
            <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

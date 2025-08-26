"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface SubscriptionsFiltersProps {
  selectedStatus: string
  selectedUserType: string
  selectedTime: string
  onStatusChange: (value: string) => void
  onUserTypeChange: (value: string) => void
  onTimeChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function SubscriptionsFilters({
  selectedStatus,
  selectedUserType,
  selectedTime,
  onStatusChange,
  onUserTypeChange,
  onTimeChange,
  onClearFilters,
  hasActiveFilters,
}: SubscriptionsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Status:</span>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">User Type:</span>
        <Select value={selectedUserType} onValueChange={onUserTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="super">Super</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Time:</span>
        <Select value={selectedTime} onValueChange={onTimeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Month</SelectItem>
            <SelectItem value="3">3 Months</SelectItem>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="9">9 Months</SelectItem>
            <SelectItem value="12">12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            Filters Active
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={onClearFilters}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  )
}

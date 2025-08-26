"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

interface TrendsFiltersProps {
  selectedState: string
  onStateChange: (state: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];


export function TrendsFilters({ selectedState, onStateChange, onClearFilters, hasActiveFilters }: TrendsFiltersProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">Trends Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              1 active
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">State:</label>
            <Select value={selectedState} onValueChange={onStateChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-1 bg-transparent"
            >
              <X className="h-3 w-3" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        View month-wise subscription distribution trends for {new Date().getFullYear()}
        {selectedState !== "all" && ` in ${selectedState}`}
      </div>
    </div>
  )
}

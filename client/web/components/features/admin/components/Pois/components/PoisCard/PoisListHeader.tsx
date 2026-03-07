"use client"

import { Plus, MapPin, Star, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { POIFilterCategory, POIStats } from "@/components/features/admin/components/Pois/hooks/usePois"
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

interface POIListHeaderProps {
  stats: POIStats
  filterCategory: POIFilterCategory
  onFilterChange: (filter: POIFilterCategory) => void
  onCreateClick: () => void
}

export function PoisListHeader({
  stats,
  filterCategory,
  onFilterChange,
  onCreateClick,
}: POIListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Points of Interest</h1>
          <p className="text-xs text-muted-foreground">
            Manage locations for your tours
          </p>
        </div>
        <Button size="sm" onClick={onCreateClick}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add POI
        </Button>
      </div>

      <Tabs
        value={filterCategory}
        onValueChange={(v) => onFilterChange(v as POIFilterCategory)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="gap-1.5 text-xs">
            <MapPin className="h-3.5 w-3.5" />
            All
            <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] font-medium">
              {stats.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="major" className="gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5" />
            Major
            <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] font-medium">
              {stats.major}
            </span>
          </TabsTrigger>
          <TabsTrigger value="minor" className="gap-1.5 text-xs">
            <Tag className="h-3.5 w-3.5" />
            Minor
            <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px] font-medium">
              {stats.minor}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

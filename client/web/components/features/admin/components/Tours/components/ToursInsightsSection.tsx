"use client"

import { Compass } from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { ToursGrowthChart } from "./ToursGrowthChart"
import { TourRoutePreviewMap } from "./TourRoutePreviewMap"

interface ToursInsightsSectionProps {
  tour: Tour | null
  allPois: POI[]
  tourCount: number
}

/** Khối biểu đồ tăng trưởng + bản đồ lộ trình POI — đặt giữa danh sách tour và thống kê. */
export function ToursInsightsSection({ tour, allPois, tourCount }: ToursInsightsSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Phân tích & lộ trình</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">Tổng quan theo danh sách hiện tại</span>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ToursGrowthChart tourCount={tourCount} />
        <TourRoutePreviewMap tour={tour} allPois={allPois} />
      </div>
    </div>
  )
}

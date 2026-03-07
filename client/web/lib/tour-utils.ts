import type { Tour, POI, TourPOI } from "@/lib/types"

export const SUB_CATEGORY_LABELS: Record<string, string> = {
  wc: "Restroom",
  ticket: "Ticket Booth",
  parking: "Parking",
  dock: "Dock",
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

export function sortTourPois(pois: TourPOI[]): TourPOI[] {
  return [...pois].sort((a, b) => a.order - b.order)
}

export function countMajorPois(tour: Tour, allPois: POI[]): number {
  return tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "major"
  }).length
}

export function countMinorPois(tour: Tour, allPois: POI[]): number {
  return tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "minor"
  }).length
}

export function getSubCategoryLabel(subCategory: string | undefined): string {
  if (!subCategory) return "Minor"
  return SUB_CATEGORY_LABELS[subCategory] ?? subCategory
}

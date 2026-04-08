import type { POI, POICategory } from "@/lib/types"

export const SUB_CATEGORY_LABELS: Record<string, string> = {
  wc: "Restroom",
  ticket: "Ticket Booth",
  parking: "Parking",
  dock: "Dock",
}

export const SUB_CATEGORY_ICONS: Record<string, string> = {
  wc: "Bath",
  ticket: "Ticket",
  parking: "Car",
  dock: "Ship",
}

export function getSubCategoryLabel(subCategory: string | undefined): string {
  if (!subCategory) return "Điểm phụ"
  return SUB_CATEGORY_LABELS[subCategory] ?? subCategory
}

export function formatCoordinates(lat: number, lng: number, precision = 4): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`
}

export function formatCoordinatesFull(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

export function filterPoisBySearch(pois: POI[], search: string): POI[] {
  if (!search.trim()) return pois
  const q = search.toLowerCase()
  return pois.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
  )
}

export function filterPoisByCategory(pois: POI[], category: POICategory | "all"): POI[] {
  if (category === "all") return pois
  return pois.filter((p) => p.category === category)
}

export function countByCategory(pois: POI[]): { major: number; minor: number } {
  return {
    major: pois.filter((p) => p.category === "major").length,
    minor: pois.filter((p) => p.category === "minor").length,
  }
}

export function sortPoisByName(pois: POI[]): POI[] {
  return [...pois].sort((a, b) => a.name.localeCompare(b.name))
}

export function sortPoisByDate(pois: POI[], direction: "asc" | "desc" = "desc"): POI[] {
  return [...pois].sort((a, b) => {
    const diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    return direction === "desc" ? diff : -diff
  })
}

import type { POI, POICategory } from "@/src/types/poi"

export const SUB_CATEGORY_LABELS: Record<string, string> = {
  wc: "Restroom",
  ticket: "Ticket Booth",
  parking: "Parking",
  dock: "Dock",
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
      p.description.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q))
  )
}

export function filterPoisByCategory(
  pois: POI[],
  category: POICategory | "all"
): POI[] {
  if (category === "all") return pois
  return pois.filter((p) => p.category === category)
}

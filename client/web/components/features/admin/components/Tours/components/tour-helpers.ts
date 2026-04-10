import type { Tour, POI } from "@/lib/types"
import { sortTourPois } from "@/lib/utils"

/** Ảnh bìa tour: `coverImage` nếu có, không thì ảnh đầu tiên của POI theo thứ tự lộ trình. */
export function getTourCoverImage(tour: Tour, allPois: POI[]): string | undefined {
  if (tour.coverImage) return tour.coverImage
  for (const tp of sortTourPois(tour.pois)) {
    const p = allPois.find((x) => x.id === tp.poiId)
    if (p?.imageUrl) return p.imageUrl
  }
  return undefined
}

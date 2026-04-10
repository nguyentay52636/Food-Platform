import type { LanguageCode } from "./client-types"

/** Hiển thị `estimatedDuration` (phút) theo ngôn ngữ giao diện. */
export function formatClientTourDuration(minutes: number, language: LanguageCode): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (language === "vi") {
    return hours > 0 ? `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`.trim() : `${mins} phút`
  }
  return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim() : `${mins}m`
}

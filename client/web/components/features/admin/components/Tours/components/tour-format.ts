import type { Tour } from "@/lib/types"

export function formatVnd(amount: number) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })
}

function hashTourId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Mock: ước lượng thời gian (phút), ổn định theo id tour + số POI — chỉ để hiển thị UI. */
export function getMockTourDurationMinutes(tour: Tour): number {
  const n = tour.pois.length
  const base = 20 + n * 25
  const jitter = hashTourId(tour.id) % 90
  return Math.min(480, Math.max(30, base + jitter))
}

/** Thời lượng hiển thị: dùng giá trị đã lưu trên tour, không có thì fallback mock. */
export function getTourDurationMinutes(tour: Tour): number {
  if (
    typeof tour.estimatedDurationMinutes === "number" &&
    Number.isFinite(tour.estimatedDurationMinutes) &&
    tour.estimatedDurationMinutes > 0
  ) {
    return Math.min(24 * 60, Math.max(1, Math.round(tour.estimatedDurationMinutes)))
  }
  return getMockTourDurationMinutes(tour)
}

/** Hiển thị thời lượng tiếng Việt, có tiền tố ~ */
export function formatTourDurationVi(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `~${m} phút`
  if (m === 0) return `~${h} giờ`
  return `~${h} giờ ${m} phút`
}

export function formatTourDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getTourRelativeTime(dateStr: string) {
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

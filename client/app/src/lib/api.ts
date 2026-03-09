import type {
  POI,
  CreatePOIPayload,
  UpdatePOIPayload,
} from "@/src/types/poi"

// Mock data - replace with real API when backend is ready
const MOCK_POIS: POI[] = [
  {
    id: "poi-1",
    name: "Cầu Rồng",
    description: "Cầu Rồng bắc qua sông Hàn, biểu tượng của Đà Nẵng. Cuối tuần có biểu diễn phun lửa và phun nước.",
    category: "major",
    latitude: 16.0611,
    longitude: 108.2278,
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "poi-2",
    name: "Ngũ Hành Sơn",
    description: "Cụm năm ngọn núi đá vôi với hang động, chùa chiền và cảnh quan thiên nhiên.",
    category: "major",
    latitude: 16.0034,
    longitude: 108.2634,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
  },
  {
    id: "poi-3",
    name: "Bãi biển Mỹ Khê",
    description: "Bãi biển nổi tiếng với cát trắng, nước trong xanh, lý tưởng cho tắm biển và lướt sóng.",
    category: "major",
    latitude: 16.0544,
    longitude: 108.2478,
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
  },
  {
    id: "poi-4",
    name: "Quầy vé Ngũ Hành Sơn",
    description: "Quầy bán vé chính tại cổng vào khu du lịch Ngũ Hành Sơn.",
    category: "minor",
    subCategory: "ticket",
    latitude: 16.0038,
    longitude: 108.2638,
    createdAt: "2025-01-17T11:00:00Z",
    updatedAt: "2025-01-17T11:00:00Z",
  },
  {
    id: "poi-5",
    name: "Bãi đỗ xe Mỹ Khê",
    description: "Bãi giữ xe công cộng gần bãi biển Mỹ Khê, sức chứa khoảng 200 xe.",
    category: "minor",
    subCategory: "parking",
    latitude: 16.055,
    longitude: 108.2485,
    createdAt: "2025-01-18T12:00:00Z",
    updatedAt: "2025-01-18T12:00:00Z",
  },
  {
    id: "poi-6",
    name: "Nhà vệ sinh công cộng - Cầu Rồng",
    description: "Nhà vệ sinh công cộng gần đầu cầu phía tây Cầu Rồng.",
    category: "minor",
    subCategory: "wc",
    latitude: 16.0615,
    longitude: 108.228,
    createdAt: "2025-01-19T13:00:00Z",
    updatedAt: "2025-01-19T13:00:00Z",
  },
  {
    id: "poi-7",
    name: "Bến du thuyền sông Hàn",
    description: "Bến thuyền du ngoạn sông Hàn, có tour ngắm hoàng hôn trên sông.",
    category: "minor",
    subCategory: "dock",
    latitude: 16.0605,
    longitude: 108.225,
    createdAt: "2025-01-20T14:00:00Z",
    updatedAt: "2025-01-20T14:00:00Z",
  },
]

let pois: POI[] = [...MOCK_POIS]
const PAGE_SIZE = 10
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function fetchPOIs(options?: {
  page?: number
  limit?: number
  search?: string
  category?: "all" | "major" | "minor"
}): Promise<{ data: POI[]; hasMore: boolean }> {
  await delay()
  const page = options?.page ?? 1
  const limit = options?.limit ?? PAGE_SIZE
  const search = (options?.search ?? "").trim().toLowerCase()
  const category = options?.category ?? "all"

  let filtered = pois
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(search))
    )
  }
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category)
  }

  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)
  const hasMore = start + data.length < filtered.length

  return { data, hasMore }
}

export async function fetchPOI(id: string): Promise<POI> {
  await delay(200)
  const poi = pois.find((p) => p.id === id)
  if (!poi) throw new Error("POI not found")
  return { ...poi }
}

export async function createPOI(payload: CreatePOIPayload): Promise<POI> {
  await delay(500)
  const now = new Date().toISOString()
  const newPoi: POI = {
    id: "poi-" + Date.now(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  }
  pois = [...pois, newPoi]
  return newPoi
}

export async function updatePOI(id: string, payload: UpdatePOIPayload): Promise<POI> {
  await delay(500)
  const idx = pois.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error("POI not found")
  const updated: POI = {
    ...pois[idx],
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  pois = pois.map((p) => (p.id === id ? updated : p))
  return updated
}

export async function deletePOI(id: string): Promise<void> {
  await delay(400)
  const idx = pois.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error("POI not found")
  pois = pois.filter((p) => p.id !== id)
}

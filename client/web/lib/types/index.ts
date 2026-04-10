// POI Types
export type POICategory = "major" | "minor"
export type MinorSubCategory = "wc" | "ticket" | "parking" | "dock"

export interface POI {
  id: string
  name: string
  description: string
  category: POICategory
  subCategory?: MinorSubCategory
  latitude: number
  longitude: number
  imageUrl?: string
  audioUrl?: string
  images?: string[]
  rangeTrigger?: number
  narrationLanguages?: string[]
  ownerId?: string
  address?: string
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreatePOIPayload {
  name: string
  description: string
  category: POICategory
  subCategory?: MinorSubCategory
  latitude: number
  longitude: number
  imageUrl?: string
  audioUrl?: string
  images?: string[]
  rangeTrigger?: number
  narrationLanguages?: string[]
  ownerId?: string
  address?: string
}

export type UpdatePOIPayload = Partial<CreatePOIPayload>

// Tour Types
export interface TourPOI {
  poiId: string
  order: number
}

export interface Tour {
  id: string
  name: string
  description: string
  pois: TourPOI[]
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
  /** Ảnh bìa tour (URL). Nếu thiếu, UI có thể fallback ảnh POI. */
  coverImage?: string
  /** Thời lượng ước tính (phút). */
  estimatedDurationMinutes?: number
}

export interface CreateTourPayload {
  name: string
  description: string
  pois: TourPOI[]
  status?: "draft" | "published"
  coverImage?: string
  estimatedDurationMinutes?: number
}

export type UpdateTourPayload = Partial<CreateTourPayload>

// Auth Types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin"
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: AdminUser
  token: string
}

// Restaurant Types for Maps
export interface IRestaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  reviews: number
  address: string
  phone: string
  hours: string
  priceRange: string
  lat: number
  lng: number
  isLive: boolean
  image: string
}

// ────────────────────────────────────────────────────────────────
// Owner (chủ quán) & Reviews (đánh giá người dùng) - dùng cho UI demo
// ────────────────────────────────────────────────────────────────

export interface OwnerUser {
  id: string
  name: string
  username: string
  password: string
  role: "owner"
  // POIs mà owner được admin gán để owner chỉ có thể xem
  poiIds: string[]
}

export interface Review {
  id: string
  poiId: string
  userName: string
  rating: number
  content?: string
  createdAt: string // ISO string
}

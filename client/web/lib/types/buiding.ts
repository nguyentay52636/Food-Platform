// =====================
// COMMON
// =====================
export type ID = string

export interface BaseEntity {
  id: ID
  createdAt: string
  updatedAt: string
}

// =====================
// AUTH & USER
// =====================
export interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
  role: "admin" | "user"
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// =====================
// POI (LOCATION / FOOD)
// =====================
export type POICategory = "major" | "minor"
export type MinorSubCategory = "wc" | "ticket" | "parking" | "dock"

export interface POI extends BaseEntity {
  name: string
  description: string

  category: POICategory
  subCategory?: MinorSubCategory

  latitude: number
  longitude: number

  address?: string
  imageUrl?: string

  rating: number
  reviewCount: number

  priceRange?: "$" | "$$" | "$$$"
  tags?: string[]

  isPremium?: boolean
}

// =====================
// REVIEW SYSTEM
// =====================
export interface Review extends BaseEntity {
  userId: ID
  poiId: ID

  rating: number
  content: string

  images?: string[]

  pros?: string[]
  cons?: string[]

  isVerified?: boolean
  likes?: number

  user?: User // populate FE
}

export interface CreateReviewPayload {
  poiId: ID
  rating: number
  content: string
  images?: string[]
}

export interface UpdateReviewPayload {
  rating?: number
  content?: string
  images?: string[]
}

// =====================
// REVIEW COMMENTS (REPLY)
// =====================
export interface ReviewComment extends BaseEntity {
  reviewId: ID
  userId: ID
  content: string

  user?: User
}

// =====================
// TOUR SYSTEM
// =====================
export interface TourPOI {
  poiId: ID
  order: number
}

export interface Tour extends BaseEntity {
  name: string
  description: string

  pois: TourPOI[]

  status: "draft" | "published"
}

export interface CreateTourPayload {
  name: string
  description: string
  pois: TourPOI[]
  status?: "draft" | "published"
}

export type UpdateTourPayload = Partial<CreateTourPayload>

// =====================
// WALLET & PAYMENT
// =====================
export interface Wallet {
  userId: ID
  balance: number
  currency: "VND"
}

export type TransactionType = "deposit" | "purchase" | "refund"

export interface Transaction extends BaseEntity {
  userId: ID
  amount: number
  type: TransactionType

  status: "pending" | "success" | "failed"

  description?: string
}

// =====================
// SUBSCRIPTION (PAY TO REVIEW)
// =====================
export interface Package extends BaseEntity {
  name: string
  price: number
  durationDays: number

  features: string[]
}

export interface Subscription extends BaseEntity {
  userId: ID
  packageId: ID

  startDate: string
  endDate: string

  status: "active" | "expired"
}

// =====================
// API RESPONSE WRAPPER
// =====================
export interface ApiResponse<T> {
  data: T
  message?: string
}

// =====================
// PAGINATION
// =====================
export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// =====================
// FILTER / SEARCH
// =====================
export interface POIFilter {
  keyword?: string
  category?: POICategory
  tags?: string[]
  priceRange?: "$" | "$$" | "$$$"

  lat?: number
  lng?: number
  radius?: number // meters
}
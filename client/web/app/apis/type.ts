 export interface IRestaurant {
    id: number
    name: string
    lat: number
    lng: number
    isLive: boolean
}


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
}

export interface CreateTourPayload {
  name: string
  description: string
  pois: TourPOI[]
  status?: "draft" | "published"
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

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
  address?: string
}

export type UpdatePOIPayload = Partial<CreatePOIPayload>

export type POIFilterCategory = POICategory | "all"

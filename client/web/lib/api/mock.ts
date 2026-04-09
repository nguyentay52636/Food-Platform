/**
 * Mock API implementation.
 * Swap this module for real API client (e.g. lib/api/client.ts) when backend is ready.
 */

import type {
  POI,
  Tour,
  CreatePOIPayload,
  UpdatePOIPayload,
  CreateTourPayload,
  UpdateTourPayload,
  LoginPayload,
  AuthResponse,
  OwnerUser,
  Review,
} from "@/lib/types"
import { MOCK_ADMIN, MOCK_OWNERS, MOCK_POIS, MOCK_REVIEWS, MOCK_TOURS } from "@/lib/mocks/data"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

let pois: POI[] = [...MOCK_POIS]
let tours: Tour[] = [...MOCK_TOURS]
let owners: OwnerUser[] = [...MOCK_OWNERS]

// ─── Auth ──────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await delay(600)
  if (payload.email === "admin@tourmanager.com" && payload.password === "admin123") {
    return {
      user: MOCK_ADMIN,
      token: "mock-jwt-token-" + Date.now(),
    }
  }
  throw new Error("Invalid email or password")
}

// ─── POIs ──────────────────────────────────────────

export async function fetchPOIs(): Promise<POI[]> {
  await delay()
  return [...pois]
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

  if (payload.ownerId) {
    owners = owners.map((o) =>
      o.id === payload.ownerId ? { ...o, poiIds: Array.from(new Set([...o.poiIds, newPoi.id])) } : o,
    )
  }
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
  owners = owners.map((o) => ({ ...o, poiIds: o.poiIds.filter((poiId) => poiId !== id) }))
}

// ─── Tours ─────────────────────────────────────────

export async function fetchTours(): Promise<Tour[]> {
  await delay()
  return [...tours]
}

export async function fetchTour(id: string): Promise<Tour> {
  await delay(200)
  const tour = tours.find((t) => t.id === id)
  if (!tour) throw new Error("Tour not found")
  return { ...tour }
}

export async function createTour(payload: CreateTourPayload): Promise<Tour> {
  await delay(500)
  const now = new Date().toISOString()
  const newTour: Tour = {
    id: "tour-" + Date.now(),
    name: payload.name,
    description: payload.description,
    pois: payload.pois,
    status: payload.status ?? "draft",
    createdAt: now,
    updatedAt: now,
  }
  tours = [...tours, newTour]
  return newTour
}

export async function updateTour(id: string, payload: UpdateTourPayload): Promise<Tour> {
  await delay(500)
  const idx = tours.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error("Tour not found")
  const updated: Tour = {
    ...tours[idx],
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  tours = tours.map((t) => (t.id === id ? updated : t))
  return updated
}

export async function deleteTour(id: string): Promise<void> {
  await delay(400)
  const idx = tours.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error("Tour not found")
  tours = tours.filter((t) => t.id !== id)
}

// ─── Owner (chủ quán) - UI demo ─────────────────────────────────────────────

function assertPoiBelongsToOwner(ownerId: string, poiId: string) {
  const owner = owners.find((o) => o.id === ownerId)
  if (!owner || !owner.poiIds.includes(poiId)) {
    throw new Error("Forbidden: POI does not belong to this owner")
  }
  return owner
}

export async function fetchOwnerPOIs(ownerId: string): Promise<POI[]> {
  await delay()
  const owner = owners.find((o) => o.id === ownerId)
  if (!owner) return []

  const allowed = new Set(owner.poiIds)
  return pois.filter((p) => allowed.has(p.id))
}

export async function updateOwnerPOI(
  ownerId: string,
  poiId: string,
  payload: UpdatePOIPayload,
): Promise<POI> {
  await delay(500)
  assertPoiBelongsToOwner(ownerId, poiId)

  const idx = pois.findIndex((p) => p.id === poiId)
  if (idx === -1) throw new Error("POI not found")

  const updated: POI = {
    ...pois[idx],
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
    updatedAt: new Date().toISOString(),
  }

  pois = pois.map((p) => (p.id === poiId ? updated : p))
  return updated
}

export async function fetchOwnerPOIReviews(
  ownerId: string,
  poiId: string,
  page = 1,
  limit = 10,
): Promise<{ data: Review[]; total: number }> {
  await delay()
  assertPoiBelongsToOwner(ownerId, poiId)

  const all = MOCK_REVIEWS
    .filter((r) => r.poiId === poiId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = all.length
  const data = all.slice((page - 1) * limit, page * limit)
  return { data, total }
}

// ─── Owners (chủ POI) - Admin demo ───────────────────────────────────────────

export async function fetchOwners(): Promise<OwnerUser[]> {
  await delay()
  return owners.map((o) => ({ ...o }))
}

export async function createOwner(payload: { username: string; password: string }): Promise<OwnerUser> {
  await delay(400)
  const username = payload.username.trim()
  if (!username) throw new Error("Username is required")

  const exists = owners.some((o) => o.username.toLowerCase() === username.toLowerCase())
  if (exists) throw new Error("Username already exists")

  const owner: OwnerUser = {
    id: "owner-" + Date.now(),
    name: username,
    username,
    password: payload.password,
    role: "owner",
    poiIds: [],
  }
  owners = [owner, ...owners]
  return { ...owner }
}

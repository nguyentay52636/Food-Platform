/**
 * Mock API service layer.
 * Mirrors real endpoint structure for easy backend swap later.
 * All functions return Promises to simulate async network calls.
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
  } from "@/app/apis/type"
  import { MOCK_ADMIN, MOCK_POIS, MOCK_TOURS } from "@/app/apis/mock-data"
  
  const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))
  
  // In-memory stores (mutable copies)
  let pois: POI[] = [...MOCK_POIS]
  let tours: Tour[] = [...MOCK_TOURS]
  
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
  

  
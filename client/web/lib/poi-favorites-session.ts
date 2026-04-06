"use client"

import { useSyncExternalStore } from "react"

const STORAGE_KEY = "food-platform-poi-favorites"

function parseIds(raw: string | null): string[] {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) return []
        return parsed.filter((x): x is string => typeof x === "string")
    } catch {
        return []
    }
}

let cacheSerialized: string | null = null
let cacheIds: string[] = []

export function getPoiFavoriteIds(): string[] {
    if (typeof window === "undefined") return []
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const serialized = raw ?? "[]"
    if (serialized === cacheSerialized) return cacheIds
    cacheSerialized = serialized
    cacheIds = parseIds(raw)
    return cacheIds
}

function setPoiFavoriteIds(ids: string[]): void {
    const serialized = JSON.stringify(ids)
    sessionStorage.setItem(STORAGE_KEY, serialized)
    cacheSerialized = serialized
    cacheIds = ids
    window.dispatchEvent(new Event("poi-favorites-changed"))
}

export function togglePoiFavorite(id: string): void {
    const current = getPoiFavoriteIds()
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    setPoiFavoriteIds(next)
}

function subscribe(onChange: () => void): () => void {
    const handler = () => onChange()
    window.addEventListener("storage", handler)
    window.addEventListener("poi-favorites-changed", handler)
    return () => {
        window.removeEventListener("storage", handler)
        window.removeEventListener("poi-favorites-changed", handler)
    }
}

function getServerSnapshot(): string[] {
    return []
}

export function usePoiFavoriteIds(): string[] {
    return useSyncExternalStore(subscribe, getPoiFavoriteIds, getServerSnapshot)
}

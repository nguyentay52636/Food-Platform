"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"
import type { POI, POICategory, CreatePOIPayload } from "@/lib/types"
import { fetchPOIs, createPOI, updatePOI, deletePOI } from "@/lib/api"
import { filterPoisBySearch, filterPoisByCategory, countByCategory } from "@/lib/poi-utils"

export type POIFilterCategory = POICategory | "all"

export interface POIStats {
  total: number
  major: number
  minor: number
}

export interface POIPickerState {
  isActive: boolean
  lat?: number
  lng?: number
}

export function usePOIs() {
  const [pois, setPois] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<POIFilterCategory>("all")

  const loadPOIs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchPOIs()
      setPois(data)
    } catch {
      toast.error("Failed to load POIs")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPOIs()
  }, [loadPOIs])

  const filteredPois = useMemo(() => {
    let result = filterPoisBySearch(pois, search)
    result = filterPoisByCategory(result, filterCategory)
    return result
  }, [pois, search, filterCategory])

  const stats = useMemo<POIStats>(() => {
    const counts = countByCategory(pois)
    return {
      total: pois.length,
      ...counts,
    }
  }, [pois])

  return {
    pois,
    isLoading,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    filteredPois,
    stats,
    loadPOIs,
  }
}

export function usePOISelection() {
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null)

  const selectPoi = useCallback((poi: POI | null) => {
    setSelectedPoi(poi)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedPoi(null)
  }, [])

  return {
    selectedPoi,
    selectPoi,
    clearSelection,
  }
}

export function usePOIPicker() {
  const [pickerState, setPickerState] = useState<POIPickerState>({
    isActive: false,
    lat: undefined,
    lng: undefined,
  })

  const activatePicker = useCallback(() => {
    setPickerState({ isActive: true, lat: undefined, lng: undefined })
  }, [])

  const deactivatePicker = useCallback(() => {
    setPickerState({ isActive: false, lat: undefined, lng: undefined })
  }, [])

  const setPickerLocation = useCallback((lat: number, lng: number) => {
    setPickerState((prev) => ({ ...prev, lat, lng }))
  }, [])

  return {
    pickerState,
    activatePicker,
    deactivatePicker,
    setPickerLocation,
  }
}

export function usePOIActions(loadPOIs: () => Promise<void>, clearSelection: () => void) {
  const handleCreate = useCallback(
    async (data: CreatePOIPayload) => {
      await createPOI(data)
      toast.success(`"${data.name}" created successfully`)
      await loadPOIs()
    },
    [loadPOIs]
  )

  const handleUpdate = useCallback(
    async (poiId: string, data: CreatePOIPayload) => {
      await updatePOI(poiId, data)
      toast.success(`"${data.name}" updated successfully`)
      await loadPOIs()
    },
    [loadPOIs]
  )

  const handleDelete = useCallback(
    async (poi: POI) => {
      try {
        await deletePOI(poi.id)
        toast.success(`"${poi.name}" deleted`)
        clearSelection()
        await loadPOIs()
      } catch {
        toast.error("Failed to delete POI")
      }
    },
    [loadPOIs, clearSelection]
  )

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}

export function usePOIDialogs() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingPoi, setEditingPoi] = useState<POI | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<POI | null>(null)

  const openCreateDialog = useCallback(() => {
    setEditingPoi(null)
    setFormOpen(true)
  }, [])

  const openEditDialog = useCallback((poi: POI) => {
    setEditingPoi(poi)
    setFormOpen(true)
  }, [])

  const closeFormDialog = useCallback(() => {
    setFormOpen(false)
    setEditingPoi(null)
  }, [])

  const openDeleteDialog = useCallback((poi: POI) => {
    setDeleteTarget(poi)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  return {
    formOpen,
    setFormOpen,
    editingPoi,
    deleteTarget,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    openDeleteDialog,
    closeDeleteDialog,
  }
}

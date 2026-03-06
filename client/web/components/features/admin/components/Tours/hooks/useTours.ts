"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"
import type { Tour, POI, CreateTourPayload } from "@/app/apis/type"        
import { fetchTours, fetchPOIs, createTour, updateTour, deleteTour } from "@/app/apis/test"

export type ViewMode = "grid" | "list"
export type FilterStatus = "all" | "draft" | "published"

export interface TourStats {
  total: number
  published: number
  draft: number
  totalPois: number
}

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [allPois, setAllPois] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [toursData, poisData] = await Promise.all([fetchTours(), fetchPOIs()])
      setTours(toursData)
      setAllPois(poisData)
    } catch {
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === "all" || t.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [tours, search, filterStatus])

  const stats = useMemo<TourStats>(() => {
    return {
      total: tours.length,
      published: tours.filter((t) => t.status === "published").length,
      draft: tours.filter((t) => t.status === "draft").length,
      totalPois: new Set(tours.flatMap((t) => t.pois.map((p) => p.poiId))).size,
    }
  }, [tours])

  const getPoiName = useCallback(
    (poiId: string) => {
      return allPois.find((p) => p.id === poiId)?.name ?? "Unknown"
    },
    [allPois]
  )

  const getPoiDetails = useCallback(
    (poiId: string): POI | undefined => {
      return allPois.find((p) => p.id === poiId)
    },
    [allPois]
  )

  return {
    tours,
    allPois,
    isLoading,
    search,
    setSearch,
    viewMode,
    setViewMode,
    filterStatus,
    setFilterStatus,
    filteredTours,
    stats,
    loadData,
    getPoiName,
    getPoiDetails,
  }
}

export function useTourActions(loadData: () => Promise<void>) {
  const handleCreate = useCallback(async (data: CreateTourPayload) => {
    await createTour(data)
    toast.success(`"${data.name}" created successfully`)
    await loadData()
  }, [loadData])

  const handleUpdate = useCallback(
    async (tourId: string, data: CreateTourPayload): Promise<Tour> => {
      const updated = await updateTour(tourId, data)
      toast.success(`"${data.name}" updated successfully`)
      await loadData()
      return updated
    },
    [loadData]
  )

  const handleDuplicate = useCallback(
    async (tour: Tour) => {
      try {
        await createTour({
          name: `${tour.name} (Copy)`,
          description: tour.description,
          pois: tour.pois,
          status: "draft",
        })
        toast.success(`Duplicated "${tour.name}"`)
        await loadData()
      } catch {
        toast.error("Failed to duplicate tour")
      }
    },
    [loadData]
  )

  const handleDelete = useCallback(
    async (tour: Tour) => {
      try {
        await deleteTour(tour.id)
        toast.success(`"${tour.name}" deleted`)
        await loadData()
      } catch {
        toast.error("Failed to delete tour")
      }
    },
    [loadData]
  )

  return {
    handleCreate,
    handleUpdate,
    handleDuplicate,
    handleDelete,
  }
}

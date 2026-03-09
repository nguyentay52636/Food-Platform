import { useState, useCallback, useEffect } from "react"
import type { POI, POIFilterCategory } from "@/src/types/poi"
import { fetchPOIs } from "@/src/lib/api"

const PAGE_SIZE = 10

export function usePOIs() {
  const [pois, setPois] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<POIFilterCategory>("all")

  const loadPage = useCallback(
    async (pageNum: number, append = false) => {
      if (append) {
        setIsLoadingMore(true)
      } else if (pageNum === 1) {
        setIsLoading(true)
      }

      try {
        const { data, hasMore } = await fetchPOIs({
          page: pageNum,
          limit: PAGE_SIZE,
          search: search || undefined,
          category: filterCategory !== "all" ? filterCategory : undefined,
        })

        if (append) {
          setPois((prev) => [...prev, ...data])
        } else {
          setPois(data)
        }
        setHasMore(hasMore)
        setPage(pageNum)
      } catch {
        // Handle error - could use toast or Snackbar
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
        setIsLoadingMore(false)
      }
    },
    [search, filterCategory]
  )

  const refresh = useCallback(() => {
    setIsRefreshing(true)
    loadPage(1, false)
  }, [loadPage])

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && pois.length > 0) {
      loadPage(page + 1, true)
    }
  }, [loadPage, isLoadingMore, hasMore, page, pois.length])

  useEffect(() => {
    loadPage(1)
  }, [search, filterCategory, loadPage])

  return {
    pois,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    refresh,
    loadMore,
    loadPage,
  }
}

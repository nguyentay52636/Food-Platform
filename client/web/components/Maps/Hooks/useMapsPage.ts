"use client"

import { useMemo, useState, useCallback } from "react"
import { categories as baseCategories, restaurants as baseRestaurants } from "../data"
import { IRestaurant } from "@/app/apis/type"

export function useMapsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(
    baseRestaurants[0]?.id ?? null
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredRestaurants = useMemo(
    () =>
      baseRestaurants.filter((r: IRestaurant & { cuisine?: string }) => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
          !selectedCategory ||
          selectedCategory === "Tất cả" ||
          r.cuisine === selectedCategory
        return matchesSearch && matchesCategory
      }),
    [searchQuery, selectedCategory]
  )

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    )
  }, [])

  const selected = useMemo(
    () => baseRestaurants.find((r) => r.id === selectedRestaurant) ?? null,
    [selectedRestaurant]
  )

  return {
    categories: baseCategories,
    filteredRestaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    favorites,
    toggleFavorite,
    selected,
  }
}


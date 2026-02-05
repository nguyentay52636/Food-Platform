"use client"

import { AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import RestaurantCard from "./RestaurantCard"
import type { RestaurantData } from "../data"

interface RestaurantListProps {
    restaurants: RestaurantData[]
    selectedRestaurant: number | null
    favorites: number[]
    onRestaurantClick: (id: number) => void
    onFavoriteToggle: (id: number) => void
}

export default function RestaurantList({ restaurants, selectedRestaurant, favorites, onRestaurantClick, onFavoriteToggle }: RestaurantListProps) {
    if (restaurants.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Không tìm thấy nhà hàng phù hợp</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
                <AnimatePresence mode="popLayout">
                    {restaurants.map((restaurant, index) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            isSelected={selectedRestaurant === restaurant.id}
                            isFavorite={favorites.includes(restaurant.id)}
                            onClick={() => onRestaurantClick(restaurant.id)}
                            onFavoriteToggle={() => onFavoriteToggle(restaurant.id)}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}


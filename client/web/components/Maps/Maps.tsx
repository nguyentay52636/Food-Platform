"use client"

import MapsHeader from "./components/MapsHeader"
import { SearchFilters, RestaurantList, MapsView, RestaurantDetail } from "./components"
import { useMapsPage } from "./Hooks/useMapsPage"

export default function Maps() {
    const {
        categories,
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
    } = useMapsPage()

    return (
        <>
            <MapsHeader restaurantCount={filteredRestaurants.length} />

            <div className="flex-1 flex overflow-hidden">
                <div className="w-full md:w-[420px] flex flex-col border-r bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden">
                    <SearchFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />

                    <RestaurantList
                        restaurants={filteredRestaurants}
                        selectedRestaurant={selectedRestaurant}
                        favorites={favorites}
                        onRestaurantClick={setSelectedRestaurant}
                        onFavoriteToggle={toggleFavorite}
                    />
                </div>

                <div className="flex-1 relative bg-gradient-to-br from-muted/30 via-background to-secondary/10 overflow-hidden">
                    <MapsView
                        restaurants={filteredRestaurants}
                        selectedRestaurant={selectedRestaurant}
                        onRestaurantClick={setSelectedRestaurant}
                    />

                    {selected && (
                        <RestaurantDetail
                            restaurant={selected}
                            isFavorite={favorites.includes(selected.id)}
                            onClose={() => setSelectedRestaurant(null)}
                            onFavoriteToggle={() => toggleFavorite(selected.id)}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

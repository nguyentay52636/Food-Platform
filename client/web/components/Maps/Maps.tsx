"use client"

import { useState } from "react"
import { MapsHeader, MapsView } from "./components"


export default function Maps() {
    const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<number[]>([])

    const categories = [
        { name: "Tất cả", icon: "🍽️" },
        { name: "Phở", icon: "🍜" },
        { name: "Bánh Mì", icon: "🥖" },
        { name: "Cơm Tấm", icon: "🍚" },
        { name: "Bún", icon: "🥢" },
        { name: "Hải sản", icon: "🦐" },
        { name: "Lẩu", icon: "🍲" },
    ]

    const restaurants = [
        {
            id: 1,
            name: "Phở Hòa Pasteur",
            cuisine: "Phở",
            rating: 4.8,
            reviews: 1234,
            address: "260C Pasteur, Phường 8, Quận 3",
            phone: "028 3829 7943",
            hours: "6:00 - 22:00",
            priceRange: "$$",
            lat: 10.7769,
            lng: 106.6951,
            isLive: true,
            image: "/img/pho-bowl.jpg",
        },
        {
            id: 2,
            name: "Bánh Mì Huỳnh Hoa",
            cuisine: "Bánh Mì",
            rating: 4.9,
            reviews: 2341,
            address: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1",
            phone: "028 3925 3389",
            hours: "15:00 - 23:00",
            priceRange: "$",
            lat: 10.7707,
            lng: 106.6983,
            isLive: false,
            image: "/img/banh-mi-sandwich.jpg",
        },
        {
            id: 3,
            name: "Cơm Tấm Mộc",
            cuisine: "Cơm Tấm",
            rating: 4.7,
            reviews: 876,
            address: "6B Trần Quang Diệu, Phường 14, Quận 3",
            phone: "028 3930 5897",
            hours: "10:00 - 21:00",
            priceRange: "$$",
            lat: 10.7823,
            lng: 106.6919,
            isLive: true,
            image: "/img/com-tam-rice.jpg",
        },
        {
            id: 4,
            name: "Bún Bò Huế Đông Ba",
            cuisine: "Bún",
            rating: 4.6,
            reviews: 654,
            address: "48 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1",
            phone: "028 3836 7279",
            hours: "7:00 - 20:00",
            priceRange: "$",
            lat: 10.7642,
            lng: 106.6917,
            isLive: false,
            image: "/img/bun-bo-hue.png",
        },
    ]

    const filteredRestaurants = restaurants.filter((r) => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = !selectedCategory || selectedCategory === "Tất cả" || r.cuisine === selectedCategory
        return matchesSearch && matchesCategory
    })

    const toggleFavorite = (id: number) => {
        setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
    }

    const selected = restaurants.find((r) => r.id === selectedRestaurant)

    return (
        <>
            <MapsHeader restaurantCount={filteredRestaurants.length} />

            <div className="flex-1 relative bg-gradient-to-br from-muted/30 via-background to-secondary/10 overflow-hidden">
                <MapsView
                    restaurants={filteredRestaurants}
                    selectedRestaurant={selectedRestaurant}
                    onRestaurantClick={setSelectedRestaurant}
                />


            </div>

        </>
    )
}   

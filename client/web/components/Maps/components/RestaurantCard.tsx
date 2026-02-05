"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Star, Utensils, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Restaurant {
    id: number
    name: string
    cuisine: string
    rating: number
    reviews: number
    address: string
    image: string
    isLive: boolean
    priceRange: string
}

interface RestaurantCardProps {
    restaurant: Restaurant
    isSelected: boolean
    isFavorite: boolean
    onClick: () => void
    onFavoriteToggle: () => void
    index: number
}

export default function RestaurantCard({
    restaurant,
    isSelected,
    isFavorite,
    onClick,
    onFavoriteToggle,
    index,
}: RestaurantCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}>
            <Card
                className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 overflow-hidden group",
                    isSelected && "ring-4 ring-primary/30 shadow-2xl border-primary/70 scale-[1.02]"
                )}
                onClick={onClick}
            >
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                        <div className="relative flex-shrink-0">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                                <img
                                    src={restaurant.image || "/placeholder.svg"}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {restaurant.isLive && (
                                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs animate-pulse shadow-lg">
                                    <Video className="h-3 w-3 mr-1" />
                                    LIVE
                                </Badge>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:bg-primary hover:text-primary-foreground"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onFavoriteToggle()
                                }}
                            >
                                <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-red-500 text-red-500")} />
                            </Button>
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                            <div>
                                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{restaurant.name}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        <Utensils className="h-3 w-3 mr-1" />
                                        {restaurant.cuisine}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {restaurant.priceRange}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span className="text-sm font-bold">{restaurant.rating}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">({restaurant.reviews} đánh giá)</span>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{restaurant.address}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}


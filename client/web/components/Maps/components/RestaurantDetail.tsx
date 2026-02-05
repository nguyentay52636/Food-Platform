"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Heart, NavigationIcon, Video, Star, Utensils, MapPin, Phone, Clock, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RestaurantData } from "../data"

interface RestaurantDetailProps {
  restaurant: RestaurantData
  isFavorite: boolean
  onClose: () => void
  onFavoriteToggle: () => void
}

export default function RestaurantDetail({ restaurant, isFavorite, onClose, onFavoriteToggle }: RestaurantDetailProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="absolute z-50 bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px]"
      >
        <Card className="shadow-2xl border-2 backdrop-blur-xl bg-card/95 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <div className="relative h-56 overflow-hidden">
                <img src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              {restaurant.isLive && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white shadow-lg animate-pulse">
                  <Video className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 left-4 rounded-full shadow-lg backdrop-blur-sm bg-background/80"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-16 rounded-full shadow-lg backdrop-blur-sm bg-background/80"
                onClick={onFavoriteToggle}
              >
                <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-red-500 text-red-500")} />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{restaurant.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    <Utensils className="h-3 w-3 mr-1" />
                    {restaurant.cuisine}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {restaurant.priceRange}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-lg">{restaurant.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({restaurant.reviews} đánh giá)</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{restaurant.hours}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 shadow-lg">
                  <NavigationIcon className="h-4 w-4 mr-2" />
                  Chỉ đường
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Chi tiết
                </Button>
                {restaurant.isLive && (
                  <Button variant="outline" size="icon" className="bg-red-500/10 border-red-500/50 hover:bg-red-500/20">
                    <Video className="h-4 w-4 text-red-500" />
                  </Button>
                )}
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}


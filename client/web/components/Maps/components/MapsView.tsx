"use client"

import { ChefHat } from "lucide-react"
import { IRestaurant } from "@/app/apis/type"
import { useMaps } from "../Hooks/useMaps"

interface MapsViewProps {
    restaurants: IRestaurant[]
    selectedRestaurant: number | null
    onRestaurantClick: (id: number) => void
}

export default function MapsView({ restaurants, selectedRestaurant, onRestaurantClick }: MapsViewProps) {
    const { isReady, leafletComponents, center, getMarkerIcon } = useMaps(restaurants, selectedRestaurant)

    if (!isReady || !leafletComponents) {
        return (
            <div className="flex-1 relative bg-gradient-to-br from-muted/30 via-background to-secondary/10 overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6 shadow-xl animate-pulse">
                        <ChefHat className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Đang tải bản đồ...</h3>
                </div>
            </div>
        )
    }

    const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = leafletComponents

    return (
        <div className="flex-1 relative overflow-hidden" style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={false}
            >
                {/* OpenStreetMap Tile Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                    maxNativeZoom={19}
                />

                {/* Zoom Controls */}
                <ZoomControl position="bottomright" />

                {restaurants.map((restaurant: IRestaurant) => {
                    const icon = getMarkerIcon(restaurant)

                    return (
                        <Marker
                            key={restaurant.id}
                            position={[restaurant.lat, restaurant.lng]}
                            icon={icon}
                            eventHandlers={{
                                click: () => onRestaurantClick(restaurant.id),
                            }}
                        >
                            <Popup
                                minWidth={200}
                                maxWidth={300}
                                closeButton={true}
                                className="custom-popup"
                            >
                                <div style={{ padding: '8px' }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ChefHat className="h-5 w-5 text-primary" />
                                        <span className="font-bold text-lg" style={{ color: '#1f2937' }}>
                                            {restaurant.name}
                                        </span>
                                    </div>
                                    {restaurant.isLive && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            <span className="text-xs font-semibold text-red-600">Đang mở cửa</span>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}


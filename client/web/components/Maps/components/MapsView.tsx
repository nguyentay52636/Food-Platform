"use client"

import { useEffect, useState } from "react"
import { ChefHat } from "lucide-react"
import { IRestaurant } from "@/app/apis/type"



interface MapsViewProps {
    restaurants: IRestaurant[]
    selectedRestaurant: number | null
    onRestaurantClick: (id: number) => void
}

export default function MapsView({ restaurants, selectedRestaurant, onRestaurantClick }: MapsViewProps) {
    const [isClient, setIsClient] = useState(false)
    const [LeafletComponents, setLeafletComponents] = useState<any>(null)

    useEffect(() => {
        setIsClient(true)
        // Dynamic import on client side
        const loadLeaflet = async () => {
            const L = (await import('leaflet')).default
            const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = await import('react-leaflet')
            setLeafletComponents({
                MapContainer,
                TileLayer,
                Marker,
                Popup,
                ZoomControl,
                L
            })
        }
        loadLeaflet()
    }, [])

    // Calculate center point based on all restaurants
    const centerLat = restaurants.length > 0
        ? restaurants.reduce((sum: number, r: IRestaurant) => sum + r.lat, 0) / restaurants.length
        : 10.7769
    const centerLng = restaurants.length > 0
        ? restaurants.reduce((sum: number, r: IRestaurant) => sum + r.lng, 0) / restaurants.length
        : 106.6951

    if (!isClient || !LeafletComponents) {
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

    const { MapContainer, TileLayer, Marker, Popup, ZoomControl, L } = LeafletComponents

    const createCustomIcon = (isSelected: boolean, isLive: boolean) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background: ${isSelected ? '#f39c12' : '#8b5cf6'};
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.4);
                    border: 4px solid white;
                    position: relative;
                    transition: all 0.3s ease;
                    ${isSelected ? 'transform: scale(1.4); z-index: 1000;' : ''}
                    cursor: pointer;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${isLive ? `<div style="
                        position: absolute;
                        top: -2px;
                        right: -2px;
                        width: 16px;
                        height: 16px;
                        background: #ef4444;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(239,68,68,0.6);
                        animation: pulse-live 2s infinite;
                    "></div>
                    <style>
                        @keyframes pulse-live {
                            0%, 100% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.3); opacity: 0.6; }
                        }
                    </style>` : ''}
                </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
        })
    }

    return (
        <div className="flex-1 relative overflow-hidden" style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={[centerLat, centerLng]}
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

                {restaurants.map((restaurant: Restaurant) => (
                    <Marker
                        key={restaurant.id}
                        position={[restaurant.lat, restaurant.lng]}
                        icon={createCustomIcon(selectedRestaurant === restaurant.id, restaurant.isLive)}
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
                ))}
            </MapContainer>
        </div>
    )
}


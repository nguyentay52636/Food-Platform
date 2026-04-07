"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import type { POI } from "@/lib/types"
import { Navigation } from "lucide-react"

interface POIMapProps {
    pois: POI[]
    selectedPoi?: POI | null
    onMapClick?: (lat: number, lng: number) => void
    onMarkerClick?: (poi: POI) => void
    pickerMode?: boolean
    pickerLat?: number
    pickerLng?: number
    className?: string
}

export function PoisMap({
    pois,
    selectedPoi,
    onMapClick,
    onMarkerClick,
    pickerMode = false,
    pickerLat,
    pickerLng,
    className = "",
}: POIMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.Marker[]>([])
    const pickerMarkerRef = useRef<L.Marker | null>(null)
    const userMarkerRef = useRef<L.Marker | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)

    // Initialize map
    useEffect(() => {
        let isMounted = true
        let mapInstance: L.Map | null = null

        async function init() {
            if (!mapRef.current) return

            const container = mapRef.current as HTMLElement & { _leaflet_id?: number }
            if (container._leaflet_id) {
                return
            }

            const L = (await import("leaflet")).default
            await import("leaflet/dist/leaflet.css")

            if (!isMounted || !mapRef.current) return

            mapInstance = L.map(mapRef.current, {
                center: [16.047, 108.206],
                zoom: 13,
                zoomControl: true,
            })

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapInstance)

            if (isMounted) {
                mapInstanceRef.current = mapInstance
                setIsReady(true)
            }
        }

        init()

        return () => {
            isMounted = false
            const map = mapInstanceRef.current
            if (map) {
                try {
                    map.remove()
                } catch {
                    // Container may already be reused (e.g. Strict Mode)
                }
                mapInstanceRef.current = null
            }
            setIsReady(false)
        }
    }, [])

    // Handle map click
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return

        function handler(e: L.LeafletMouseEvent) {
            onMapClick?.(e.latlng.lat, e.latlng.lng)
        }

        if (pickerMode && onMapClick) {
            mapInstanceRef.current.on("click", handler)
            mapInstanceRef.current.getContainer().style.cursor = "crosshair"
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off("click", handler)
                mapInstanceRef.current.getContainer().style.cursor = ""
            }
        }
    }, [pickerMode, onMapClick, isReady])

    // Render POI markers
    const renderMarkers = useCallback(async () => {
        if (!mapInstanceRef.current || !isReady) return

        const L = (await import("leaflet")).default

        // Clear existing
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []

        pois.forEach((poi) => {
            const isMajor = poi.category === "major"
            const isSelected = selectedPoi?.id === poi.id

            const icon = L.divIcon({
                className: "custom-marker",
                html: `<div style="
          width: ${isSelected ? "18px" : "14px"};
          height: ${isSelected ? "18px" : "14px"};
          border-radius: 50%;
          background: ${isMajor ? "#2dd4bf" : "#94a3b8"};
          border: 2px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.5)"};
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s;
        "></div>`,
                iconSize: [isSelected ? 18 : 14, isSelected ? 18 : 14],
                iconAnchor: [isSelected ? 9 : 7, isSelected ? 9 : 7],
            })

            const marker = L.marker([poi.latitude, poi.longitude], { icon })
                .addTo(mapInstanceRef.current!)
                .bindTooltip(poi.name, {
                    direction: "top",
                    offset: [0, -10],
                    className: "poi-tooltip",
                })

            marker.on("click", () => onMarkerClick?.(poi))
            markersRef.current.push(marker)
        })
    }, [pois, selectedPoi, onMarkerClick, isReady])

    useEffect(() => {
        renderMarkers()
    }, [renderMarkers])

    // Picker marker
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return

        async function updatePicker() {
            const L = (await import("leaflet")).default

            if (pickerMarkerRef.current) {
                pickerMarkerRef.current.remove()
                pickerMarkerRef.current = null
            }

            if (pickerMode && pickerLat != null && pickerLng != null) {
                const icon = L.divIcon({
                    className: "picker-marker",
                    html: `<div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f43f5e;
            border: 3px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                })
                pickerMarkerRef.current = L.marker([pickerLat, pickerLng], { icon }).addTo(
                    mapInstanceRef.current!
                )
            }
        }

        updatePicker()
    }, [pickerMode, pickerLat, pickerLng, isReady])

    // Pan to selected POI
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedPoi || !isReady) return
        mapInstanceRef.current.setView([selectedPoi.latitude, selectedPoi.longitude], 15, {
            animate: true,
        })
    }, [selectedPoi, isReady])

    const handleLocateUser = useCallback(() => {
        if (!mapInstanceRef.current || !isReady) return
        if (!navigator.geolocation) {
            setLocationError("Trình duyệt không hỗ trợ định vị.")
            return
        }

        setIsLocating(true)
        setLocationError(null)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const map = mapInstanceRef.current
                if (!map) {
                    setIsLocating(false)
                    return
                }

                const L = (await import("leaflet")).default
                if (userMarkerRef.current) {
                    userMarkerRef.current.remove()
                    userMarkerRef.current = null
                }

                const icon = L.divIcon({
                    className: "user-location-marker",
                    html: `<div style="
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        border: 3px solid #fff;
                        box-shadow: 0 0 0 2px rgba(59,130,246,0.35), 0 2px 8px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                })

                userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(map)
                map.setView([latitude, longitude], 16, { animate: true })
                setIsLocating(false)
            },
            (error) => {
                setIsLocating(false)
                setLocationError(error.message || "Không thể lấy vị trí hiện tại.")
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 8000,
            }
        )
    }, [isReady])

    // Ensure map recalculates size after layout changes
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return
        const map = mapInstanceRef.current
        const handleResize = () => map.invalidateSize()
        const timeout = window.setTimeout(handleResize, 120)
        window.addEventListener("resize", handleResize)
        return () => {
            window.clearTimeout(timeout)
            window.removeEventListener("resize", handleResize)
        }
    }, [isReady, pois.length, pickerMode])

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="h-full w-full rounded-lg" />
            <button
                type="button"
                onClick={handleLocateUser}
                className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/95 text-foreground shadow-md backdrop-blur hover:bg-accent"
                title="Xác định vị trí hiện tại"
                disabled={!isReady || isLocating}
            >
                <Navigation className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
            </button>
            {pickerMode && (
                <div className="absolute left-3 top-3 z-[1000] rounded-md bg-card/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm">
                    Click on the map to select a location
                </div>
            )}
            {locationError && (
                <div className="absolute bottom-3 left-3 z-[1000] rounded-md bg-destructive/90 px-2.5 py-1.5 text-xs text-destructive-foreground shadow-md">
                    {locationError}
                </div>
            )}
        </div>
    )
}

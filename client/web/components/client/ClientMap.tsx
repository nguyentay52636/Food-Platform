"use client"

import { useEffect, useRef, useId, useState } from "react"
import type L from "leaflet"
import type { ClientPOI, LanguageCode } from "@/lib/client-types"

interface ClientMapProps {
    pois: ClientPOI[]
    selectedPoi?: ClientPOI | null
    onMarkerClick?: (poi: ClientPOI) => void
    language: LanguageCode
    className?: string
    userLocation?: { lat: number; lng: number } | null
}

export function ClientMap({
    pois,
    selectedPoi,
    onMarkerClick,
    language,
    className = "",
    userLocation,
}: ClientMapProps) {
    const uniqueId = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.Marker[]>([])
    const userMarkerRef = useRef<L.Marker | null>(null)
    const [isReady, setIsReady] = useState(false)
    const initializedRef = useRef(false)

    // Initialize map
    useEffect(() => {
        if (initializedRef.current) return
        if (!containerRef.current) return

        let isMounted = true

        async function initMap() {
            const L = (await import("leaflet")).default
            await import("leaflet/dist/leaflet.css")

            if (!isMounted || !containerRef.current) return
            if (mapInstanceRef.current) return

            // Clean any existing map on this container
            const container = containerRef.current as HTMLElement & { _leaflet_id?: number }
            if (container._leaflet_id) {
                delete container._leaflet_id
            }

            const map = L.map(containerRef.current, {
                center: [16.047, 108.206],
                zoom: 13,
                zoomControl: false,
            })

            L.control.zoom({ position: "bottomright" }).addTo(map)

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap",
            }).addTo(map)

            mapInstanceRef.current = map
            initializedRef.current = true

            if (isMounted) {
                setIsReady(true)
            }
        }

        initMap()

        return () => {
            isMounted = false
        }
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
            initializedRef.current = false
            setIsReady(false)
        }
    }, [])

    // Update markers
    useEffect(() => {
        if (!isReady || !mapInstanceRef.current) return

        const map = mapInstanceRef.current

        import("leaflet").then((L) => {
            // Clear existing markers
            markersRef.current.forEach((m) => m.remove())
            markersRef.current = []

            pois.forEach((poi) => {
                const isMajor = poi.category === "major"
                const isSelected = selectedPoi?.id === poi.id
                const hasAudio = !!poi.audio[language]

                const markerColor = isMajor ? "#10b981" : "#64748b"
                const markerSize = isSelected ? 28 : isMajor ? 18 : 14

                const icon = L.default.divIcon({
                    className: "custom-marker",
                    html: `
            <div style="position: relative; width: ${markerSize}px; height: ${markerSize}px;">
              ${isSelected ? `
                <div style="
                  position: absolute;
                  inset: -8px;
                  border-radius: 50%;
                  background: ${markerColor};
                  opacity: 0.2;
                  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>
              ` : ""}
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: ${markerColor};
                border: ${isSelected ? "3px" : "2px"} solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                ${hasAudio && isMajor ? `
                  <svg width="${markerSize * 0.45}" height="${markerSize * 0.45}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                ` : ""}
              </div>
            </div>
          `,
                    iconSize: [markerSize, markerSize],
                    iconAnchor: [markerSize / 2, markerSize / 2],
                })

                const marker = L.default.marker([poi.latitude, poi.longitude], { icon })
                    .addTo(map)
                    .bindTooltip(poi.name[language] || poi.name.en, {
                        direction: "top",
                        offset: [0, -markerSize / 2],
                    })

                marker.on("click", () => onMarkerClick?.(poi))
                markersRef.current.push(marker)
            })

            // Center on selected POI
            if (selectedPoi) {
                map.setView([selectedPoi.latitude, selectedPoi.longitude], 15, {
                    animate: true,
                })
            }
        })
    }, [isReady, pois, selectedPoi, onMarkerClick, language])

    // Update user location marker
    useEffect(() => {
        if (!isReady || !mapInstanceRef.current) return

        const map = mapInstanceRef.current

        import("leaflet").then((L) => {
            if (userMarkerRef.current) {
                userMarkerRef.current.remove()
                userMarkerRef.current = null
            }

            if (userLocation) {
                const icon = L.default.divIcon({
                    className: "user-location",
                    html: `
            <div style="
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #3b82f6;
              border: 3px solid white;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.3);
            "></div>
          `,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                })

                userMarkerRef.current = L.default.marker(
                    [userLocation.lat, userLocation.lng],
                    { icon }
                ).addTo(map)
            }
        })
    }, [isReady, userLocation])

    return (
        <div
            ref={containerRef}
            id={`map-${uniqueId}`}
            className={`w-full h-full ${className}`}
        >
            {!isReady && (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                    <div className="text-sm text-muted-foreground">Loading map...</div>
                </div>
            )}
        </div>
    )
}

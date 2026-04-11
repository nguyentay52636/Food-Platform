"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import type L from "leaflet"
import type { ClientPOI, LanguageCode } from "@/lib/client-types"
import { useTranslatedUiText } from "@/lib/translation-utils"

/** OSM CDN một host (ổn định hơn subdomain trên một số mạng) + Carto dự phòng. */
const TILE_SPECS: readonly {
    url: string
    attribution: string
    subdomains?: string | string[]
}[] = [
    {
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    {
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        attribution: '&copy; OSM &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
    },
] as const

interface ClientMapProps {
    pois: ClientPOI[]
    selectedPoi?: ClientPOI | null
    onMarkerClick?: (poi: ClientPOI) => void
    language: LanguageCode
    className?: string
    userLocation?: { lat: number; lng: number } | null
    locateSignal?: number
    focusFilterSignal?: number
}

export function ClientMap({
    pois,
    selectedPoi,
    onMarkerClick,
    language,
    className = "",
    userLocation,
    locateSignal,
    focusFilterSignal,
}: ClientMapProps) {
    const uniqueId = useId()
    const containerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const tileLayerRef = useRef<L.TileLayer | null>(null)
    const markersRef = useRef<L.Marker[]>([])
    const userMarkerRef = useRef<L.Marker | null>(null)
    const [isReady, setIsReady] = useState(false)
    const initializedRef = useRef(false)
    const lastCenteredPoiIdRef = useRef<string | null>(null)
    const loadingMapText = useTranslatedUiText("Loading map...", language, "en")

    const invalidateMapSize = useCallback(() => {
        const map = mapInstanceRef.current
        if (!map) return
        map.invalidateSize({ animate: false })
    }, [])

    // Initialize map + keep size in sync (mobile flex / URL bar / xoay màn hình).
    useEffect(() => {
        if (!containerRef.current) return
        if (initializedRef.current) return

        let isMounted = true
        const containerEl = containerRef.current
        const kickTimeouts: number[] = []

        async function initMap() {
            const L = (await import("leaflet")).default
            await import("leaflet/dist/leaflet.css")

            if (!isMounted || !containerRef.current) return
            if (mapInstanceRef.current) return

            const container = containerRef.current as HTMLElement & { _leaflet_id?: number }
            if (container._leaflet_id) {
                delete container._leaflet_id
            }

            const map = L.map(containerRef.current, {
                center: [10.7579, 106.7005],
                zoom: 16,
                zoomControl: false,
            })

            L.control.zoom({ position: "topright" }).addTo(map)

            let tileErrorCount = 0
            const addTiles = (index: number) => {
                const spec = TILE_SPECS[index]
                if (!spec) return
                if (tileLayerRef.current) {
                    map.removeLayer(tileLayerRef.current)
                    tileLayerRef.current = null
                }
                const layer = L.tileLayer(spec.url, {
                    attribution: spec.attribution,
                    maxZoom: 19,
                    ...(spec.subdomains ? { subdomains: spec.subdomains } : {}),
                })
                layer.on("tileerror", () => {
                    if (!isMounted) return
                    tileErrorCount += 1
                    if (tileErrorCount < 8 || index >= TILE_SPECS.length - 1) return
                    tileErrorCount = 0
                    addTiles(index + 1)
                    invalidateMapSize()
                })
                layer.addTo(map)
                tileLayerRef.current = layer
            }
            addTiles(0)

            if (!isMounted || !containerRef.current) {
                map.remove()
                return
            }

            mapInstanceRef.current = map
            initializedRef.current = true

            const kickLayout = () => {
                if (!isMounted || !mapInstanceRef.current) return
                invalidateMapSize()
            }
            map.whenReady(() => requestAnimationFrame(kickLayout))
            requestAnimationFrame(kickLayout)
            kickTimeouts.push(
                window.setTimeout(kickLayout, 120),
                window.setTimeout(kickLayout, 450),
                window.setTimeout(kickLayout, 1400)
            )

            setIsReady(true)
        }

        void initMap()

        const ro = new ResizeObserver(() => {
            requestAnimationFrame(invalidateMapSize)
        })
        ro.observe(containerEl)

        const onWin = () => invalidateMapSize()
        window.addEventListener("resize", onWin)
        window.addEventListener("orientationchange", onWin)
        const onVis = () => {
            if (document.visibilityState === "visible") {
                requestAnimationFrame(invalidateMapSize)
            }
        }
        document.addEventListener("visibilitychange", onVis)
        window.addEventListener("pageshow", onWin)

        return () => {
            isMounted = false
            kickTimeouts.forEach((t) => window.clearTimeout(t))
            ro.disconnect()
            window.removeEventListener("resize", onWin)
            window.removeEventListener("orientationchange", onWin)
            document.removeEventListener("visibilitychange", onVis)
            window.removeEventListener("pageshow", onWin)
        }
    }, [invalidateMapSize])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            tileLayerRef.current = null
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

                // Color system (shared with admin maps):
                // - primary (major): blue
                // - secondary (minor): orange
                // - selected: green (ping)
                const markerColor = isSelected ? "#22c55e" : isMajor ? "#3b82f6" : "#f59e0b"
                const markerSize = isSelected ? 28 : isMajor ? 18 : 14

                const icon = L.default.divIcon({
                    className: "custom-marker",
                    html: `
            <div style="position: relative; width: ${markerSize}px; height: ${markerSize}px;">
              <div style="
                position: absolute;
                inset: ${isSelected ? "-8px" : "-6px"};
                border-radius: 50%;
                background: ${markerColor};
                opacity: ${isSelected ? "0.26" : "0.14"};
                animation: ping ${isSelected ? "1.5s" : "2.2s"} cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
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
                // Avoid fighting with locate-to-user: only auto-center when POI actually changes.
                if (lastCenteredPoiIdRef.current !== selectedPoi.id) {
                    map.setView([selectedPoi.latitude, selectedPoi.longitude], 15, {
                        animate: true,
                    })
                    lastCenteredPoiIdRef.current = selectedPoi.id
                }
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

    // Externally request: move map to current user position.
    useEffect(() => {
        if (!isReady) return
        if (!mapInstanceRef.current) return
        if (!userLocation) return
        if (!locateSignal) return

        mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 17, {
            animate: true,
        })
    }, [isReady, locateSignal, userLocation])

    // Focus map to currently filtered POIs when filter chip is pressed.
    useEffect(() => {
        if (!isReady || !mapInstanceRef.current) return
        if (!focusFilterSignal) return
        if (pois.length === 0) return

        const map = mapInstanceRef.current
        if (pois.length === 1) {
            map.setView([pois[0].latitude, pois[0].longitude], 17, { animate: true })
            return
        }

        import("leaflet").then((L) => {
            const bounds = L.default.latLngBounds(
                pois.map((poi) => [poi.latitude, poi.longitude] as [number, number])
            )
            map.fitBounds(bounds, {
                padding: [60, 60],
                maxZoom: 17,
                animate: true,
            })
        })
    }, [isReady, focusFilterSignal, pois])

    return (
        <div
            className={`relative flex h-full min-h-[36dvh] w-full min-w-0 flex-col md:min-h-0 ${className}`}
        >
            <div
                ref={containerRef}
                id={`map-${uniqueId}`}
                className="min-h-0 flex-1 w-full"
            />

            {!isReady && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/90">
                    <div className="text-sm text-muted-foreground">{loadingMapText}</div>
                </div>
            )}
        </div>
    )
}

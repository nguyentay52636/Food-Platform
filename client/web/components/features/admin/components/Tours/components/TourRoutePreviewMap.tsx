"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { sortTourPois } from "@/lib/utils"

interface TourRoutePreviewMapProps {
  tour: Tour | null
  allPois: POI[]
  className?: string
}

const DEFAULT_CENTER: [number, number] = [16.047, 108.206]

/** Bản đồ Leaflet: polyline nối các POI theo thứ tự tour. */
export function TourRoutePreviewMap({ tour, allPois, className = "" }: TourRoutePreviewMapProps) {
  const hasResolvedPois = useMemo(() => {
    if (!tour?.pois.length) return false
    return sortTourPois(tour.pois).some((tp) => allPois.some((p) => p.id === tp.poiId))
  }, [tour, allPois])

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const layersRef = useRef<{ polyline: import("leaflet").Polyline | null; markers: import("leaflet").Marker[] }>({
    polyline: null,
    markers: [],
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!containerRef.current) return
      const el = containerRef.current as HTMLElement & { _leaflet_id?: number }
      if (el._leaflet_id) return

      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (cancelled || !containerRef.current) return

      const map = L.map(containerRef.current, {
        center: DEFAULT_CENTER,
        zoom: 13,
        zoomControl: true,
      })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map)

      mapRef.current = map
      setReady(true)
    }

    init()

    return () => {
      cancelled = true
      const m = mapRef.current
      if (m) {
        try {
          m.remove()
        } catch {
          /* strict mode / remount */
        }
        mapRef.current = null
      }
      layersRef.current = { polyline: null, markers: [] }
      setReady(false)
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !ready) return

    async function draw() {
      const L = (await import("leaflet")).default
      const map = mapRef.current!
      const { polyline: prevP, markers: prevM } = layersRef.current
      if (prevP) {
        map.removeLayer(prevP)
      }
      prevM.forEach((mk) => map.removeLayer(mk))
      layersRef.current = { polyline: null, markers: [] }

      if (!tour || tour.pois.length === 0) {
        map.setView(DEFAULT_CENTER, 12)
        return
      }

      const ordered = sortTourPois(tour.pois)
      const resolved: POI[] = []
      for (const tp of ordered) {
        const poi = allPois.find((p) => p.id === tp.poiId)
        if (poi) resolved.push(poi)
      }

      if (resolved.length === 0) {
        map.setView(DEFAULT_CENTER, 12)
        return
      }

      const latlngs: [number, number][] = resolved.map((p) => [p.latitude, p.longitude])

      const poly = L.polyline(latlngs, {
        color: "#2563eb",
        weight: 4,
        opacity: 0.88,
        lineJoin: "round",
      }).addTo(map)
      layersRef.current.polyline = poly

      const markers: import("leaflet").Marker[] = []
      resolved.forEach((poi, index) => {
        const icon = L.divIcon({
          className: "tour-route-num-marker",
          html: `<div style="
            width:26px;height:26px;border-radius:50%;
            background:linear-gradient(135deg,#2563eb,#7c3aed);
            color:#fff;font-size:11px;font-weight:700;
            display:flex;align-items:center;justify-content:center;
            border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);
          ">${index + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        })
        const mk = L.marker([poi.latitude, poi.longitude], { icon })
          .addTo(map)
          .bindTooltip(`${index + 1}. ${poi.name}`, { direction: "top", offset: [0, -12] })
        markers.push(mk)
      })
      layersRef.current.markers = markers

      if (latlngs.length === 1) {
        map.setView(latlngs[0]!, 15)
      } else {
        map.fitBounds(poly.getBounds(), { padding: [36, 36], maxZoom: 16 })
      }

      setTimeout(() => map.invalidateSize(), 120)
    }

    draw()
  }, [tour, allPois, ready])

  useEffect(() => {
    const map = mapRef.current
    const el = containerRef.current
    if (!map || !el || !ready) return
    const ro = new ResizeObserver(() => {
      map.invalidateSize()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ready])

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Lộ trình trên bản đồ</h3>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {tour
              ? `Tour đang xem: ${tour.name}`
              : "Chọn một tour trong danh sách để xem lộ trình."}
          </p>
        </div>
      </div>
      <div className="relative min-h-[280px] w-full flex-1 bg-muted/30">
        <div ref={containerRef} className="absolute inset-0 z-0 h-full min-h-[280px] w-full" />
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/20 text-xs text-muted-foreground">
            Đang tải bản đồ…
          </div>
        )}
        {ready && tour && tour.pois.length > 0 && !hasResolvedPois && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/85 px-4 text-center text-xs text-muted-foreground backdrop-blur-[1px]">
            Không tìm thấy tọa độ POI cho tour này trong dữ liệu hiện tại.
          </div>
        )}
      </div>
    </div>
  )
}

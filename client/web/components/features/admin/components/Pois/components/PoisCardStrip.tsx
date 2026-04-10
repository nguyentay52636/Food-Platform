"use client"

import { useRef, useEffect, type MouseEvent } from "react"
import Image from "next/image"
import { MapPin, Star, Image as ImageIcon } from "lucide-react"
import type { POI } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"

interface POICardsStripProps {
    pois: POI[]
    selectedPoi?: POI | null
    adminUi: AdminPoisUi
    onRequestDelete: (poi: POI) => void
}

function subCategoryLabel(adminUi: AdminPoisUi, subCategory: string | undefined): string {
    if (!subCategory) return adminUi.minorFallback
    const key = subCategory as keyof AdminPoisUi["sub"]
    return adminUi.sub[key] ?? adminUi.minorFallback
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`
    }
    return `${km.toFixed(1)}km`
}

export function PoisCardStrip({ pois, selectedPoi, adminUi, onRequestDelete }: POICardsStripProps) {
    const t = adminUi.strip
    const foundLine =
        t.foundCountStyle === "suffix" ? `${pois.length}${t.found}` : `${pois.length} ${t.found}`
    const scrollRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
    const isDraggingRef = useRef(false)
    const dragStartXRef = useRef(0)
    const dragStartScrollLeftRef = useRef(0)
    const movedRef = useRef(false)

    // Center position (Vinh Khanh food street)
    const centerLat = 10.7579
    const centerLng = 106.7005

    // Auto-scroll to selected card
    useEffect(() => {
        if (selectedPoi && cardRefs.current.has(selectedPoi.id)) {
            const card = cardRefs.current.get(selectedPoi.id)
            card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
    }, [selectedPoi])

    if (pois.length === 0) return null

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return
        isDraggingRef.current = true
        movedRef.current = false
        dragStartXRef.current = e.clientX
        dragStartScrollLeftRef.current = scrollRef.current.scrollLeft
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current || !scrollRef.current) return
        const deltaX = e.clientX - dragStartXRef.current
        if (Math.abs(deltaX) > 4) {
            movedRef.current = true
        }
        scrollRef.current.scrollLeft = dragStartScrollLeftRef.current - deltaX
    }

    const handleMouseUp = () => {
        isDraggingRef.current = false
        // Reset shortly after mouseup so click event can be suppressed if drag happened
        window.setTimeout(() => {
            movedRef.current = false
        }, 0)
    }

    return (
        <div className="border-t border-border bg-card/80 backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
                <p className="text-xs text-muted-foreground">
                    {foundLine}
                </p>
            </div>
            <div
                ref={scrollRef}
                className={cn(
                    "w-full overflow-x-auto whitespace-nowrap",
                    "cursor-grab active:cursor-grabbing"
                )}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="flex gap-3 p-4">
                    {pois.map((poi) => {
                        const distance = calculateDistance(centerLat, centerLng, poi.latitude, poi.longitude)
                        const isSelected = selectedPoi?.id === poi.id

                        return (
                            <Card
                                key={poi.id}
                                ref={(el) => {
                                    if (el) cardRefs.current.set(poi.id, el)
                                }}
                                className={cn(
                                    "flex-shrink-0 w-64 cursor-pointer overflow-hidden transition-all duration-200",
                                    "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                                    isSelected && "ring-2 ring-primary shadow-lg scale-[1.02]"
                                )}
                                onClick={() => {
                                    if (movedRef.current) return
                                    onRequestDelete(poi)
                                }}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-32 w-full bg-muted">
                                    {poi.imageUrl ? (
                                        <Image
                                            src={poi.imageUrl}
                                            alt={poi.name}
                                            fill
                                            className="object-cover"
                                            sizes="256px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {/* Category badge */}
                                    <Badge
                                        variant={poi.category === "major" ? "default" : "secondary"}
                                        className="absolute left-2 top-2 text-[10px] shadow-sm"
                                    >
                                        {poi.category === "major" ? t.primary : subCategoryLabel(adminUi, poi.subCategory)}
                                    </Badge>
                                    {/* Distance badge */}
                                    <div className="absolute right-2 top-2 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm">
                                        {formatDistance(distance)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium text-sm text-foreground line-clamp-1">{poi.name}</h4>
                                        {poi.rating && (
                                            <div className="flex shrink-0 items-center gap-0.5">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-medium">{poi.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    {poi.description && (
                                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 whitespace-normal">
                                            {poi.description}
                                        </p>
                                    )}
                                    {poi.address && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="line-clamp-1 whitespace-normal">{poi.address}</span>
                                        </div>
                                    )}
                                    <div className="mt-2 space-y-0.5 border-t border-border/50 pt-2 text-[10px] tabular-nums">
                                        <div className="flex justify-between gap-2">
                                            <span className="shrink-0 text-muted-foreground">{t.latLabel}</span>
                                            <span className="min-w-0 truncate text-right font-mono text-foreground">
                                                {poi.latitude.toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span className="shrink-0 text-muted-foreground">{t.lngLabel}</span>
                                            <span className="min-w-0 truncate text-right font-mono text-foreground">
                                                {poi.longitude.toFixed(6)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

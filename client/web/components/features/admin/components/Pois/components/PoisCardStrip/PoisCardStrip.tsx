"use client"

import { useRef, useEffect, type MouseEvent } from "react"
import { Image as ImageIcon } from "lucide-react"
import type { POI } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import { getSubCategoryLabel } from "@/lib/poi-utils"
import ActionCardScrip from "./ActionCardScrip"


interface POICardsStripProps {
    pois: POI[]
    selectedPoi?: POI | null
    adminUi: AdminPoisUi
    uiLanguage: string
    onRequestDelete: (poi: POI) => void
    onSelect: (poi: POI) => void
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

export function PoisCardStrip({ pois, selectedPoi, adminUi, uiLanguage, onRequestDelete, onSelect }: POICardsStripProps) {
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
                                    onSelect(poi)
                                }}
                            >
                                <ActionCardScrip 
                                    poi={poi} 
                                    adminUi={adminUi} 
                                    uiLanguage={uiLanguage} 
                                    distance={distance}
                                    onDelete={() => onRequestDelete(poi)}
                                />
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

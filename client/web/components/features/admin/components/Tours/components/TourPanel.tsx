"use client"

import { useMemo } from "react"
import {
    X,
    Pencil,
    MapPin,
    Calendar,
    Route,
    Clock,
    Timer,
    CheckCircle2,
    FileText,
    Navigation,
    Tag,
} from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
    formatFullDate,
    sortTourPois,
    getSubCategoryLabel,
    formatTime,
    getRelativeTime,
} from "@/lib/utils"
import { formatTourDurationVi, getMockTourDurationMinutes } from "./tour-format"

interface TourDetailPanelProps {
    tour: Tour
    allPois: POI[]
    getPoiName: (poiId: string) => string
    onEdit: () => void
    onClose: () => void
}

export function TourDetailPanel({
    tour,
    allPois,
    getPoiName,
    onEdit,
    onClose,
}: TourDetailPanelProps) {
    const sortedPois = useMemo(() => sortTourPois(tour.pois), [tour.pois])

    function getPoiDetails(poiId: string): POI | undefined {
        return allPois.find((p) => p.id === poiId)
    }

    const majorCount = sortedPois.filter((tp) => {
        const poi = getPoiDetails(tp.poiId)
        return poi?.category === "major"
    }).length

    const minorCount = sortedPois.length - majorCount

    const estimatedMinutes = useMemo(() => getMockTourDurationMinutes(tour), [tour])

    return (
        <div className="flex min-h-0 h-full flex-col">
            {/* Header */}
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                            <h2 className="truncate text-lg font-semibold text-foreground">{tour.name}</h2>
                            {tour.status === "published" ? (
                                <Badge className="shrink-0 gap-1 bg-success/10 text-success border-success/20 hover:bg-success/10">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Published
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="shrink-0 gap-1">
                                    <FileText className="h-3 w-3" />
                                    Draft
                                </Badge>
                            )}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tour.description}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="outline" onClick={onEdit} className="gap-1.5">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Meta info row */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Created {formatFullDate(tour.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Updated {getRelativeTime(tour.updatedAt)} at {formatTime(tour.updatedAt)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-3 px-6 py-5 sm:grid-cols-4 sm:gap-4">
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <Route className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Tổng điểm dừng</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-foreground">{sortedPois.length}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <Timer className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Thời lượng (ước lượng)</span>
                        </div>
                        <p className="mt-1 text-lg font-bold leading-tight text-foreground">
                            {formatTourDurationVi(estimatedMinutes)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <Navigation className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Điểm chính</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-primary">{majorCount}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Điểm phụ</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-muted-foreground">{minorCount}</p>
                    </div>
                </div>

                <Separator />

                {/* Route timeline */}
                <div className="px-6 py-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Route className="h-4 w-4 text-primary" />
                        Tour Route
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {sortedPois.length} stops in order of visit
                    </p>

                    <div className="relative mt-5">
                        {/* Vertical connector line */}
                        {sortedPois.length > 1 && (
                            <div className="absolute left-[19px] top-[24px] bottom-[24px] w-[2px] bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
                        )}

                        <div className="flex flex-col gap-0">
                            {sortedPois.map((tp, index) => {
                                const poi = getPoiDetails(tp.poiId)
                                const isFirst = index === 0
                                const isLast = index === sortedPois.length - 1
                                const isMajor = poi?.category === "major"

                                return (
                                    <div key={tp.poiId} className="group relative flex gap-4 pb-4 last:pb-0">
                                        {/* Step indicator */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div
                                                className={`flex items-center justify-center rounded-full shadow-sm ring-2 ring-background transition-transform group-hover:scale-110 ${isFirst
                                                    ? "h-10 w-10 bg-primary text-primary-foreground"
                                                    : isLast
                                                        ? "h-10 w-10 bg-primary/80 text-primary-foreground"
                                                        : isMajor
                                                            ? "h-9 w-9 bg-primary/70 text-primary-foreground"
                                                            : "h-8 w-8 bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {isFirst ? (
                                                    <Navigation className="h-4 w-4" />
                                                ) : isLast ? (
                                                    <MapPin className="h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs font-bold">{tp.order}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content card */}
                                        <div
                                            className={`flex-1 rounded-lg border p-3.5 transition-colors group-hover:border-primary/30 ${isFirst || isLast
                                                ? "border-primary/20 bg-primary/[0.03]"
                                                : "border-border bg-card"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {getPoiName(tp.poiId)}
                                                        </p>
                                                        {isFirst && (
                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30 bg-primary/5">
                                                                Start
                                                            </Badge>
                                                        )}
                                                        {isLast && sortedPois.length > 1 && (
                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30 bg-primary/5">
                                                                End
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {poi?.description && (
                                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                                            {poi.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    {poi && (
                                                        <Badge
                                                            variant={isMajor ? "default" : "outline"}
                                                            className={`text-[10px] px-1.5 py-0 ${isMajor ? "" : "text-muted-foreground"
                                                                }`}
                                                        >
                                                            {isMajor ? "Điểm chính" : getSubCategoryLabel(poi?.subCategory)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Coordinates */}
                                            {poi && (
                                                <div className="mt-2 flex items-center gap-3">
                                                    <span className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                                        <MapPin className="h-2.5 w-2.5" />
                                                        {poi.latitude.toFixed(5)}, {poi.longitude.toFixed(5)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

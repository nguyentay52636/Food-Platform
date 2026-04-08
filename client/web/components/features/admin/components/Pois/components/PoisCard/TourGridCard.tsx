"use client"

import {
    Route,
    Pencil,
    Trash2,
    MapPin,
    Eye,
    Clock,
    MoreHorizontal,
    Copy,
    ChevronRight,
} from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, getRelativeTime, countMajorPois, countMinorPois } from "@/lib/tour-utils"

interface TourGridCardProps {
    tour: Tour
    isSelected: boolean
    allPois: POI[]
    getPoiName: (id: string) => string
    onClick: () => void
    onEdit: () => void
    onDuplicate: () => void
    onDelete: () => void
}

export function TourGridCard({
    tour,
    isSelected,
    allPois,
    getPoiName,
    onClick,
    onEdit,
    onDuplicate,
    onDelete,
}: TourGridCardProps) {
    const majorCount = countMajorPois(tour, allPois)
    const minorCount = countMinorPois(tour, allPois)
    const isPublished = tour.status === "published"

    return (
        <Card
            className={`group cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary shadow-md" : "hover:border-primary/30"
                }`}
            onClick={onClick}
        >
            <CardContent className="p-0">
                {/* Card header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <StatusIcon status={tour.status} />
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-foreground">{tour.name}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <StatusBadge status={tour.status} />
                                <span className="text-[10px] text-muted-foreground">
                                    Updated {getRelativeTime(tour.updatedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <TourCardMenu
                        onView={onClick}
                        onEdit={onEdit}
                        onDuplicate={onDuplicate}
                        onDelete={onDelete}
                    />
                </div>

                {/* Description */}
                <p className="px-4 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {tour.description}
                </p>

                {/* Route preview */}
                <RoutePreview tour={tour} getPoiName={getPoiName} />

                <Separator className="mt-3" />

                {/* Footer stats */}
                <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                                {majorCount} điểm chính, {minorCount} điểm phụ
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(tour.createdAt)}</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs text-primary hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onClick()
                        }}
                    >
                        Details <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Sub-components

function StatusIcon({ status }: { status: "draft" | "published" }) {
    const isPublished = status === "published"
    return (
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isPublished ? "bg-success/10" : "bg-warning/10"
                }`}
        >
            <Route
                className={`h-4.5 w-4.5 ${isPublished ? "text-success" : "text-warning"}`}
            />
        </div>
    )
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
    return (
        <Badge
            variant={status === "published" ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0"
        >
            {status === "published" ? "Published" : "Draft"}
        </Badge>
    )
}

function RoutePreview({
    tour,
    getPoiName,
}: {
    tour: Tour
    getPoiName: (id: string) => string
}) {
    const sortedPois = [...tour.pois].sort((a, b) => a.order - b.order)
    const visiblePois = sortedPois.slice(0, 4)
    const remainingCount = tour.pois.length - 4

    return (
        <div className="mx-4 mt-3 flex items-center gap-1 overflow-hidden">
            {visiblePois.map((tp, i) => (
                <div key={tp.poiId} className="flex items-center gap-1 min-w-0">
                    {i > 0 && (
                        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className="truncate rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {getPoiName(tp.poiId)}
                    </span>
                </div>
            ))}
            {remainingCount > 0 && (
                <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    +{remainingCount} more
                </span>
            )}
        </div>
    )
}

function TourCardMenu({
    onView,
    onEdit,
    onDuplicate,
    onDelete,
}: {
    onView: () => void
    onEdit: () => void
    onDuplicate: () => void
    onDelete: () => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={onView}>
                    <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Tour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

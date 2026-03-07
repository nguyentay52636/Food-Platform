"use client"

import { X, Pencil, Trash2, Navigation } from "lucide-react"
import type { POI } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSubCategoryLabel, formatCoordinatesFull } from "@/lib/poi-utils"

interface POIMapInfoOverlayProps {
    poi: POI
    onEdit: () => void
    onDelete: () => void
    onClose: () => void
}

export function POIMapInfoOverlay({
    poi,
    onEdit,
    onDelete,
    onClose,
}: POIMapInfoOverlayProps) {
    return (
        <Card className="absolute bottom-4 left-4 z-[1000] w-80 overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">{poi.name}</h3>
                        <div className="mt-1 flex items-center gap-1.5">
                            <Badge
                                variant={poi.category === "major" ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {poi.category === "major" ? "Major" : getSubCategoryLabel(poi.subCategory)}
                            </Badge>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {poi.description && (
                    <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {poi.description}
                    </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Navigation className="h-3 w-3" />
                    <span className="font-mono">{formatCoordinatesFull(poi.latitude, poi.longitude)}</span>
                </div>
            </div>

            <div className="flex border-t border-border">
                <Button
                    variant="ghost"
                    className="flex-1 rounded-none text-xs h-10"
                    onClick={onEdit}
                >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                </Button>
                <div className="w-px bg-border" />
                <Button
                    variant="ghost"
                    className="flex-1 rounded-none text-xs h-10 text-destructive hover:text-destructive"
                    onClick={onDelete}
                >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                </Button>
            </div>
        </Card>
    )
}

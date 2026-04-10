import React from 'react'
import { MapPin, Star } from "lucide-react"
import type { POI } from "@/lib/types"

interface ActionCardScripProps {
    poi: POI
}

export default function ActionCardScrip({ poi }: ActionCardScripProps) {
    return (
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
        </div>
    )
}

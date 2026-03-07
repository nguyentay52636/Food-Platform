"use client"

import { Spinner } from "@/components/ui/spinner"

export function POILoadingState() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
                <Spinner className="h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">Loading POIs...</p>
            </div>
        </div>
    )
}

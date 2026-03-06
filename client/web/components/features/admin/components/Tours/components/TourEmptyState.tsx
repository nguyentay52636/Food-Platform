"use client"

import { Plus, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FilterStatus } from "@/components/features/admin/components/Tours/hooks/useTours"

interface TourEmptyStateProps {
    search: string
    filterStatus: FilterStatus
    onCreateClick: () => void
}

export function TourEmptyState({ search, filterStatus, onCreateClick }: TourEmptyStateProps) {
    const hasFilters = search || filterStatus !== "all"

    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Route className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
                {hasFilters ? "No matching tours" : "No tours yet"}
            </p>
            <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                {hasFilters
                    ? "Try adjusting your search or filter criteria."
                    : "Create your first tour to start building itineraries from your POIs."}
            </p>
            {!hasFilters && (
                <Button size="sm" onClick={onCreateClick} className="mt-4 gap-1.5">
                    <Plus className="h-4 w-4" /> Create Tour
                </Button>
            )}
        </div>
    )
}

export function TourDetailEmptyState() {
    return (
        <div className="flex h-full items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                    <Route className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No tour selected</p>
                <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                    Click on a tour from the list to view its route details and stops.
                </p>
            </div>
        </div>
    )
}

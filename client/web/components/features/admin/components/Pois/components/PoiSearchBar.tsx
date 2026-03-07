"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface POISearchBarProps {
    search: string
    onSearchChange: (value: string) => void
    resultCount: number
}

export function PoiSearchBar({ search, onSearchChange, resultCount }: POISearchBarProps) {
    return (
        <div className="border-b border-border px-5 py-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name, category, or description..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 pr-20"
                />
                {search && (
                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        <span className="text-xs text-muted-foreground">{resultCount} found</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onSearchChange("")}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

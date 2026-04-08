"use client"

import { MoreHorizontal, Pencil, Trash2, MapPin, Eye } from "lucide-react"
import type { POI } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { getSubCategoryLabel, formatCoordinates } from "@/lib/poi-utils"

interface POITableRowProps {
    poi: POI
    isSelected: boolean
    onSelect: (poi: POI) => void
    onEdit: (poi: POI) => void
    onDelete: (poi: POI) => void
    onViewOnMap: (poi: POI) => void
}

export function PoisTableRow({
    poi,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
    onViewOnMap,
}: POITableRowProps) {
    return (
        <TableRow
            className={`cursor-pointer transition-colors ${isSelected ? "bg-accent" : "hover:bg-muted/50"
                }`}
            onClick={() => onSelect(poi)}
        >
            <TableCell>
                <div className="flex items-start gap-3">
                    <div
                        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${poi.category === "major" ? "bg-primary" : "bg-muted-foreground"
                            }`}
                    />
                    <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{poi.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {poi.description || "No description"}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                    <Badge
                        variant={poi.category === "major" ? "default" : "secondary"}
                        className="text-xs"
                    >
                        {poi.category === "major" ? "Điểm chính" : getSubCategoryLabel(poi.subCategory)}
                    </Badge>
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <span className="font-mono text-xs text-muted-foreground">
                    {formatCoordinates(poi.latitude, poi.longitude)}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onViewOnMap(poi)
                            }}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View on Map
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(poi)
                            }}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit POI
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(poi)
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete POI
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

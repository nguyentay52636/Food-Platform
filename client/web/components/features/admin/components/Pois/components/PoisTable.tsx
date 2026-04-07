"use client"

import type { POI } from "@/lib/types"
import { Pencil, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getSubCategoryLabel, formatCoordinates } from "@/lib/poi-utils"

interface POITableProps {
    pois: POI[]
    selectedPoi?: POI | null
    onSelect: (poi: POI) => void
    onEdit: (poi: POI) => void
    onDelete: (poi: POI) => void
}

export function PoisTable({ pois, selectedPoi, onSelect, onEdit, onDelete }: POITableProps) {
    if (pois.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">No POIs found</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                    Create your first point of interest to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Loại điểm</TableHead>
                        <TableHead className="hidden md:table-cell">Coordinates</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pois.map((poi) => (
                        <TableRow
                            key={poi.id}
                            className={`cursor-pointer transition-colors ${selectedPoi?.id === poi.id
                                    ? "bg-accent"
                                    : "hover:bg-muted/50"
                                }`}
                            onClick={() => onSelect(poi)}
                        >
                            <TableCell>
                                <div>
                                    <p className="font-medium text-foreground">{poi.name}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                                        {poi.description}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <Badge
                                        variant={poi.category === "major" ? "default" : "secondary"}
                                        className="text-xs"
                                    >
                                        {poi.category === "major" ? "Điểm chính" : "Điểm nhỏ"}
                                    </Badge>
                                    {poi.subCategory && (
                                        <Badge variant="outline" className="text-xs">
                                            {getSubCategoryLabel(poi.subCategory)}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <span className="font-mono text-xs text-muted-foreground">
                                    {formatCoordinates(poi.latitude, poi.longitude)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEdit(poi)
                                        }}
                                        aria-label={`Edit ${poi.name}`}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(poi)
                                        }}
                                        aria-label={`Delete ${poi.name}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

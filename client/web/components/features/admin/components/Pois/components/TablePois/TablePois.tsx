import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, MapPin } from "lucide-react"
import type { POI } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface TablePoisProps {
    pois: POI[]
    onEdit: (poi: POI) => void
    onDelete: (poi: POI) => void
    onViewOnMap: (poi: POI) => void
}

export default function TablePois({ pois, onEdit, onDelete, onViewOnMap }: TablePoisProps) {
    return (
        <div className="rounded-md border bg-background h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Tên địa điểm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="hidden md:table-cell">Địa chỉ</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pois.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Không có dữ liệu địa điểm.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pois.map((poi) => (
                                <TableRow key={poi.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                                            {poi.imageUrl ? (
                                                <img
                                                    src={poi.imageUrl}
                                                    alt={poi.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{poi.name}</span>
                                            <span className="text-xs text-muted-foreground md:hidden">
                                                {poi.category === "major" ? "Chính" : "Phụ"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={poi.category === "major" ? "default" : "secondary"}>
                                            {poi.category === "major" ? "Chính" : "Phụ"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                        {poi.address || "Chưa có địa chỉ"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onViewOnMap(poi)}
                                                title="Xem trên bản đồ"
                                            >
                                                <MapPin className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(poi)}
                                                title="Sửa"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => onDelete(poi)}
                                                title="Xóa"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

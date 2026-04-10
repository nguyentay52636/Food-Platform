import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, MapPin, Mic } from "lucide-react"
import type { POI } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import DialogDetailAudio from "../PoisCardStrip/Dialog/DialogDetailAudio"

interface TablePoisProps {
    pois: POI[]
    adminUi: AdminPoisUi
    onEdit: (poi: POI) => void
    onDelete: (poi: POI) => void
    onViewOnMap: (poi: POI) => void
}

export default function TablePois({ pois, adminUi, onEdit, onDelete, onViewOnMap }: TablePoisProps) {
    const [audioPoi, setAudioPoi] = useState<POI | null>(null)

    return (
        <div className="rounded-md border bg-background h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Tên địa điểm</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="hidden lg:table-cell">Phạm vi</TableHead>
                            <TableHead className="hidden md:table-cell">Địa chỉ</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pois.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm">{poi.rangeTrigger ?? 50}m</span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                        {poi.address || "Chưa có địa chỉ"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setAudioPoi(poi)}
                                                title="Nghe mô tả"
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>
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

            {audioPoi && (
                <DialogDetailAudio 
                    open={!!audioPoi}
                    onOpenChange={(open) => !open && setAudioPoi(null)}
                    poi={audioPoi}
                    adminUi={adminUi}
                />
            )}
        </div>
    )
}

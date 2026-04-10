"use client"

import {
  Route,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  Clock,
  Timer,
  MoreHorizontal,
  Copy,
  ChevronRight,
} from "lucide-react"
import type { Tour } from "@/lib/types"
import { formatTourDurationVi, getTourDurationMinutes } from "./tour-format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface TourListRowProps {
  tour: Tour
  isSelected: boolean
  getRelativeTime: (d: string) => string
  isLast: boolean
  onClick: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function TourListRow({
  tour,
  isSelected,
  getRelativeTime,
  isLast,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
}: TourListRowProps) {
  return (
    <div
      className={`group flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors ${
        isSelected ? "border-l-2 border-l-primary bg-primary/5" : "hover:bg-muted/50"
      } ${!isLast ? "border-b border-border" : ""}`}
      onClick={onClick}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          tour.status === "published" ? "bg-success/10" : "bg-warning/10"
        }`}
      >
        <Route
          className={`h-4 w-4 ${tour.status === "published" ? "text-success" : "text-warning"}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{tour.name}</h3>
          <Badge
            variant={tour.status === "published" ? "default" : "secondary"}
            className="shrink-0 px-1.5 py-0 text-[10px]"
          >
            {tour.status}
          </Badge>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {tour.pois.length} điểm dừng
          </span>
          <span className="flex items-center gap-1 text-foreground/90">
            <Timer className="h-3 w-3 shrink-0" />
            {formatTourDurationVi(getTourDurationMinutes(tour))}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            Cập nhật {getRelativeTime(tour.updatedAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label={`Chỉnh sửa ${tour.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onClick}>
              <Eye className="mr-2 h-3.5 w-3.5" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-3.5 w-3.5" /> Nhân bản
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </div>
  )
}

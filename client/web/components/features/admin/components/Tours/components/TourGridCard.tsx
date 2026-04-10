"use client"

import Image from "next/image"
import {
  Route,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  Timer,
  Calendar,
  MoreHorizontal,
  Copy,
  ChevronRight,
} from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatTourDate,
  formatTourDurationVi,
  getTourDurationMinutes,
  getTourRelativeTime,
} from "./tour-format"
import { getTourCoverImage } from "./tour-helpers"

interface TourGridCardProps {
  tour: Tour
  isSelected: boolean
  allPois: POI[]
  getPoiName: (id: string) => string
  onPurchaseClick: () => void
  onDetailsClick: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function TourGridCard({
  tour,
  isSelected,
  allPois,
  getPoiName,
  onPurchaseClick,
  onDetailsClick,
  onEdit,
  onDuplicate,
  onDelete,
}: TourGridCardProps) {
  const majorPois = tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "major"
  })
  const minorPois = tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "minor"
  })

  const coverUrl = getTourCoverImage(tour, allPois)

  return (
    <Card
      className={`group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : "hover:border-primary/30"
      }`}
      onClick={onPurchaseClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[21/9] w-full bg-muted">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/60">
              <Route className="h-10 w-10 text-muted-foreground/35 sm:h-12 sm:w-12" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                tour.status === "published" ? "bg-success/10" : "bg-warning/10"
              }`}
            >
              <Route
                className={`h-4.5 w-4.5 ${
                  tour.status === "published" ? "text-success" : "text-warning"
                }`}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{tour.name}</h3>
              <div className="mt-0.5 flex items-center gap-2">
                <Badge
                  variant={tour.status === "published" ? "default" : "secondary"}
                  className="px-1.5 py-0 text-[10px]"
                >
                  {tour.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Cập nhật {getTourRelativeTime(tour.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onDetailsClick}>
                <Eye className="mr-2 h-3.5 w-3.5" /> Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Chỉnh sửa tour
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

        <p className="line-clamp-2 px-4 text-xs leading-relaxed text-muted-foreground">
          {tour.description}
        </p>

        <div className="mx-4 mt-3 flex items-center gap-1 overflow-hidden">
          {tour.pois
            .sort((a, b) => a.order - b.order)
            .slice(0, 4)
            .map((tp, i) => (
              <div key={tp.poiId} className="flex min-w-0 items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />}
                <span className="truncate rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {getPoiName(tp.poiId)}
                </span>
              </div>
            ))}
          {tour.pois.length > 4 && (
            <span className="shrink-0 text-[10px] text-muted-foreground/60">
              +{tour.pois.length - 4} more
            </span>
          )}
        </div>

        <Separator className="mt-3" />

        <div className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>
                <span className="font-medium text-foreground">{tour.pois.length} điểm</span>
                <span className="text-muted-foreground/80">
                  {" "}
                  ({majorPois.length} chính, {minorPois.length} phụ)
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
              <Timer className="h-3 w-3 shrink-0 text-primary" />
              <span>{formatTourDurationVi(getTourDurationMinutes(tour))}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span>Tạo {formatTourDate(tour.createdAt)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-primary hover:text-primary"
            onClick={(e) => {
              e.stopPropagation()
              onDetailsClick()
            }}
          >
            Chi tiết <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

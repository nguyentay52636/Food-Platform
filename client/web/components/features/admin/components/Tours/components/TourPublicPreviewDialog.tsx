"use client"

import Image from "next/image"
import { Calendar, CheckCircle2, Clock, FileText, MapPin, Pencil, Route, Timer, X } from "lucide-react"
import type { Tour, POI } from "@/lib/types"
import { formatFullDate, sortTourPois } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { getTourCoverImage } from "./tour-helpers"
import { formatTourDurationVi, getTourDurationMinutes } from "./tour-format"

interface TourPublicPreviewDialogProps {
  tour: Tour | null
  open: boolean
  onOpenChange: (open: boolean) => void
  allPois: POI[]
  getPoiName: (poiId: string) => string
  /** Mở form chỉnh sửa (admin). */
  onEdit?: (tour: Tour) => void
}

export function TourPublicPreviewDialog({
  tour,
  open,
  onOpenChange,
  allPois,
  getPoiName,
  onEdit,
}: TourPublicPreviewDialogProps) {
  if (!tour) return null

  const coverUrl = getTourCoverImage(tour, allPois)
  const ordered = sortTourPois(tour.pois)
  const durationMin = getTourDurationMinutes(tour)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(92vh,900px)] w-[min(96vw,920px)] flex-col gap-0 overflow-hidden border-0 p-0 sm:max-w-[920px]"
      >
        <div className="relative aspect-[21/9] w-full shrink-0 bg-muted">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96vw, 920px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200/90 to-slate-400/40 dark:from-slate-800/80 dark:to-slate-950/60">
              <Route className="h-16 w-16 text-muted-foreground/35 sm:h-20 sm:w-20" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full shadow-md"
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4 sm:px-6">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl font-bold leading-tight sm:text-2xl">{tour.name}</DialogTitle>
              {tour.status === "published" ? (
                <Badge className="gap-1 bg-success/15 text-success hover:bg-success/15">
                  <CheckCircle2 className="h-3 w-3" />
                  Đã xuất bản
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <FileText className="h-3 w-3" />
                  Bản nháp
                </Badge>
              )}
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {tour.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1.5 font-normal">
              <MapPin className="h-3.5 w-3.5" />
              {tour.pois.length} điểm dừng
            </Badge>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Timer className="h-3.5 w-3.5" />
              {formatTourDurationVi(durationMin)}
            </Badge>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Calendar className="h-3.5 w-3.5" />
              Tạo {formatFullDate(tour.createdAt)}
            </Badge>
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Clock className="h-3.5 w-3.5" />
              Cập nhật {formatFullDate(tour.updatedAt)}
            </Badge>
          </div>

          <Separator className="my-5" />

          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Route className="h-4 w-4 text-primary" />
              Lộ trình tham quan
            </h4>
            <ol className="space-y-2">
              {ordered.map((tp, index) => {
                const poi = allPois.find((p) => p.id === tp.poiId)
                return (
                  <li
                    key={`${tp.poiId}-${tp.order}`}
                    className="flex gap-3 rounded-lg border border-border/80 bg-card px-3 py-2.5 text-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{getPoiName(tp.poiId)}</p>
                      {poi?.address && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {poi.address}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <DialogFooter className="shrink-0 flex-row flex-wrap justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {onEdit && (
            <Button
              type="button"
              className="gap-2"
              onClick={() => {
                onEdit(tour)
                onOpenChange(false)
              }}
            >
              <Pencil className="h-4 w-4" />
              Chỉnh sửa tour
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

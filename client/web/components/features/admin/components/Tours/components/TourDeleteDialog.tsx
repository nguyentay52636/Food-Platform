"use client"

import type { Tour } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TourDeleteDialogProps {
  tour: Tour | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function TourDeleteDialog({ tour, onOpenChange, onConfirm }: TourDeleteDialogProps) {
  return (
    <AlertDialog open={!!tour} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tour</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa &quot;{tour?.name}&quot;? Hành động này không thể hoàn tác. Tour
            này có {tour?.pois.length ?? 0} điểm dừng POI sẽ bị gỡ liên kết.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

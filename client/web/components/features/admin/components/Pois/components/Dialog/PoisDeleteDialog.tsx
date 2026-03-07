"use client"

import type { POI } from "@/lib/types"
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

interface PoisDeleteDialogProps {
  poi: POI | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function PoisDeleteDialog({ poi, onClose, onConfirm }: PoisDeleteDialogProps) {
  return (
    <AlertDialog open={!!poi} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa điểm POI</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa &quot;{poi?.name}&quot;? Hành động này không thể hoàn tác.
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

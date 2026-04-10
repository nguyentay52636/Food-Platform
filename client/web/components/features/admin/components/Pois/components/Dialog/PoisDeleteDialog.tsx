"use client"

import type { POI } from "@/lib/types"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import { formatDeleteMessage } from "@/lib/admin-pois-i18n"
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
  deleteUi: AdminPoisUi["delete"]
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function PoisDeleteDialog({ poi, deleteUi, onClose, onConfirm }: PoisDeleteDialogProps) {
  return (
    <AlertDialog open={!!poi} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteUi.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {poi ? formatDeleteMessage(deleteUi.message, poi.name) : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{deleteUi.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUi.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

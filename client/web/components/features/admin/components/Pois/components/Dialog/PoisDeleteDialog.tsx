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
  warningMessage?: string
  backLabel?: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function PoisDeleteDialog({
  poi,
  deleteUi,
  warningMessage,
  backLabel,
  onClose,
  onConfirm,
}: PoisDeleteDialogProps) {
  return (
    <AlertDialog open={!!poi} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteUi.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {poi ? formatDeleteMessage(deleteUi.message, poi.name) : ""}
          </AlertDialogDescription>
          {warningMessage ? (
            <AlertDialogDescription className="mt-2 rounded-md bg-amber-100/70 px-3 py-2 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
              {warningMessage}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{backLabel ?? deleteUi.cancel}</AlertDialogCancel>
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

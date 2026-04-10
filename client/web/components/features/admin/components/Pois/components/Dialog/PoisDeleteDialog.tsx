"use client"

import type { POI } from "@/lib/types"
import type { LanguageCode } from "@/lib/client-types"
import { formatPoiDeleteDescription, getAdminPoisBundle } from "@/lib/i18n/admin-pois-i18n"
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
    uiLanguage: LanguageCode
    onClose: () => void
    onConfirm: () => Promise<void>
}

export function PoisDeleteDialog({ poi, uiLanguage, onClose, onConfirm }: PoisDeleteDialogProps) {
    const bundle = getAdminPoisBundle(uiLanguage)
    const t = bundle.delete
    const name = poi?.name ?? ""

    return (
        <AlertDialog open={!!poi} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t.title}</AlertDialogTitle>
                    <AlertDialogDescription>{formatPoiDeleteDescription(bundle, name)}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {t.confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

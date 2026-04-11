"use client"

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
import { Button } from "@/components/ui/button"
import type { ClientTour, LanguageCode } from "@/lib/client-types"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"
import Link from "next/link"

interface TourPaywallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetTour: ClientTour | null
  language: LanguageCode
  onConfirmPay: () => void
}

export function TourPaywallDialog({
  open,
  onOpenChange,
  targetTour,
  language,
  onConfirmPay,
}: TourPaywallDialogProps) {
  const tourName = useTranslatedText(targetTour?.name || { vi: "" }, language)
  
  // Custom quick translations for this dialog
  const title = useTranslatedUiText("Mua gói để mở tour", language, "vi")
  const descPrefix = useTranslatedUiText("Bạn đang chọn tour", language, "vi")
  const descSuffix = useTranslatedUiText("Để sử dụng tour này, bạn có thể mua gói dịch vụ hoặc xem chi tiết trước.", language, "vi")
  const cancelText = useTranslatedUiText("Để sau", language, "vi")
  const payText = useTranslatedUiText("Thanh toán", language, "vi")
  const detailsText = useTranslatedUiText("Chi tiết", language, "vi")

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {descPrefix} &quot;<strong>{tourName}</strong>&quot;. {descSuffix}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          {targetTour && (
            <Button variant="secondary" asChild>
              <Link href={`/tours/${targetTour.id}`}>{detailsText}</Link>
            </Button>
          )}
          <AlertDialogAction onClick={onConfirmPay}>
            {payText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

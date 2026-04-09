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
import type { TourPackageId } from "./tour-packages"
import { TOUR_PACKAGES } from "./tour-packages"
import { formatVnd } from "./tour-format"

interface TourPaywallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetTour: Tour | null
  selectedPackage: TourPackageId
  walletBalance: number
  onConfirmPay: () => void
}

export function TourPaywallDialog({
  open,
  onOpenChange,
  targetTour,
  selectedPackage,
  walletBalance,
  onConfirmPay,
}: TourPaywallDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mua gói để mở tour</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn đang chọn tour &quot;{targetTour?.name}&quot;. Để sử dụng tour này, bạn cần mua gói
            dịch vụ. Gói hiện chọn: <strong>{TOUR_PACKAGES[selectedPackage].name}</strong> (
            {formatVnd(TOUR_PACKAGES[selectedPackage].price)}). Số dư hiện tại:{" "}
            <strong>{formatVnd(walletBalance)}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Để sau</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmPay}>Thanh toán và mở tour</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

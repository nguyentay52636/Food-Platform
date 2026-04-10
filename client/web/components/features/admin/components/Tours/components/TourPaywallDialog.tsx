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
import { TOUR_PACKAGES } from "./tour-packages"
import { formatVnd } from "./tour-format"

interface TourPaywallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetTour: Tour | null
  /** Gói mặc định hiển thị. */
  selectedPackageId?: keyof typeof TOUR_PACKAGES
  onConfirmPay: () => void
}

export function TourPaywallDialog({
  open,
  onOpenChange,
  targetTour,
  selectedPackageId = "monthly",
  onConfirmPay,
}: TourPaywallDialogProps) {
  const pkg = TOUR_PACKAGES[selectedPackageId]
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mua gói để mở tour</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn đang chọn tour &quot;{targetTour?.name}&quot;. Để sử dụng tour này, bạn cần mua gói
            dịch vụ. Gói hiện chọn: <strong>{pkg.name}</strong> ({formatVnd(pkg.price)}).
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

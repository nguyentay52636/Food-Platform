export type TourPackageId = "monthly" | "quarterly"

export const TOUR_PACKAGES: Record<
  TourPackageId,
  { name: string; price: number; days: number }
> = {
  monthly: { name: "Gói tháng", price: 199000, days: 30 },
  quarterly: { name: "Gói quý", price: 499000, days: 90 },
}

export const TOUR_WALLET_BALANCE_KEY = "tour_wallet_balance_vnd"
export const TOUR_PACKAGE_EXPIRY_KEY = "tour_package_expiry"

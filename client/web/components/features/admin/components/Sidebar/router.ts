import type React from "react"
import { BarChart3, LayoutDashboard, MapPin } from "lucide-react"

export interface NavItem {
  name: string
  href: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

export const navigation = (pathname: string): NavItem[] => {
  const items = [
    { name: "Trang chủ", href: "/admin", icon: LayoutDashboard, path: "/admin" },
    { name: "Điểm đến", href: "/admin/pois", icon: MapPin, path: "/admin/pois" },
    { name: "Tour", href: "/admin/tours", icon: BarChart3, path: "/admin/tours" },
  ]
  return items.map((item) => ({
    ...item,
    current: pathname === item.path || (item.path !== "/admin" && pathname?.startsWith(item.path)),
  }))
}

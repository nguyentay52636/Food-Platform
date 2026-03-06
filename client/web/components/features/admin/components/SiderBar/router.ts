import { BarChart3, FileDiff, LayoutDashboard, MapPin, PackagePlus, Warehouse } from "lucide-react"

export const navigation = (pathname: string) => [
    {
        name: "Trang chủ",
        href: "/admin",
        icon: LayoutDashboard,
        path: "/admin",
    },
    {
        name: "Điểm đến",
        href: "/admin/pois",
        icon: MapPin,
        path: "/admin/pois",
    },
    {
        name: "Tour",
        href: "/admin/tours",
        icon: BarChart3,
        path: "/admin/tours",
    },
]
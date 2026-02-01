"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "./routes"
import { useTranslation } from "@/app/context/TranslationContext"

const translationMap: Record<string, string> = {
    "Trang chủ": "home",
    "Về chúng tôi": "about",
    "Khám phá": "explore",
    "Nhận diện món": "foodRecognition",
    "Bản đồ": "map",
    "Livestream": "livestream",
    "AR Preview": "arPreview",
    "Sự kiện": "events",
}

export function DesktopNav() {
    const pathname = usePathname()
    const { t } = useTranslation()
    return (
        <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const translationKey = translationMap[item.label] || item.label
                return (
                    <Button
                        key={item.href}
                        asChild
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                            "gap-2 h-10 px-4 transition-all duration-300",
                            isActive && "shadow-lg"
                        )}
                        size="sm"
                    >
                        <Link href={item.href}>
                            <Icon className="h-4 w-4" />
                            <span className="font-medium text-sm">{t(translationKey as any)}</span>
                        </Link>
                    </Button>
                )
            })}
            <Button
                asChild
                variant={pathname?.startsWith("/admin") ? "default" : "ghost"}
                className={cn(
                    "gap-2 h-10 px-4 transition-all duration-300 ml-2 border-al",
                    pathname?.startsWith("/admin") &&
                    "shadow-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                )}
                size="sm"
            >
                <Link href="/admin">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium text-sm">{t('admin')}</span>
                </Link>
            </Button>
        </nav>
    )
}


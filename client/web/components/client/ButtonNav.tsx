"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, Route, Settings } from "lucide-react"
import { useLanguage } from "@/lib/context/language-context"
import { cn } from "@/lib/utils"
import { useTranslatedUiText } from "@/lib/translation-utils"

const NAV_ITEMS = [
    { href: "/", icon: Map, labelKey: "explore" },
    { href: "/tours", icon: Route, labelKey: "tours" },
    { href: "/settings", icon: Settings, labelKey: "settings" },
] as const

export function BottomNav() {
    const pathname = usePathname()
    const { language } = useLanguage()
    const labels = {
        explore: useTranslatedUiText("Khám phá", language),
        tours: "Tour",
        settings: useTranslatedUiText("Cài đặt", language),
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around h-14">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/" || pathname.startsWith("/poi") || pathname.startsWith("/scan")
                            : pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 w-20 h-full transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                            <span className="text-[10px] font-medium">
                                {labels?.[item.labelKey] ?? item.labelKey}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

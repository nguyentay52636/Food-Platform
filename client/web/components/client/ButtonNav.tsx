"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, Route, Settings, Compass } from "lucide-react"
import { useLanguage } from "@/lib/context/language-context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { href: "/", icon: Map, labelKey: "explore" },
    { href: "/tours", icon: Route, labelKey: "tours" },
    { href: "/settings", icon: Settings, labelKey: "settings" },
] as const

const LABELS = {
    vi: {
        explore: "Khám phá",
        tours: "Tours",
        settings: "Cài đặt",
    },
    en: {
        explore: "Explore",
        tours: "Tours",
        settings: "Settings",
    },
    zh: {
        explore: "探索",
        tours: "游览",
        settings: "设置",
    },
    ja: {
        explore: "探検",
        tours: "ツアー",
        settings: "設定",
    },
}

export function BottomNav() {
    const pathname = usePathname()
    const { language } = useLanguage()
    const labels = LABELS[language]

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
                                {labels[item.labelKey as keyof typeof labels]}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

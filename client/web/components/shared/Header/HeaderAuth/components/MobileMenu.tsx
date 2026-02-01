"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, LogOut } from "lucide-react"
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

export function MobileMenu() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-11 w-11">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
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
                                    "justify-start gap-3 h-14 text-base",
                                    isActive && "shadow-lg"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <Link href={item.href}>
                                    <Icon className="h-5 w-5" />
                                    <span>{t(translationKey as any)}</span>
                                </Link>
                            </Button>
                        )
                    })}
                    <div className="border-t pt-4 mt-4">
                        <Button
                            asChild
                            variant={pathname?.startsWith("/admin") ? "default" : "ghost"}
                            className={cn(
                                "justify-start gap-3 h-14 w-full text-base",
                                pathname?.startsWith("/admin") &&
                                "bg-gradient-to-r from-orange-500 to-red-500"
                            )}
                        >
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                                <Shield className="h-5 w-5" />
                                <span>{t('admin')}</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="justify-start gap-3 h-14 w-full text-destructive text-base"
                        >
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <LogOut className="h-5 w-5" />
                                <span>{t('logout')}</span>
                            </Link>
                        </Button>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
}


"use client"

import Link from "next/link"
import { Navigation, QrCode, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/context/language-context"
import { SUPPORTED_LANGUAGES } from "@/lib/client-types"

interface ClientHeaderProps {
    showSearch?: boolean
    onSearchClick?: () => void
}

export function ClientHeader({ showSearch = true, onSearchClick }: ClientHeaderProps) {
    const { language, setLanguage, t } = useLanguage()

    const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language)
    const nextLang = SUPPORTED_LANGUAGES.find((l) => l.code !== language)

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                    <Navigation className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                    <h1 className="text-sm font-bold tracking-tight">{t.home.title}</h1>
                    <p className="text-[10px] text-muted-foreground">{t.home.subtitle}</p>
                </div>
            </Link>

            <div className="flex items-center gap-1">
                {showSearch && (
                    <Button variant="ghost" size="icon" onClick={onSearchClick} className="h-9 w-9">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                )}

                <Link href="/scan">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <QrCode className="h-5 w-5" />
                        <span className="sr-only">{t.home.scanQR}</span>
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => nextLang && setLanguage(nextLang.code)}
                >
                    <span className="text-lg">{currentLang?.flag}</span>
                    <span className="sr-only">{t.settings.language}</span>
                </Button>

                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">{t.settings.title}</span>
                    </Button>
                </Link>
            </div>
        </header>
    )
}

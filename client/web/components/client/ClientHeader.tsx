"use client"

import Link from "next/link"
import { UtensilsCrossed, QrCode, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/context/language-context"
import { SUPPORTED_LANGUAGES } from "@/lib/client-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslatedUiText } from "@/lib/translation-utils"

interface ClientHeaderProps {
    showSearch?: boolean
    onSearchClick?: () => void
}

export function ClientHeader({ showSearch = true, onSearchClick }: ClientHeaderProps) {
    const { language, setLanguage } = useLanguage()
    const homeTitle = useTranslatedUiText("Phố Ẩm Thực", language)
    const homeSubtitle = useTranslatedUiText("Vĩnh Khánh - Quận 4", language)
    const scanQrText = useTranslatedUiText("Quét QR", language)
    const settingsText = useTranslatedUiText("Cài đặt", language)

    const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language)

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                    <UtensilsCrossed className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-sm font-bold tracking-tight">{homeTitle}</h1>
                    <p className="text-[10px] text-muted-foreground">{homeSubtitle}</p>
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
                        <span className="sr-only">{scanQrText}</span>
                    </Button>
                </Link>

                <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                    <SelectTrigger className="h-9 min-w-[86px] px-2">
                        <SelectValue>
                            <span className="flex items-center gap-1.5 text-xs">
                                <span className="font-semibold uppercase">{currentLang?.code}</span>
                                <span className="font-medium">{currentLang?.nativeName || currentLang?.name}</span>
                            </span>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent align="end">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                <span className="flex items-center gap-2 text-xs">
                                    <span className="font-semibold uppercase">{lang.code}</span>
                                    <span>{lang.nativeName}</span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Link href="/settings">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">{settingsText}</span>
                    </Button>
                </Link>
            </div>
        </header>
    )
}

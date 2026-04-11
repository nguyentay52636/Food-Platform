"use client"
import React from 'react'

import Link from "next/link"
import { ArrowLeft, Globe, Info, Volume2, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/client/ButtonNav"
import { useLanguage } from "@/lib/context/language-context"
import { useTranslatedUiText } from "@/lib/translation-utils"
import { useLanguages } from "./hooks/useLanguage"
import { DeviceInfoSection } from "./DeviceInfoSection"

export default function Setting() {
    const { language, setLanguage } = useLanguage()
    const { languages, isLoading } = useLanguages()

    const settingsTitle = useTranslatedUiText("Cài đặt", language)
    const languageTitle = useTranslatedUiText("Ngôn ngữ", language)
    const aboutTitle = useTranslatedUiText("Về ứng dụng", language)
    const versionTitle = useTranslatedUiText("Phiên bản", language)
    const audioLabel = useTranslatedUiText("Audio", language, "en")
    const audioFutureLabel = useTranslatedUiText(
        "Audio playback settings will be available in future updates.",
        language,
        "en"
    )
    const developerLabel = useTranslatedUiText("Developer", language, "en")
    const creditsLabel = useTranslatedUiText(
        "Phố Ẩm Thực Vĩnh Khánh - Khám phá ẩm thực Sài Gòn",
        language
    )



    return (
        <>
            <div className="min-h-screen bg-background pb-20">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center gap-3 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="font-semibold">{settingsTitle}</h1>
                </header>

                <div className="p-4 space-y-6">
                    {/* Language Section */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <h2 className="font-medium text-sm">{languageTitle}</h2>
                        </div>

                        <Card className="divide-y divide-border overflow-hidden">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Đang tải ngôn ngữ...</p>
                                </div>
                            ) : languages.length > 0 ? (
                                languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="flex items-center justify-between w-full p-4 hover:bg-accent/50 transition-colors"
                                        onClick={() => setLanguage(lang.code as any)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <div className="text-left">
                                                <p className="font-medium text-sm">{lang.nativeName}</p>
                                                <p className="text-xs text-muted-foreground">{lang.name}</p>
                                            </div>
                                        </div>
                                        {language === lang.code && (
                                            <Check className="h-5 w-5 text-primary" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-sm text-muted-foreground">
                                    Không tìm thấy ngôn ngữ nào.
                                </div>
                            )}
                        </Card>
                    </section>

                    <DeviceInfoSection language={language} />

                    {/* Audio Settings */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Volume2 className="h-4 w-4 text-muted-foreground" />
                            <h2 className="font-medium text-sm">{audioLabel}</h2>
                        </div>

                        <Card className="p-4">
                            <p className="text-sm text-muted-foreground">
                                {audioFutureLabel}
                            </p>
                        </Card>
                    </section>

                    {/* About */}
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <h2 className="font-medium text-sm">{aboutTitle}</h2>
                        </div>

                        <Card className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{versionTitle}</span>
                                <span>1.0.0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{developerLabel}</span>
                                <span>Vinh Khanh Food Street</span>
                            </div>
                        </Card>
                    </section>

                    {/* Credits */}
                    <p className="text-center text-xs text-muted-foreground pt-4">
                        {creditsLabel}
                    </p>
                </div>

                {/* Bottom Navigation */}
                <BottomNav />
            </div>
        </>
    )
}


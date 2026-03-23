"use client"

import { LanguageProvider } from "@/lib/context/language-context"
import { AudioProvider } from "@/lib/context/audio-context"

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <AudioProvider>
                {children}
            </AudioProvider>
        </LanguageProvider>
    )
}

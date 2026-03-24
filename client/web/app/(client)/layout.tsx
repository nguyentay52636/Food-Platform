"use client"

import { LanguageProvider } from "@/lib/context/language-context"
import { AudioProvider } from "@/lib/context/audio-context"
import { VisitorSessionProvider } from "@/lib/context/visitor-session"

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <AudioProvider>
                <VisitorSessionProvider>
                    {children}
                </VisitorSessionProvider>
            </AudioProvider>
        </LanguageProvider>
    )
}

'use client'

import { TranslationProvider } from './TranslationContext'

export default function WrapTranslationProvider({ children }: { children: React.ReactNode }) {
    return <TranslationProvider>{children}</TranslationProvider>
}


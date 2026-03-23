"use client"

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react"
import type { LanguageCode, Translations } from "@/lib/client-types"
import { getTranslations } from "@/lib/i18n"

interface LanguageContextValue {
    language: LanguageCode
    setLanguage: (lang: LanguageCode) => void
    t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = "gps-tours-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("vi")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null
        if (stored && (stored === "vi" || stored === "en")) {
            setLanguageState(stored)
        }
    }, [])

    const setLanguage = useCallback((lang: LanguageCode) => {
        setLanguageState(lang)
        localStorage.setItem(STORAGE_KEY, lang)
    }, [])

    const t = getTranslations(language)

    if (!mounted) {
        return null
    }

    return (
        <LanguageContext.Provider value= {{ language, setLanguage, t }
}>
    { children }
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider")
    }
    return context
}

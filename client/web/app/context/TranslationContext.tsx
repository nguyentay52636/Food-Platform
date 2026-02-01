'use client'

import React, { createContext, useContext } from 'react'
import { useLanguageStore } from '@/stores/language-store'
import en from '@/app/locales/en.json'
import vi from '@/app/locales/vi.json'

const translations = { en, vi }

type TranslationKey = string

interface TranslationContextType {
    language: string
    t: (key: TranslationKey | string) => string | any
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
    const { language } = useLanguageStore()
    const t = (key: TranslationKey | string) => {
        const currentTranslations = translations[language as keyof typeof translations]
        if (typeof key === 'string' && key.includes('.')) {
            return getNestedValue(currentTranslations, key) ?? key
        }
        return (currentTranslations as any)[key] ?? key
    }

    return (
        <TranslationContext.Provider value={{ language, t }}>
            {children}
        </TranslationContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(TranslationContext)
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider')
    }
    return context
}


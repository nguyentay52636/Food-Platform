"use client"

import { useEffect, useState } from "react"
import type { LanguageCode, LocalizedText } from "@/lib/client-types"

const TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single"
const translationCache = new Map<string, string>()

function getSourceText(content: LocalizedText): string {
    return content.vi || content.en
}

function getSourceLanguage(content: LocalizedText): LanguageCode {
    return content.vi ? "vi" : "en"
}

async function translateText(text: string, source: LanguageCode, target: LanguageCode): Promise<string> {
    const cacheKey = `${source}:${target}:${text}`
    const cached = translationCache.get(cacheKey)
    if (cached) return cached

    const params = new URLSearchParams({
        client: "gtx",
        sl: source,
        tl: target,
        dt: "t",
        q: text,
    })

    const response = await fetch(`${TRANSLATE_ENDPOINT}?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Translate request failed")
    }

    const data = (await response.json()) as unknown[]
    const translated = Array.isArray(data?.[0])
        ? (data[0] as unknown[])
            .map((chunk) => (Array.isArray(chunk) ? String(chunk[0] ?? "") : ""))
            .join("")
        : text

    translationCache.set(cacheKey, translated || text)
    return translated || text
}

export function useTranslatedText(content: LocalizedText, language: LanguageCode): string {
    const directValue = content[language]
    const source = getSourceText(content)
    const sourceLang = getSourceLanguage(content)
    const key = `${sourceLang}:${language}:${source}`
    const [asyncTranslation, setAsyncTranslation] = useState<{ key: string; text: string } | null>(null)

    useEffect(() => {
        if (directValue) {
            return
        }
        if (language === sourceLang) {
            return
        }

        let cancelled = false

        translateText(source, sourceLang, language)
            .then((translated) => {
                if (!cancelled) setAsyncTranslation({ key, text: translated })
            })
            .catch(() => {
                if (!cancelled) setAsyncTranslation({ key, text: source })
            })

        return () => {
            cancelled = true
        }
    }, [directValue, key, language, source, sourceLang])

    if (directValue) return directValue
    if (asyncTranslation?.key === key) return asyncTranslation.text
    return source
}

export function useTranslatedUiText(
    text: string,
    language: LanguageCode,
    sourceLanguage: LanguageCode = "vi"
): string {
    const key = `${sourceLanguage}:${language}:${text}`
    const [asyncTranslation, setAsyncTranslation] = useState<{ key: string; text: string } | null>(null)

    useEffect(() => {
        if (!text || language === sourceLanguage) return

        let cancelled = false
        translateText(text, sourceLanguage, language)
            .then((translated) => {
                if (!cancelled) setAsyncTranslation({ key, text: translated })
            })
            .catch(() => {
                if (!cancelled) setAsyncTranslation({ key, text })
            })

        return () => {
            cancelled = true
        }
    }, [key, language, sourceLanguage, text])

    if (!text) return ""
    if (language === sourceLanguage) return text
    if (asyncTranslation?.key === key) return asyncTranslation.text
    return text
}

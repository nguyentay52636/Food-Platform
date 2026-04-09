"use client"
import { useState, useEffect } from 'react'
import { getAllLanguage, ILanguage } from '@/apis/languageApi'

export function useLanguages() {
    const [languages, setLanguages] = useState<ILanguage[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setIsLoading(true)
                const data = await getAllLanguage()
                setLanguages(data)
            } catch (error) {
                console.error("Failed to fetch languages:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchLanguages()
    }, [])

    return { languages, isLoading }
}

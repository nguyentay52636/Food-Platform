import { useState, useEffect, useCallback } from "react"
import { getAllLanguage, type ILanguage } from "@/apis/languageApi"

export const useLanguages = () => {
    const [languages, setLanguages] = useState<ILanguage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLanguages = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getAllLanguage()
            setLanguages(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch languages")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchLanguages()
    }, [fetchLanguages])

    return {
        languages,
        isLoading,
        error,
        refreshLanguages: fetchLanguages
    }
}

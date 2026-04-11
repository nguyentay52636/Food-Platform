import { useState, useCallback, useEffect } from "react"
import { getAllOwner, type IUser } from "@/apis/userApi"

export const useUser = () => {
    const [owners, setOwners] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchOwners = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getAllOwner()
            setOwners(data)
        } catch (err: any) {
            setError(err.message || "Failed to fetch owners")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOwners()
    }, [fetchOwners])

    return {
        owners,
        isLoading,
        error,
        refreshOwners: fetchOwners
    }
}

"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
    type ReactNode,
} from "react"
import { safeRandomUuid } from "@/lib/safe-crypto"

// ============================================
// TYPES & INTERFACES
// ============================================

export interface VisitorEvent {
    id: string
    type: "page_view" | "poi_view" | "audio_play" | "audio_complete" | "tour_view" | "share" | "directions"
    timestamp: string
    data: Record<string, unknown>
}

export interface DeviceInfo {
    userAgent: string
    platform: string
    language: string
    screenWidth: number
    screenHeight: number
    viewportWidth: number
    viewportHeight: number
    pixelRatio: number
    touchSupport: boolean
    connectionType?: string
}

export interface GeoLocation {
    latitude: number
    longitude: number
    accuracy: number
    timestamp: string
}

export interface VisitorSession {
    // Core identity
    id: string // UUID - anonymous visitor ID
    fingerprint: string // Browser fingerprint for cross-session tracking

    // Timestamps
    createdAt: string // First visit ever
    sessionStartedAt: string // Current session start
    lastActivityAt: string // Last action timestamp

    // Visit tracking
    totalVisits: number // Lifetime visits
    sessionPageViews: number // Current session page views

    // Content engagement
    viewedPOIs: Array<{
        poiId: string
        firstViewedAt: string
        lastViewedAt: string
        viewCount: number
        timeSpentSeconds: number
    }>

    playedAudios: Array<{
        poiId: string
        languageCode: string
        startedAt: string
        completedAt?: string
        listenDurationSeconds: number
        completed: boolean
    }>

    viewedTours: Array<{
        tourId: string
        firstViewedAt: string
        lastViewedAt: string
        viewCount: number
    }>

    // Entry & Attribution
    entrySource: "direct" | "qr_code" | "shared_link" | "search"
    entryPOIId?: string
    entryTourId?: string
    referrer?: string
    utmParams?: {
        source?: string
        medium?: string
        campaign?: string
        content?: string
    }

    // Preferences
    preferredLanguage: string

    // Device & Location
    deviceInfo: DeviceInfo
    location?: GeoLocation

    // Events log (last 100 events)
    events: VisitorEvent[]
}

interface VisitorContextType {
    session: VisitorSession | null
    isLoading: boolean

    // Page tracking
    trackPageView: (page: string, data?: Record<string, unknown>) => void

    // POI tracking
    trackPOIView: (poiId: string) => void
    trackPOITimeSpent: (poiId: string, seconds: number) => void

    // Audio tracking
    trackAudioPlay: (poiId: string, languageCode: string) => void
    trackAudioProgress: (poiId: string, seconds: number) => void
    trackAudioComplete: (poiId: string) => void

    // Tour tracking
    trackTourView: (tourId: string) => void

    // Actions tracking
    trackShare: (contentType: "poi" | "tour", contentId: string) => void
    trackDirections: (poiId: string) => void

    // Entry source
    setEntrySource: (source: VisitorSession["entrySource"], contentId?: string) => void

    // Location
    updateLocation: (location: GeoLocation) => void

    // Analytics getters
    getStats: () => SessionStats
    getEngagementScore: () => number

    // Session management
    clearSession: () => void
    exportSession: () => string
}

export interface SessionStats {
    totalPOIsViewed: number
    uniquePOIsViewed: number
    totalAudiosPlayed: number
    audiosCompleted: number
    totalToursViewed: number
    totalTimeSpentSeconds: number
    sessionDurationMinutes: number
    avgTimePerPOISeconds: number
    engagementScore: number
}

// ============================================
// CONSTANTS
// ============================================

const SESSION_KEY = "vk_visitor_session_v2"
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const MAX_EVENTS = 100
const SYNC_INTERVAL_MS = 60 * 1000 // Sync to server every 60s

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateUUID(): string {
    return safeRandomUuid()
}

function generateFingerprint(): string {
    if (typeof window === "undefined") return generateUUID()

    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 0,
        // @ts-expect-error - deviceMemory is not in all browsers
        navigator.deviceMemory || 0,
    ]

    const str = components.join("|")
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(36) + "-" + Date.now().toString(36)
}

function getDeviceInfo(): DeviceInfo {
    if (typeof window === "undefined") {
        return {
            userAgent: "",
            platform: "",
            language: "vi",
            screenWidth: 0,
            screenHeight: 0,
            viewportWidth: 0,
            viewportHeight: 0,
            pixelRatio: 1,
            touchSupport: false,
        }
    }

    // @ts-expect-error - connection is not in all browsers
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        connectionType: connection?.effectiveType,
    }
}

function parseUTMParams(): VisitorSession["utmParams"] | undefined {
    if (typeof window === "undefined") return undefined

    const params = new URLSearchParams(window.location.search)
    const utm: VisitorSession["utmParams"] = {}

    if (params.get("utm_source")) utm.source = params.get("utm_source")!
    if (params.get("utm_medium")) utm.medium = params.get("utm_medium")!
    if (params.get("utm_campaign")) utm.campaign = params.get("utm_campaign")!
    if (params.get("utm_content")) utm.content = params.get("utm_content")!

    return Object.keys(utm).length > 0 ? utm : undefined
}

function createNewSession(): VisitorSession {
    const now = new Date().toISOString()

    return {
        id: generateUUID(),
        fingerprint: generateFingerprint(),
        createdAt: now,
        sessionStartedAt: now,
        lastActivityAt: now,
        totalVisits: 1,
        sessionPageViews: 0,
        viewedPOIs: [],
        playedAudios: [],
        viewedTours: [],
        entrySource: "direct",
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
        utmParams: parseUTMParams(),
        preferredLanguage: typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "vi",
        deviceInfo: getDeviceInfo(),
        events: [],
    }
}

function isSessionExpired(session: VisitorSession): boolean {
    const lastActivity = new Date(session.lastActivityAt).getTime()
    const now = Date.now()
    return now - lastActivity > SESSION_TIMEOUT_MS
}

// ============================================
// CONTEXT
// ============================================

const VisitorContext = createContext<VisitorContextType | undefined>(undefined)

// ============================================
// PROVIDER COMPONENT
// ============================================

export function VisitorSessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<VisitorSession | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const pageViewStartRef = useRef<number>(Date.now())

    // Initialize session
    useEffect(() => {
        initializeSession()

        // Track page visibility for time spent
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page hidden - save time spent
                const timeSpent = Math.round((Date.now() - pageViewStartRef.current) / 1000)
                if (timeSpent > 0) {
                    // Could track this per page
                }
            } else {
                pageViewStartRef.current = Date.now()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Cleanup
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current)
            }
        }
    }, [])

    // Auto-sync to server periodically
    useEffect(() => {
        if (!session) return

        const syncToServer = async () => {
            try {
                // In production, send to analytics endpoint
                // await fetch("/api/analytics/session", {
                //   method: "POST",
                //   headers: { "Content-Type": "application/json" },
                //   body: JSON.stringify(session),
                // })
            } catch {
                // Silently fail, data is still in localStorage
            }
        }

        syncTimeoutRef.current = setInterval(syncToServer, SYNC_INTERVAL_MS)

        return () => {
            if (syncTimeoutRef.current) {
                clearInterval(syncTimeoutRef.current)
            }
        }
    }, [session])

    const initializeSession = () => {
        try {
            const stored = localStorage.getItem(SESSION_KEY)

            if (stored) {
                const existingSession: VisitorSession = JSON.parse(stored)

                if (isSessionExpired(existingSession)) {
                    // Start new session but keep visitor identity
                    const newSession: VisitorSession = {
                        ...createNewSession(),
                        id: existingSession.id, // Keep same visitor ID
                        fingerprint: existingSession.fingerprint,
                        createdAt: existingSession.createdAt, // Keep original creation date
                        totalVisits: existingSession.totalVisits + 1,
                        viewedPOIs: existingSession.viewedPOIs, // Keep history
                        playedAudios: existingSession.playedAudios,
                        viewedTours: existingSession.viewedTours,
                        preferredLanguage: existingSession.preferredLanguage,
                    }
                    saveSession(newSession)
                } else {
                    // Continue existing session
                    const updatedSession: VisitorSession = {
                        ...existingSession,
                        lastActivityAt: new Date().toISOString(),
                        deviceInfo: getDeviceInfo(), // Update device info
                    }
                    saveSession(updatedSession)
                }
            } else {
                // First time visitor
                const newSession = createNewSession()
                saveSession(newSession)
            }
        } catch {
            // Fallback to in-memory session
            const newSession = createNewSession()
            setSession(newSession)
        }

        setIsLoading(false)
    }

    const saveSession = useCallback((updatedSession: VisitorSession) => {
        setSession(updatedSession)
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
        } catch {
            // Storage full or disabled
        }
    }, [])

    const addEvent = useCallback((
        type: VisitorEvent["type"],
        data: Record<string, unknown> = {}
    ) => {
        setSession((prev) => {
            if (!prev) return prev

            const event: VisitorEvent = {
                id: generateUUID(),
                type,
                timestamp: new Date().toISOString(),
                data,
            }

            const events = [...prev.events, event].slice(-MAX_EVENTS)

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: new Date().toISOString(),
                events,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })
    }, [])

    // ============================================
    // TRACKING METHODS
    // ============================================

    const trackPageView = useCallback((page: string, data?: Record<string, unknown>) => {
        pageViewStartRef.current = Date.now()

        setSession((prev) => {
            if (!prev) return prev

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: new Date().toISOString(),
                sessionPageViews: prev.sessionPageViews + 1,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })

        addEvent("page_view", { page, ...data })
    }, [addEvent])

    const trackPOIView = useCallback((poiId: string) => {
        setSession((prev) => {
            if (!prev) return prev

            const now = new Date().toISOString()
            const existingIndex = prev.viewedPOIs.findIndex((p) => p.poiId === poiId)

            let viewedPOIs: VisitorSession["viewedPOIs"]

            if (existingIndex >= 0) {
                viewedPOIs = [...prev.viewedPOIs]
                viewedPOIs[existingIndex] = {
                    ...viewedPOIs[existingIndex],
                    lastViewedAt: now,
                    viewCount: viewedPOIs[existingIndex].viewCount + 1,
                }
            } else {
                viewedPOIs = [
                    ...prev.viewedPOIs,
                    {
                        poiId,
                        firstViewedAt: now,
                        lastViewedAt: now,
                        viewCount: 1,
                        timeSpentSeconds: 0,
                    },
                ]
            }

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: now,
                viewedPOIs,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })

        addEvent("poi_view", { poiId })
    }, [addEvent])

    const trackPOITimeSpent = useCallback((poiId: string, seconds: number) => {
        setSession((prev) => {
            if (!prev) return prev

            const existingIndex = prev.viewedPOIs.findIndex((p) => p.poiId === poiId)
            if (existingIndex < 0) return prev

            const viewedPOIs = [...prev.viewedPOIs]
            viewedPOIs[existingIndex] = {
                ...viewedPOIs[existingIndex],
                timeSpentSeconds: viewedPOIs[existingIndex].timeSpentSeconds + seconds,
            }

            const updated: VisitorSession = {
                ...prev,
                viewedPOIs,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })
    }, [])

    const trackAudioPlay = useCallback((poiId: string, languageCode: string) => {
        setSession((prev) => {
            if (!prev) return prev

            const now = new Date().toISOString()

            // Check if already tracking this audio
            const existingIndex = prev.playedAudios.findIndex(
                (a) => a.poiId === poiId && a.languageCode === languageCode && !a.completed
            )

            if (existingIndex >= 0) return prev // Already tracking

            const playedAudios: VisitorSession["playedAudios"] = [
                ...prev.playedAudios,
                {
                    poiId,
                    languageCode,
                    startedAt: now,
                    listenDurationSeconds: 0,
                    completed: false,
                },
            ]

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: now,
                playedAudios,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })

        addEvent("audio_play", { poiId, languageCode })
    }, [addEvent])

    const trackAudioProgress = useCallback((poiId: string, seconds: number) => {
        setSession((prev) => {
            if (!prev) return prev

            const existingIndex = prev.playedAudios.findIndex(
                (a) => a.poiId === poiId && !a.completed
            )

            if (existingIndex < 0) return prev

            const playedAudios = [...prev.playedAudios]
            playedAudios[existingIndex] = {
                ...playedAudios[existingIndex],
                listenDurationSeconds: seconds,
            }

            const updated: VisitorSession = {
                ...prev,
                playedAudios,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })
    }, [])

    const trackAudioComplete = useCallback((poiId: string) => {
        setSession((prev) => {
            if (!prev) return prev

            const now = new Date().toISOString()
            const existingIndex = prev.playedAudios.findIndex(
                (a) => a.poiId === poiId && !a.completed
            )

            if (existingIndex < 0) return prev

            const playedAudios = [...prev.playedAudios]
            playedAudios[existingIndex] = {
                ...playedAudios[existingIndex],
                completedAt: now,
                completed: true,
            }

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: now,
                playedAudios,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })

        addEvent("audio_complete", { poiId })
    }, [addEvent])

    const trackTourView = useCallback((tourId: string) => {
        setSession((prev) => {
            if (!prev) return prev

            const now = new Date().toISOString()
            const existingIndex = prev.viewedTours.findIndex((t) => t.tourId === tourId)

            let viewedTours: VisitorSession["viewedTours"]

            if (existingIndex >= 0) {
                viewedTours = [...prev.viewedTours]
                viewedTours[existingIndex] = {
                    ...viewedTours[existingIndex],
                    lastViewedAt: now,
                    viewCount: viewedTours[existingIndex].viewCount + 1,
                }
            } else {
                viewedTours = [
                    ...prev.viewedTours,
                    {
                        tourId,
                        firstViewedAt: now,
                        lastViewedAt: now,
                        viewCount: 1,
                    },
                ]
            }

            const updated: VisitorSession = {
                ...prev,
                lastActivityAt: now,
                viewedTours,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })

        addEvent("tour_view", { tourId })
    }, [addEvent])

    const trackShare = useCallback((contentType: "poi" | "tour", contentId: string) => {
        addEvent("share", { contentType, contentId })
    }, [addEvent])

    const trackDirections = useCallback((poiId: string) => {
        addEvent("directions", { poiId })
    }, [addEvent])

    const setEntrySource = useCallback((
        source: VisitorSession["entrySource"],
        contentId?: string
    ) => {
        setSession((prev) => {
            if (!prev) return prev

            const updated: VisitorSession = {
                ...prev,
                entrySource: source,
                entryPOIId: source === "qr_code" && contentId?.startsWith("poi") ? contentId : undefined,
                entryTourId: source === "qr_code" && contentId?.startsWith("tour") ? contentId : undefined,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })
    }, [])

    const updateLocation = useCallback((location: GeoLocation) => {
        setSession((prev) => {
            if (!prev) return prev

            const updated: VisitorSession = {
                ...prev,
                location,
            }

            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
            } catch {
                // Ignore
            }

            return updated
        })
    }, [])

    // ============================================
    // ANALYTICS GETTERS
    // ============================================

    const getStats = useCallback((): SessionStats => {
        if (!session) {
            return {
                totalPOIsViewed: 0,
                uniquePOIsViewed: 0,
                totalAudiosPlayed: 0,
                audiosCompleted: 0,
                totalToursViewed: 0,
                totalTimeSpentSeconds: 0,
                sessionDurationMinutes: 0,
                avgTimePerPOISeconds: 0,
                engagementScore: 0,
            }
        }

        const totalPOIsViewed = session.viewedPOIs.reduce((sum, p) => sum + p.viewCount, 0)
        const uniquePOIsViewed = session.viewedPOIs.length
        const totalAudiosPlayed = session.playedAudios.length
        const audiosCompleted = session.playedAudios.filter((a) => a.completed).length
        const totalToursViewed = session.viewedTours.reduce((sum, t) => sum + t.viewCount, 0)
        const totalTimeSpentSeconds = session.viewedPOIs.reduce((sum, p) => sum + p.timeSpentSeconds, 0)

        const sessionStart = new Date(session.sessionStartedAt).getTime()
        const lastActivity = new Date(session.lastActivityAt).getTime()
        const sessionDurationMinutes = Math.round((lastActivity - sessionStart) / 1000 / 60)

        const avgTimePerPOISeconds = uniquePOIsViewed > 0
            ? Math.round(totalTimeSpentSeconds / uniquePOIsViewed)
            : 0

        // Engagement score (0-100)
        const engagementScore = Math.min(100, Math.round(
            (uniquePOIsViewed * 10) +
            (audiosCompleted * 20) +
            (totalToursViewed * 15) +
            Math.min(sessionDurationMinutes * 2, 20)
        ))

        return {
            totalPOIsViewed,
            uniquePOIsViewed,
            totalAudiosPlayed,
            audiosCompleted,
            totalToursViewed,
            totalTimeSpentSeconds,
            sessionDurationMinutes,
            avgTimePerPOISeconds,
            engagementScore,
        }
    }, [session])

    const getEngagementScore = useCallback((): number => {
        return getStats().engagementScore
    }, [getStats])

    const clearSession = useCallback(() => {
        try {
            localStorage.removeItem(SESSION_KEY)
        } catch {
            // Ignore
        }
        setSession(createNewSession())
    }, [])

    const exportSession = useCallback((): string => {
        return JSON.stringify(session, null, 2)
    }, [session])

    // ============================================
    // RENDER
    // ============================================

    return (
        <VisitorContext.Provider
            value={{
                session,
                isLoading,
                trackPageView,
                trackPOIView,
                trackPOITimeSpent,
                trackAudioPlay,
                trackAudioProgress,
                trackAudioComplete,
                trackTourView,
                trackShare,
                trackDirections,
                setEntrySource,
                updateLocation,
                getStats,
                getEngagementScore,
                clearSession,
                exportSession,
            }}
        >
            {children}
        </VisitorContext.Provider>
    )
}

// ============================================
// HOOK
// ============================================

export function useVisitorSession() {
    const context = useContext(VisitorContext)
    if (context === undefined) {
        throw new Error("useVisitorSession must be used within a VisitorSessionProvider")
    }
    return context
}

// ============================================
// UTILITY HOOK - Track POI view with time spent
// ============================================

export function usePOIViewTracking(poiId: string | null) {
    const { trackPOIView, trackPOITimeSpent } = useVisitorSession()
    const startTimeRef = useRef<number>(0)
    const trackedRef = useRef<string | null>(null)

    useEffect(() => {
        if (!poiId) return

        // Only track if not already tracked this POI in this mount
        if (trackedRef.current !== poiId) {
            trackPOIView(poiId)
            trackedRef.current = poiId
        }

        startTimeRef.current = Date.now()

        return () => {
            if (startTimeRef.current > 0) {
                const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
                if (seconds > 0) {
                    trackPOITimeSpent(poiId, seconds)
                }
            }
        }
    }, [poiId, trackPOIView, trackPOITimeSpent])
}

// ============================================
// UTILITY HOOK - Track audio with progress
// ============================================

export function useAudioTracking(poiId: string | null, languageCode: string) {
    const { trackAudioPlay, trackAudioProgress, trackAudioComplete } = useVisitorSession()
    const hasStartedRef = useRef(false)

    const onPlay = useCallback(() => {
        if (!poiId || hasStartedRef.current) return
        trackAudioPlay(poiId, languageCode)
        hasStartedRef.current = true
    }, [poiId, languageCode, trackAudioPlay])

    const onProgress = useCallback((seconds: number) => {
        if (!poiId) return
        trackAudioProgress(poiId, seconds)
    }, [poiId, trackAudioProgress])

    const onComplete = useCallback(() => {
        if (!poiId) return
        trackAudioComplete(poiId)
        hasStartedRef.current = false
    }, [poiId, trackAudioComplete])

    return useMemo(
        () => ({ onPlay, onProgress, onComplete }),
        [onPlay, onProgress, onComplete]
    )
}

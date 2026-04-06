// Client-side types for GPS Tours User App

export type LanguageCode = "vi" | "en" | "zh" | "ja"

export interface Language {
    code: LanguageCode
    name: string
    nativeName: string
    flag: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
]

export interface AudioContent {
    languageCode: LanguageCode
    audioUrl: string
    duration: number // in seconds
    transcript?: string
}

export interface ClientPOI {
    id: string
    name: Record<LanguageCode, string>
    description: Record<LanguageCode, string>
    category: "major" | "minor"
    subCategory?: "wc" | "ticket" | "parking" | "dock"
    latitude: number
    longitude: number
    images: string[]
    address?: string
    rating?: number
    reviewCount?: number
    audio: Partial<Record<LanguageCode, AudioContent>>
}

export interface ClientTour {
    id: string
    name: Record<LanguageCode, string>
    description: Record<LanguageCode, string>
    pois: { poiId: string; order: number }[]
    estimatedDuration: number // in minutes
    distance: number // in km
    coverImage?: string
}

export interface AudioPlayerState {
    isPlaying: boolean
    isLoading: boolean
    currentTime: number
    duration: number
    playbackRate: number
    currentPOI: ClientPOI | null
}

// Translations
export interface Translations {
    common: {
        loading: string
        error: string
        retry: string
        close: string
        back: string
        next: string
        previous: string
    }
    home: {
        title: string
        subtitle: string
        searchPlaceholder: string
        nearbyLocations: string
        favoriteLocations: string
        noFavoritesYet: string
        viewAll: string
        scanQR: string
    }
    poi: {
        directions: string
        playAudio: string
        pauseAudio: string
        stopAudio: string
        relatedLocations: string
        noAudio: string
        audioLanguage: string
        viewDetail: string
        locateOnMap: string
    }
    settings: {
        title: string
        language: string
        selectLanguage: string
        about: string
        version: string
    }
    qr: {
        title: string
        instructions: string
        skip: string
        invalidQR: string
    }
}

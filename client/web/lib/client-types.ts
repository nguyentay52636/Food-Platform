// Client-side types for GPS Tours User App

export type LanguageCode =
    | "vi"
    | "en"
    | "zh"
    | "ja"
    | "ko"
    | "fr"
    | "de"
    | "es"
    | "it"
    | "pt"
    | "ru"
    | "ar"
    | "hi"
    | "th"
    | "id"
    | "ms"
    | "tr"
    | "nl"
    | "pl"
    | "sv"

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
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
    { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
    { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
]

export type LocalizedText = Partial<Record<LanguageCode, string>> & { en: string; vi?: string }

export interface AudioContent {
    languageCode: LanguageCode
    audioUrl: string
    duration: number // in seconds
    transcript?: string
}

export interface ClientPOI {
    id: string
    name: LocalizedText
    description: LocalizedText
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
    name: LocalizedText
    description: LocalizedText
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

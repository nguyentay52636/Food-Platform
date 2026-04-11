"use client"

import {
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
    type ReactNode,
} from "react"
import type { ClientPOI, LanguageCode } from "@/lib/client-types"

/** TTS length estimate: CJK reads slower per character than Latin scripts. */
function estimateTtsDurationSeconds(text: string, language: LanguageCode): number {
    const len = text.trim().length
    if (len < 1) return 12
    const cjk: LanguageCode[] = ["zh", "ja", "ko"]
    const cps = cjk.includes(language) ? 3.2 : language === "vi" ? 9 : 10.5
    return Math.max(12, Math.ceil(len / cps))
}

function voiceMatchesLangTag(voice: SpeechSynthesisVoice, langTag: string): boolean {
    const v = voice.lang.toLowerCase().replace(/_/g, "-")
    const u = langTag.toLowerCase().replace(/_/g, "-")
    return v === u || v.startsWith(u.slice(0, 2)) || u.startsWith(v.slice(0, 2))
}

interface AudioContextValue {
    isPlaying: boolean
    isLoading: boolean
    currentTime: number
    duration: number
    playbackRate: number
    currentPOI: ClientPOI | null
    currentLanguage: LanguageCode
    play: (poi: ClientPOI, language: LanguageCode, fallbackText?: string) => void
    pause: () => void
    resume: () => void
    stop: () => void
    seekTo: (time: number) => void
    skipForward: (seconds?: number) => void
    skipBackward: (seconds?: number) => void
    setPlaybackRate: (rate: number) => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackRate, setPlaybackRateState] = useState(1)
    const [currentPOI, setCurrentPOI] = useState<ClientPOI | null>(null)
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("vi")
    const lastNarrationTextRef = useRef<string | null>(null)
    const currentPOIRef = useRef<ClientPOI | null>(null)
    const currentLanguageRef = useRef<LanguageCode>("vi")

    // Handle simulated time for SpeechSynthesis
    const synthTimerRef = useRef<NodeJS.Timeout | null>(null)

    const getLangTag = useCallback((lang: LanguageCode): string => {
        const langMap: Partial<Record<LanguageCode, string>> = {
            vi: "vi-VN",
            en: "en-US",
            zh: "zh-CN",
            ja: "ja-JP",
            ko: "ko-KR",
            fr: "fr-FR",
            de: "de-DE",
            es: "es-ES",
            it: "it-IT",
            pt: "pt-PT",
            ru: "ru-RU",
            ar: "ar-SA",
            hi: "hi-IN",
            th: "th-TH",
            id: "id-ID",
            ms: "ms-MY",
            tr: "tr-TR",
            nl: "nl-NL",
            pl: "pl-PL",
            sv: "sv-SE",
        }
        return langMap[lang] || "en-US"
    }, [])

    const pickVoiceForLanguage = useCallback((langTag: string): SpeechSynthesisVoice | null => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return null
        const voices = window.speechSynthesis.getVoices()
        if (!voices.length) return null

        const normalizedLangTag = langTag.toLowerCase()
        const langPrefix = normalizedLangTag.slice(0, 2)

        // Prefer exact locale first, then same language family.
        // Do NOT fallback to default voice from another language (causes wrong pronunciation).
        return (
            voices.find((v) => v.lang.toLowerCase() === normalizedLangTag)
            || voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix))
            || null
        )
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return
        const synth = window.speechSynthesis
        const primeVoices = () => {
            synth.getVoices()
        }
        primeVoices()
        synth.addEventListener("voiceschanged", primeVoices)
        return () => synth.removeEventListener("voiceschanged", primeVoices)
    }, [])

    const speakText = useCallback((text: string, language: LanguageCode) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return
        window.speechSynthesis.cancel()
        clearSynthTimer()

        const utterance = new SpeechSynthesisUtterance(text)
        const langTag = getLangTag(language)
        utterance.lang = langTag
        const preferredVoice = pickVoiceForLanguage(langTag)
        if (preferredVoice && voiceMatchesLangTag(preferredVoice, langTag)) {
            utterance.voice = preferredVoice
        }
        utterance.rate = playbackRate

        const estDuration = estimateTtsDurationSeconds(text, language)
        setDuration(estDuration)
        setCurrentTime(0)

        utterance.onstart = () => {
            setIsPlaying(true)
            startSynthTimer(estDuration)
        }
        utterance.onend = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            clearSynthTimer()
        }
        utterance.onerror = (ev) => {
            const code = (ev as SpeechSynthesisErrorEvent).error
            if (code === "interrupted" || code === "canceled") return
            setIsPlaying(false)
            clearSynthTimer()
        }

        window.speechSynthesis.speak(utterance)
    }, [getLangTag, pickVoiceForLanguage, playbackRate])

    useEffect(() => {
        currentPOIRef.current = currentPOI
    }, [currentPOI])

    useEffect(() => {
        currentLanguageRef.current = currentLanguage
    }, [currentLanguage])

    useEffect(() => {
        audioRef.current = new Audio()
        const audio = audioRef.current

        audio.addEventListener("loadstart", () => setIsLoading(true))
        audio.addEventListener("canplay", () => setIsLoading(false))
        audio.addEventListener("play", () => setIsPlaying(true))
        audio.addEventListener("pause", () => setIsPlaying(false))
        audio.addEventListener("ended", () => {
            setIsPlaying(false)
            setCurrentTime(0)
        })
        audio.addEventListener("timeupdate", () => {
            setCurrentTime(audio.currentTime)
        })
        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration || 0)
        })
        audio.addEventListener("error", () => {
            // Avoid crashing overlay and gracefully fallback to TTS for current language.
            const fallback = lastNarrationTextRef.current
                || currentPOIRef.current?.audio[currentLanguageRef.current]?.transcript
                || currentPOIRef.current?.description[currentLanguageRef.current]
                || currentPOIRef.current?.description.en
                || ""
            setIsLoading(false)
            setIsPlaying(false)
            if (fallback) {
                speakText(fallback, currentLanguageRef.current)
            }
        })

        return () => {
            audio.pause()
            audio.src = ""
            if (synthTimerRef.current) clearInterval(synthTimerRef.current)
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel()
            }
        }
    }, [speakText])

    const clearSynthTimer = () => {
        if (synthTimerRef.current) {
            clearInterval(synthTimerRef.current)
            synthTimerRef.current = null
        }
    }

    const startSynthTimer = (totalDuration: number) => {
        clearSynthTimer()
        synthTimerRef.current = setInterval(() => {
            setCurrentTime((prev) => {
                const next = Math.min(prev + 1, totalDuration)
                if (next >= totalDuration) {
                    clearSynthTimer()
                }
                return next
            })
        }, 1000)
    }

    const play = useCallback((poi: ClientPOI, language: LanguageCode, fallbackText?: string) => {
        const audioContent = poi.audio[language]
        const ttsText = fallbackText || audioContent?.transcript
        if (!audioContent && !ttsText) return

        setCurrentPOI(poi)
        setCurrentLanguage(language)
        lastNarrationTextRef.current = ttsText || null
        setCurrentTime(0)

        // Native Browser Text-to-Speech (Perfect for Food narration in multiple languages)
        if (typeof window !== "undefined" && "speechSynthesis" in window && ttsText) {
            // Stop any existing audio or speech
            audioRef.current?.pause()
            window.speechSynthesis.cancel()
            clearSynthTimer()

            const utterance = new SpeechSynthesisUtterance(ttsText)
            const langTag = getLangTag(language)
            utterance.lang = langTag
            const preferredVoice = pickVoiceForLanguage(langTag)
            if (preferredVoice && voiceMatchesLangTag(preferredVoice, langTag)) {
                utterance.voice = preferredVoice
            }
            utterance.rate = playbackRate

            const estDuration = estimateTtsDurationSeconds(ttsText, language)
            setDuration(estDuration)

            utterance.onstart = () => {
                setIsPlaying(true)
                startSynthTimer(estDuration)
            }
            utterance.onend = () => {
                setIsPlaying(false)
                setCurrentTime(0)
                clearSynthTimer()
            }
            utterance.onerror = (ev) => {
                const code = (ev as SpeechSynthesisErrorEvent).error
                if (code === "interrupted" || code === "canceled") return
                setIsPlaying(false)
                clearSynthTimer()
            }

            window.speechSynthesis.speak(utterance)
            return
        }

        const audio = audioRef.current
        if (!audio) return
        if (!audioContent) return
        
        window.speechSynthesis?.cancel()
        clearSynthTimer()
        
        audio.src = audioContent.audioUrl
        audio.playbackRate = playbackRate
        audio.play().catch(() => {
            setIsPlaying(false)
        })
    }, [getLangTag, pickVoiceForLanguage, playbackRate])

    const pause = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause()
            clearSynthTimer()
            setIsPlaying(false)
        } else {
            audioRef.current?.pause()
        }
    }, [])

    const resume = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.paused) {
            window.speechSynthesis.resume()
            setIsPlaying(true)
            startSynthTimer(duration) // Resumes timer roughly
        } else {
            audioRef.current?.play().catch(() => {
                setIsPlaying(false)
            })
        }
    }, [duration])

    const stop = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            clearSynthTimer()
        }
        const audio = audioRef.current
        if (audio) {
            audio.pause()
            audio.currentTime = 0
            if (isFinite(audio.currentTime)) audio.currentTime = 0;
        }
        setIsPlaying(false)
        setCurrentPOI(null)
        setCurrentTime(0)
    }, [])

    const seekTo = useCallback((time: number) => {
        if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
            // SpeechSynthesis doesn't natively support byte-seeking, so we just update the visual timer state.
            setCurrentTime(Math.max(0, Math.min(time, duration)))
            return
        }
        const audio = audioRef.current
        if (!audio || !isFinite(audio.duration)) return
        audio.currentTime = Math.max(0, Math.min(time, audio.duration))
    }, [duration])

    const skipForward = useCallback((seconds = 15) => {
        const audio = audioRef.current
        if (!audio || !isFinite(audio.currentTime) || !isFinite(audio.duration)) return
        audio.currentTime = Math.min(audio.currentTime + seconds, audio.duration)
    }, [])

    const skipBackward = useCallback((seconds = 15) => {
        const audio = audioRef.current
        if (!audio || !isFinite(audio.currentTime)) return
        audio.currentTime = Math.max(audio.currentTime - seconds, 0)
    }, [])

    const setPlaybackRateStateSafe = useCallback((rate: number) => {
        const audio = audioRef.current
        if (audio) audio.playbackRate = rate
        setPlaybackRateState(rate)
    }, [])

    return (
        <AudioContext.Provider
      value= {{
        isPlaying,
            isLoading,
            currentTime,
            duration,
            playbackRate,
            currentPOI,
            currentLanguage,
            play,
            pause,
            resume,
            stop,
            seekTo,
            skipForward,
            skipBackward,
            setPlaybackRate: setPlaybackRateStateSafe,
      }
}
    >
    { children }
    </AudioContext.Provider>
  )
}

export function useAudio() {
    const context = useContext(AudioContext)
    if (!context) {
        throw new Error("useAudio must be used within AudioProvider")
    }
    return context
}

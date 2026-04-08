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

    const speakText = useCallback((text: string, language: LanguageCode) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return
        window.speechSynthesis.cancel()
        clearSynthTimer()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = getLangTag(language)
        utterance.rate = playbackRate

        const estDuration = Math.ceil(text.length / 14)
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
        utterance.onerror = () => {
            setIsPlaying(false)
            clearSynthTimer()
        }

        window.speechSynthesis.speak(utterance)
    }, [getLangTag, playbackRate])

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
                || currentPOI?.audio[currentLanguage]?.transcript
                || currentPOI?.description[currentLanguage]
                || currentPOI?.description.en
                || ""
            setIsLoading(false)
            setIsPlaying(false)
            if (fallback) {
                speakText(fallback, currentLanguage)
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
    }, [currentLanguage, currentPOI, speakText])

    const clearSynthTimer = () => {
        if (synthTimerRef.current) {
            clearInterval(synthTimerRef.current)
            synthTimerRef.current = null
        }
    }

    const startSynthTimer = (totalDuration: number) => {
        clearSynthTimer()
        synthTimerRef.current = setInterval(() => {
            setCurrentTime(prev => {
                if (prev >= totalDuration) {
                    clearSynthTimer()
                    setIsPlaying(false)
                    return 0
                }
                return prev + 1
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
            utterance.lang = getLangTag(language)
            utterance.rate = playbackRate
            
            // Artificial duration estimation (roughly 14 chars per second)
            const estDuration = Math.ceil(ttsText.length / 14)
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
            utterance.onerror = (e) => {
                console.error("SpeechSynthesis error:", e)
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
        audio.play().catch(e => {
            console.error("Audio API playback error:", e)
            setIsPlaying(false)
        })
    }, [getLangTag, playbackRate])

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
            audioRef.current?.play().catch(console.error)
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

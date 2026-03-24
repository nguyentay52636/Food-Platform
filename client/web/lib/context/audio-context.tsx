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
    play: (poi: ClientPOI, language: LanguageCode) => void
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

    // Handle simulated time for SpeechSynthesis
    const synthTimerRef = useRef<NodeJS.Timeout | null>(null)

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
        audio.addEventListener("error", (e) => {
            console.error("Audio block error, likely CORS or invalid audio element source.", e)
            setIsLoading(false)
            setIsPlaying(false)
        })

        return () => {
            audio.pause()
            audio.src = ""
            if (synthTimerRef.current) clearInterval(synthTimerRef.current)
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

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

    const play = useCallback((poi: ClientPOI, language: LanguageCode) => {
        const audioContent = poi.audio[language]
        if (!audioContent) return

        setCurrentPOI(poi)
        setCurrentLanguage(language)
        setCurrentTime(0)

        // Native Browser Text-to-Speech (Perfect for Food narration in multiple languages)
        if (typeof window !== "undefined" && "speechSynthesis" in window && audioContent.transcript) {
            // Stop any existing audio or speech
            audioRef.current?.pause()
            window.speechSynthesis.cancel()
            clearSynthTimer()

            const utterance = new SpeechSynthesisUtterance(audioContent.transcript)
            // Map LanguageCode to full language tags
            const langMap: Record<LanguageCode, string> = { vi: "vi-VN", en: "en-US", zh: "zh-CN", ja: "ja-JP" }
            utterance.lang = langMap[language] || "en-US"
            utterance.rate = playbackRate
            
            // Artificial duration estimation (roughly 14 chars per second)
            const estDuration = Math.ceil(audioContent.transcript.length / 14)
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
        
        window.speechSynthesis?.cancel()
        clearSynthTimer()
        
        audio.src = audioContent.audioUrl
        audio.playbackRate = playbackRate
        audio.play().catch(e => {
            console.error("Audio API playback error:", e)
            setIsPlaying(false)
        })
    }, [playbackRate])

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

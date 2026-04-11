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

function normVoiceLang(lang: string): string {
    return lang.trim().toLowerCase().replace(/_/g, "-")
}

/** First subtag, normalized (vie → vi for Vietnamese ISO variants). */
function primaryFromBcp47(lang: string): string {
    const p = normVoiceLang(lang).split("-")[0] || ""
    if (p === "vie") return "vi"
    if (p === "zho") return "zh"
    return p
}

/** Never match on empty `voice.lang` — `"".startsWith("")` would wrongly accept default English. */
function voiceMatchesPrimaryTag(voice: SpeechSynthesisVoice, langTag: string): boolean {
    const raw = voice.lang?.trim()
    if (!raw) return false
    return primaryFromBcp47(raw) === primaryFromBcp47(langTag)
}

function isProbablyEnglishVoice(v: SpeechSynthesisVoice): boolean {
    const lang = normVoiceLang(v.lang || "")
    if (/^en(-|$)/.test(lang)) return true
    const n = (v.name || "").toLowerCase()
    return /english|united states|british|australia|irish|scottish|\bzira\b|\bdavid\b|\bmark\b|\bjenny\b|\bsamantha\b|\balex\b|\bfred\b|\bvictoria\b|\bdaniel\b|\bkate\b|\bserena\b|\bgeorge\b|\bus english\b|\buk english\b/i.test(
        n
    )
}

/** Heuristic picker: some engines use non‑BCP47 `lang` or only the name exposes "Vietnamese". */
function pickVietnameseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const candidates = voices.filter((v) => {
        if (isProbablyEnglishVoice(v)) return false
        const lang = normVoiceLang(v.lang || "")
        const blob = `${v.name} ${v.lang}`.toLowerCase()
        if (/^vi(-|$)|^vie(-|$)/.test(lang)) return true
        if (/vietnamese|viet nam|vietnam|tiếng việt|tieng viet|\(vietnam\)|\(vi\)|\bvi\b.*\bviet/i.test(blob)) return true
        if (/\bhoai\b|\bmai\b|\blan\b|\bminh\b|\buyen\b|\bquyen\b|\bnguyen\b/i.test(blob) && /microsoft|google|samsung|android/i.test(blob)) return true
        return false
    })
    if (candidates.length === 0) return null
    const score = (v: SpeechSynthesisVoice) => {
        let s = 0
        const lang = normVoiceLang(v.lang || "")
        const n = `${v.name} ${lang}`.toLowerCase()
        if (/^vi(-|$)|^vie(-|$)/.test(lang)) s += 12
        if (/vietnamese|vietnam|tiếng|tieng/.test(n)) s += 6
        if (/google|microsoft|premium|enhanced|natural/i.test(n)) s += 2
        return s
    }
    return [...candidates].sort((a, b) => score(b) - score(a))[0]
}

function pickVoiceForLanguage(langTag: string): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return null

    if (primaryFromBcp47(langTag) === "vi") {
        const vi = pickVietnameseVoice(voices)
        if (vi) return vi
    }

    const withLang = voices.filter((v) => v.lang?.trim())
    if (!withLang.length) return null

    const targetNorm = normVoiceLang(langTag)
    const targetPrimary = primaryFromBcp47(langTag)

    const exact = withLang.find((v) => normVoiceLang(v.lang) === targetNorm)
    if (exact) return exact

    const family = withLang.filter((v) => primaryFromBcp47(v.lang) === targetPrimary)
    return family[0] || null
}

/** Chrome/Chromium often returns an empty voice list until `voiceschanged` or a short delay. */
function whenVoicesReady(run: () => void): void {
    const synth = window.speechSynthesis
    if (synth.getVoices().length > 0) {
        queueMicrotask(run)
        return
    }
    let done = false
    const finish = () => {
        if (done) return
        done = true
        synth.removeEventListener("voiceschanged", onVoices)
        run()
    }
    const onVoices = () => {
        if (synth.getVoices().length > 0) finish()
    }
    synth.addEventListener("voiceschanged", onVoices)
    try {
        synth.getVoices()
    } catch {
        /* ignore */
    }
    window.setTimeout(finish, 650)
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

    const synthTimerRef = useRef<NodeJS.Timeout | null>(null)
    const googleViBlobUrlRef = useRef<string | null>(null)

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

    const speakWithBrowserSynth = useCallback((text: string, language: LanguageCode) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return
        window.speechSynthesis.cancel()
        clearSynthTimer()

        const langTag = getLangTag(language)
        const estDuration = estimateTtsDurationSeconds(text, language)
        setDuration(estDuration)
        setCurrentTime(0)

        const bindUtterance = (u: SpeechSynthesisUtterance) => {
            u.rate = playbackRate
            u.onstart = () => {
                setIsPlaying(true)
                startSynthTimer(estDuration)
            }
            u.onend = () => {
                setIsPlaying(false)
                setCurrentTime(0)
                clearSynthTimer()
            }
            u.onerror = (ev) => {
                const code = (ev as SpeechSynthesisErrorEvent).error
                if (code === "interrupted" || code === "canceled") return
                setIsPlaying(false)
                clearSynthTimer()
            }
        }

        whenVoicesReady(() => {
            const utterance = new SpeechSynthesisUtterance(text)
            const preferredVoice = pickVoiceForLanguage(langTag)
            if (preferredVoice && voiceMatchesPrimaryTag(preferredVoice, langTag)) {
                utterance.voice = preferredVoice
                utterance.lang = normVoiceLang(preferredVoice.lang)
            } else if (primaryFromBcp47(langTag) === "vi") {
                utterance.lang = "vi"
            } else {
                utterance.lang = langTag
            }
            bindUtterance(utterance)
            window.speechSynthesis.speak(utterance)
        })
    }, [getLangTag, playbackRate])

    const tryPlayGoogleTranslateVi = useCallback(async (text: string): Promise<boolean> => {
        const audio = audioRef.current
        if (!audio || !text.trim()) return false
        window.speechSynthesis?.cancel()
        clearSynthTimer()
        try {
            setIsLoading(true)
            const res = await fetch("/api/tts/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, tl: "vi" }),
            })
            if (!res.ok) throw new Error("tts_http")
            const blob = await res.blob()
            if (blob.size < 64) throw new Error("tts_empty")
            if (googleViBlobUrlRef.current) {
                URL.revokeObjectURL(googleViBlobUrlRef.current)
                googleViBlobUrlRef.current = null
            }
            const url = URL.createObjectURL(blob)
            googleViBlobUrlRef.current = url
            audio.pause()
            audio.src = url
            audio.playbackRate = playbackRate
            await new Promise<void>((resolve, reject) => {
                const ok = () => {
                    audio.removeEventListener("canplay", ok)
                    audio.removeEventListener("error", bad)
                    resolve()
                }
                const bad = () => {
                    audio.removeEventListener("canplay", ok)
                    audio.removeEventListener("error", bad)
                    reject(new Error("audio_load"))
                }
                audio.addEventListener("canplay", ok, { once: true })
                audio.addEventListener("error", bad, { once: true })
            })
            const d = audio.duration
            setDuration(Number.isFinite(d) && d > 0 ? d : 0)
            setCurrentTime(0)
            setIsLoading(false)
            await audio.play()
            return true
        } catch {
            setIsLoading(false)
            return false
        }
    }, [playbackRate])

    const speakText = useCallback(
        (text: string, language: LanguageCode, opts?: { skipGoogleVi?: boolean }) => {
            if (!text) return
            if (language === "vi" && !opts?.skipGoogleVi) {
                void (async () => {
                    const ok = await tryPlayGoogleTranslateVi(text)
                    if (!ok && typeof window !== "undefined" && "speechSynthesis" in window) {
                        speakWithBrowserSynth(text, language)
                    }
                })()
                return
            }
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                speakWithBrowserSynth(text, language)
            }
        },
        [tryPlayGoogleTranslateVi, speakWithBrowserSynth]
    )

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
            if (googleViBlobUrlRef.current) {
                URL.revokeObjectURL(googleViBlobUrlRef.current)
                googleViBlobUrlRef.current = null
            }
        }
    }, [speakText])

    const play = useCallback((poi: ClientPOI, language: LanguageCode, fallbackText?: string) => {
        const audioContent = poi.audio[language]
        const ttsText = fallbackText || audioContent?.transcript
        if (!audioContent && !ttsText) return

        setCurrentPOI(poi)
        setCurrentLanguage(language)
        lastNarrationTextRef.current = ttsText || null
        setCurrentTime(0)

        // TTS: Vietnamese uses Google Translate–style voice (female) via server proxy; others use browser synth.
        if (ttsText) {
            audioRef.current?.pause()
            window.speechSynthesis?.cancel()
            clearSynthTimer()

            if (language === "vi") {
                void (async () => {
                    const ok = await tryPlayGoogleTranslateVi(ttsText)
                    if (!ok && typeof window !== "undefined" && "speechSynthesis" in window) {
                        speakWithBrowserSynth(ttsText, language)
                    }
                })()
                return
            }

            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                speakWithBrowserSynth(ttsText, language)
                return
            }
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
    }, [getLangTag, playbackRate, speakWithBrowserSynth, tryPlayGoogleTranslateVi])

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
        if (googleViBlobUrlRef.current) {
            URL.revokeObjectURL(googleViBlobUrlRef.current)
            googleViBlobUrlRef.current = null
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

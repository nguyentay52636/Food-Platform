"use client"

import { Play, Pause, RotateCcw, RotateCw, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAudio } from "@/lib/context/audio-context"
import { useLanguage } from "@/lib/context/language-context"

import { SUPPORTED_LANGUAGES, type ClientPOI, type LanguageCode } from "@/lib/client-types"


interface AudioPlayerProps {
    poi: ClientPOI
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function AudioPlayer({ poi }: AudioPlayerProps) {
    const { language, t } = useLanguage()
    const {
        isPlaying,
        isLoading,
        currentTime,
        duration,
        playbackRate,
        currentPOI,
        play,
        pause,
        resume,
        seekTo,
        skipForward,
        skipBackward,
        setPlaybackRate,
    } = useAudio()

    const audioContent = poi.audio[language]
    const isCurrentPOI = currentPOI?.id === poi.id
    const availableLanguages = SUPPORTED_LANGUAGES.filter(
        (lang) => poi.audio[lang.code]
    )

    if (!audioContent && availableLanguages.length === 0) {
        return (
            <Card className="p-4 text-center text-muted-foreground">
                <Volume2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t.poi.noAudio}</p>
            </Card>
        )
    }

    const handlePlayPause = () => {
        if (isCurrentPOI && isPlaying) {
            pause()
        } else if (isCurrentPOI) {
            resume()
        } else {
            const langToPlay = audioContent ? language : availableLanguages[0].code
            play(poi, langToPlay)
        }
    }

    const handleSeek = (value: number[]) => {
        seekTo(value[0])
    }

    const handleLanguageChange = (langCode: LanguageCode) => {
        play(poi, langCode)
    }

    const progress = isCurrentPOI && duration > 0 ? currentTime : 0
    const totalDuration = isCurrentPOI ? duration : (audioContent?.duration || 0)

    return (
        <Card className="p-4 bg-card/50 backdrop-blur">
            {/* Language selector */}
            {availableLanguages.length > 1 && (
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                    <span className="text-xs text-muted-foreground">{t.poi.audioLanguage}</span>
                    <div className="flex gap-1">
                        {availableLanguages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant={
                                    isCurrentPOI && language === lang.code ? "default" : "outline"
                                }
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleLanguageChange(lang.code)}
                            >
                                <span className="mr-1">{lang.flag}</span>
                                {lang.nativeName}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Progress bar */}
            <div className="mb-4">
                <Slider
                    value={[progress]}
                    min={0}
                    max={totalDuration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    disabled={!isCurrentPOI}
                    className="cursor-pointer"
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(totalDuration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
                {/* Skip back */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => skipBackward(15)}
                    disabled={!isCurrentPOI}
                >
                    <RotateCcw className="h-5 w-5" />
                    <span className="sr-only">-15s</span>
                </Button>

                {/* Play/Pause */}
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={handlePlayPause}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : isCurrentPOI && isPlaying ? (
                        <Pause className="h-7 w-7" />
                    ) : (
                        <Play className="h-7 w-7 ml-1" />
                    )}
                </Button>

                {/* Skip forward */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => skipForward(15)}
                    disabled={!isCurrentPOI}
                >
                    <RotateCw className="h-5 w-5" />
                    <span className="sr-only">+15s</span>
                </Button>

                {/* Playback speed */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-2 text-xs h-8 px-2">
                            {playbackRate}x
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {PLAYBACK_RATES.map((rate) => (
                            <DropdownMenuItem
                                key={rate}
                                onClick={() => setPlaybackRate(rate)}
                                className={playbackRate === rate ? "bg-accent" : ""}
                            >
                                {rate}x
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    )
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

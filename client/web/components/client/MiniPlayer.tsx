"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, Pause, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useAudio } from "@/lib/context/audio-context"
import { useLanguage } from "@/lib/context/language-context"
import { cn } from "@/lib/utils"
import { Progress } from "../ui/progress"

interface MiniPlayerProps {
    className?: string
}

export function MiniPlayer({ className }: MiniPlayerProps) {
    const { language } = useLanguage()
    const {
        isPlaying,
        currentTime,
        duration,
        currentPOI,
        pause,
        resume,
        stop,
    } = useAudio()

    if (!currentPOI) return null

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0
    const name = currentPOI.name[language] || currentPOI.name.en
    const image = currentPOI.images[0]

    return (
        <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg", className)}>
            <Progress value={progress} className="h-1 rounded-none" />

            <div className="flex items-center gap-3 p-3">
                <Link href={`/explore/poi/${currentPOI.id}`} className="shrink-0">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        {image ? (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </Link>

                <Link href={`/explore/poi/${currentPOI.id}`} className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                </Link>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={isPlaying ? pause : resume}
                    >
                        {isPlaying ? (
                            <Pause className="h-5 w-5" />
                        ) : (
                            <Play className="h-5 w-5" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-muted-foreground"
                        onClick={stop}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

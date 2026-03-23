"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Headphones, Navigation, Eye, X, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { ClientPOI, LanguageCode, Translations } from "@/lib/client-types"
import { useAudio } from "@/lib/context/audio-context"

interface POIPreviewDialogProps {
    poi: ClientPOI | null
    language: LanguageCode
    open: boolean
    onOpenChange: (open: boolean) => void
    t: Translations
}

export function POIPreviewDialog({
    poi,
    language,
    open,
    onOpenChange,
    t,
}: POIPreviewDialogProps) {
    const audio = useAudio()

    if (!poi) return null

    const name = poi.name[language] || poi.name.en
    const description = poi.description[language] || poi.description.en
    const image = poi.images[0]
    const hasAudio = !!poi.audio[language]

    const handlePlayAudio = () => {
        if (audio.currentPOI?.id === poi.id && audio.isPlaying) {
            audio.pause()
        } else if (audio.currentPOI?.id === poi.id) {
            audio.resume()
        } else {
            audio.play(poi, language)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                {/* Image Header */}
                <div className="relative h-48 w-full bg-muted">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 448px) 100vw, 448px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}

                    {/* Category Badge */}
                    <Badge
                        variant={poi.category === "major" ? "default" : "secondary"}
                        className="absolute top-3 left-3"
                    >
                        {poi.category === "major" ? "Major" : poi.subCategory || "Minor"}
                    </Badge>

                    {/* Audio indicator */}
                    {hasAudio && (
                        <div className="absolute top-3 right-3 rounded-full bg-primary p-2 shadow-lg">
                            <Headphones className="h-4 w-4 text-primary-foreground" />
                        </div>
                    )}

                    {/* Close button */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur"
                        onClick={() => onOpenChange(false)}
                        style={{ display: hasAudio ? "none" : "flex" }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between gap-3">
                        <DialogHeader className="p-0 space-y-0">
                            <DialogTitle className="text-lg font-semibold text-left">
                                {name}
                            </DialogTitle>
                        </DialogHeader>
                        {poi.rating && (
                            <div className="flex items-center gap-1 shrink-0">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">{poi.rating}</span>
                                {poi.reviewCount && (
                                    <span className="text-xs text-muted-foreground">
                                        ({poi.reviewCount.toLocaleString()})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    {poi.address && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{poi.address}</span>
                        </div>
                    )}

                    {/* Description */}
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                        {description}
                    </p>

                    {/* Coordinates */}
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground font-mono">
                        <Navigation className="h-3.5 w-3.5 shrink-0" />
                        <span>{poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        {hasAudio && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handlePlayAudio}
                            >
                                <Headphones className="h-4 w-4 mr-2" />
                                {audio.currentPOI?.id === poi.id && audio.isPlaying
                                    ? t.poi.pauseAudio
                                    : t.poi.playAudio}
                            </Button>
                        )}
                        <Button className="flex-1" asChild>
                            <Link href={`/poi/${poi.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t.poi.viewDetail}
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

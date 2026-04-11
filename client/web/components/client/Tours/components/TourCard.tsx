"use client"

import Link from "next/link"
import Image from "next/image"
import { Route, Clock, MapPin, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ClientTour, LanguageCode } from "@/lib/client-types"
import { formatClientTourDuration } from "@/lib/client-tour-duration"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"

interface TourCardProps {
    tour: ClientTour
    language: LanguageCode
    compact?: boolean
    onClick?: () => void
}

export function TourCard({ tour, language, compact = false, onClick }: TourCardProps) {
    const name = useTranslatedText(tour.name, language)
    const description = useTranslatedText(tour.description, language)
    const stopsLabel = useTranslatedUiText("stops", language, "en")
    const pointsLabel = useTranslatedUiText("điểm", language)

    if (compact) {
        const CardContent = (
                <Card className="overflow-hidden hover:bg-accent/50 transition-colors">
                    <div className="flex gap-3 p-3">
                        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                            {tour.coverImage ? (
                                <Image
                                    src={tour.coverImage}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Route className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-1">{name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {tour.pois.length} {language === "vi" ? pointsLabel : stopsLabel}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatClientTourDuration(tour.estimatedDuration, language)}
                                </span>
                            </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
                    </div>
                </Card>
        )
        return onClick ? (
            <div onClick={onClick} className="block cursor-pointer">
                {CardContent}
            </div>
        ) : (
            <Link href={`/tours/${tour.id}`} className="block">
                {CardContent}
            </Link>
        )
    }

    const MainContent = (
            <Card className="w-64 shrink-0 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-36 bg-muted">
                    {tour.coverImage ? (
                        <Image
                            src={tour.coverImage}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="256px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Route className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-white text-sm line-clamp-1">{name}</h3>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {tour.pois.length}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatClientTourDuration(tour.estimatedDuration, language)}
                            </span>
                        </div>
                        {tour.distance && (
                            <Badge variant="secondary" className="text-[10px]">
                                {tour.distance.toFixed(1)}km
                            </Badge>
                        )}
                    </div>
                </div>
            </Card>
        )

    return onClick ? (
        <div onClick={onClick} className="block cursor-pointer">
            {MainContent}
        </div>
    ) : (
        <Link href={`/tours/${tour.id}`} className="block">
            {MainContent}
        </Link>
    )
}

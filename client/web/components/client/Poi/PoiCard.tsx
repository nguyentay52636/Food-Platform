"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Headphones, ImageIcon, Navigation, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ClientPOI, LanguageCode, Translations } from "@/lib/client-types"

interface POICardProps {
    poi: ClientPOI
    language: LanguageCode
    distance?: number
    compact?: boolean
    onLocate?: (poi: ClientPOI) => void
    t?: Translations
}

export function POICard({ poi, language, distance, compact = false, onLocate, t }: POICardProps) {
    const name = poi.name[language] || poi.name.en
    const description = poi.description[language] || poi.description.en
    const image = poi.images[0]
    const hasAudio = !!poi.audio[language]

    // Compact card with locate and view buttons
    if (compact) {
        const isClickable = !!onLocate
        return (
            <Card
                className={`overflow-hidden ${isClickable ? "cursor-pointer" : ""}`}
                onClick={isClickable ? () => onLocate?.(poi) : undefined}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                    if (!isClickable) return
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onLocate?.(poi)
                    }
                }}
            >
                <div className="flex items-center gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                        {image ? (
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        )}
                        {hasAudio && (
                            <div className="absolute bottom-0.5 right-0.5 rounded-full bg-primary p-1">
                                <Headphones className="h-2.5 w-2.5 text-primary-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{name}</p>
                        <p className="text-xs text-muted-foreground truncate">{poi.address}</p>
                        {distance !== undefined && (
                            <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0">
                                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                            </Badge>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                        {onLocate && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onLocate(poi)
                                }}
                            >
                                <Navigation className="h-3.5 w-3.5 mr-1" />
                                {t?.poi.locateOnMap || "Map"}
                            </Button>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            asChild
                        >
                            <Link
                                href={`/poi/${poi.id}`}
                                onClick={(e) => {
                                    // Prevent parent Card click (locate) when opening detail page.
                                    e.stopPropagation()
                                }}
                            >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                {t?.poi.viewDetail || "View"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    // Full card for horizontal strip
    return (
        <Card className="overflow-hidden w-[300px] shrink-0 border-0 shadow-lg ring-1 ring-border/50 group bg-card hover:shadow-xl transition-all duration-300">
            {/* Click area for locate */}
            <div
                className={onLocate ? "cursor-pointer" : ""}
                onClick={() => onLocate?.(poi)}
            >
                <div className="relative h-44 w-full bg-muted overflow-hidden">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="300px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                    )}

                    <div className="absolute top-2 left-2 flex gap-1.5">
                        <Badge
                            variant={poi.category === "major" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0.5"
                        >
                            {poi.category === "major" ? "Major" : poi.subCategory || "Minor"}
                        </Badge>
                    </div>

                    {distance !== undefined && (
                        <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-background/90"
                        >
                            {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                        </Badge>
                    )}

                    {hasAudio && (
                        <div className="absolute bottom-2 right-2 rounded-full bg-primary p-1.5 shadow">
                            <Headphones className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-base line-clamp-1">{name}</h3>
                        {poi.rating && (
                            <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="text-xs font-bold">{poi.rating}</span>
                            </div>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {description}
                    </p>

                    {poi.address && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{poi.address}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 px-4 pb-4 mt-1">
                {onLocate && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onLocate(poi)
                        }}
                    >
                        <Navigation className="h-3.5 w-3.5 mr-1" />
                        {t?.poi.locateOnMap || "Map"}
                    </Button>
                )}
                <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    asChild
                >
                    <Link href={`/poi/${poi.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {t?.poi.viewDetail || "View"}
                    </Link>
                </Button>
            </div>
        </Card>
    )
}

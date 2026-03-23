"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Share2,
    Bookmark,
    MapPin,
    Star,
    Navigation,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AudioPlayer } from "@/components/client/AudioPlayer"

import { MiniPlayer } from "@/components/client/MiniPlayer"
import { useLanguage } from "@/lib/context/language-context"
import { useAudio } from "@/lib/context/audio-context"


import { POICard } from "@/components/client/Poi/PoiCard"
import { getClientPOIById, CLIENT_MOCK_POIS } from "@/lib/client-mock-data"

interface POIDetailPageProps {
    params: Promise<{ id: string }>
}

export default function POIDetailPage({ params }: POIDetailPageProps) {
    const { id } = use(params)
    const { language, t } = useLanguage()
    const audio = useAudio()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const galleryRef = useRef<HTMLDivElement>(null)

    const poi = getClientPOIById(id)

    if (!poi) {
        notFound()
    }

    const name = poi.name[language] || poi.name.en
    const description = poi.description[language] || poi.description.en
    const images = poi.images.length > 0 ? poi.images : []

    // Get related POIs (same category, excluding current)
    const relatedPois = CLIENT_MOCK_POIS.filter(
        (p) => p.id !== poi.id && p.category === poi.category
    ).slice(0, 4)

    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`
        window.open(url, "_blank")
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: name,
                text: description,
                url: window.location.href,
            })
        } else {
            await navigator.clipboard.writeText(window.location.href)
            alert("Link copied to clipboard!")
        }
    }

    const scrollToImage = (index: number) => {
        if (galleryRef.current && images.length > 0) {
            const scrollWidth = galleryRef.current.scrollWidth / images.length
            galleryRef.current.scrollTo({
                left: scrollWidth * index,
                behavior: "smooth",
            })
            setCurrentImageIndex(index)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <h1 className="font-semibold text-sm truncate max-w-[50%]">{name}</h1>

                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleShare}>
                        <Share2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Image Gallery */}
            <div className="relative">
                {images.length > 0 ? (
                    <>
                        <div
                            ref={galleryRef}
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                            onScroll={(e) => {
                                const index = Math.round(
                                    e.currentTarget.scrollLeft /
                                    (e.currentTarget.scrollWidth / images.length)
                                )
                                setCurrentImageIndex(index)
                            }}
                        >
                            {images.map((src: string, idx: number) => (
                                <div
                                    key={idx}
                                    className="relative h-56 w-full shrink-0 snap-center bg-muted"
                                >
                                    <Image
                                        src={src}
                                        alt={`${name} - ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        priority={idx === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation arrows */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                                    onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80"
                                    onClick={() =>
                                        scrollToImage(Math.min(images.length - 1, currentImageIndex + 1))
                                    }
                                    disabled={currentImageIndex === images.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {/* Dots indicator */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_: any, idx: any) => (
                                    <button
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex
                                            ? "w-4 bg-white"
                                            : "w-1.5 bg-white/60"
                                            }`}
                                        onClick={() => scrollToImage(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-40 bg-muted flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}

                {/* Category badge */}
                <Badge
                    variant={poi.category === "major" ? "default" : "secondary"}
                    className="absolute top-3 left-3"
                >
                    {poi.category === "major" ? "Major" : poi.subCategory || "Minor"}
                </Badge>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                {/* Title & Rating */}
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-xl font-bold">{name}</h1>
                        {poi.rating && (
                            <div className="flex items-center gap-1 shrink-0">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="font-medium">{poi.rating}</span>
                                {poi.reviewCount && (
                                    <span className="text-sm text-muted-foreground">
                                        ({poi.reviewCount})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {poi.address && (
                        <button
                            onClick={handleOpenMaps}
                            className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground hover:text-primary"
                        >
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="underline underline-offset-2">{poi.address}</span>
                        </button>
                    )}
                </div>

                {/* Audio Player */}
                <AudioPlayer poi={poi} />

                {/* Description */}
                <div>
                    <p
                        className={`text-sm text-muted-foreground leading-relaxed ${!showFullDescription && description.length > 200 ? "line-clamp-4" : ""
                            }`}
                    >
                        {description}
                    </p>
                    {description.length > 200 && (
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 mt-1"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? "Show less" : "Read more"}
                        </Button>
                    )}
                </div>

                {/* Coordinates */}
                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Navigation className="h-4 w-4" />
                            <span>
                                {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}
                            </span>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleOpenMaps}>
                            {t.poi.directions}
                        </Button>
                    </div>
                </Card>

                {/* Related POIs */}
                {relatedPois.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-3">{t.poi.relatedLocations}</h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                            {relatedPois.map((relatedPoi) => (
                                <POICard
                                    key={relatedPoi.id}
                                    poi={relatedPoi}
                                    language={language}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mini Player */}
            {audio.currentPOI && audio.currentPOI.id !== poi.id && <MiniPlayer />}
        </div>
    )
}

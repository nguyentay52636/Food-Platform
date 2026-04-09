"use client"

import React, { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Share2,
    Heart,
    MapPin,
    Star,
    Navigation,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Phone,
    DollarSign,
    Utensils,
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    Volume2,
    ExternalLink,
} from "lucide-react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { POICard } from "@/components/client/Poi/PoiCard"
import { MiniPlayer } from "@/components/client/MiniPlayer"
import { useLanguage } from "@/lib/context/language-context"
import { useAudio } from "@/lib/context/audio-context"
import { useVisitorSession, usePOIViewTracking, useAudioTracking } from "@/lib/context/visitor-session"
import { getClientPOIById, CLIENT_MOCK_POIS } from "@/lib/client-mock-data"
import { usePoiFavoriteIds, togglePoiFavorite } from "@/lib/poi-favorites-session"
import { SUPPORTED_LANGUAGES, type LanguageCode, type ClientPOI } from "@/lib/client-types"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"

interface POIDetailPageProps {
    params: Promise<{ id: string }>
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
}

function RelatedPOITile({ relatedPoi, language }: { relatedPoi: ClientPOI; language: LanguageCode }) {
    const relatedName = useTranslatedText(relatedPoi.name, language)

    return (
        <Link href={`/poi/${relatedPoi.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-24 bg-muted">
                    {relatedPoi.images[0] ? (
                        <Image
                            src={relatedPoi.images[0]}
                            alt={relatedName}
                            fill
                            className="object-cover"
                            sizes="50vw"
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <Utensils className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                    {relatedPoi.rating && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {relatedPoi.rating}
                        </div>
                    )}
                </div>
                <div className="p-2.5">
                    <p className="font-medium text-sm line-clamp-1">{relatedName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {relatedPoi.address}
                    </p>
                </div>
            </Card>
        </Link>
    )
}

function getMockReviews(poiName: string) {
    return [
        {
            id: "r1",
            author: "Minh Anh",
            rating: 5,
            date: "2 ngày trước",
            comment: `Món ăn ở ${poiName} rất ngon, phục vụ nhanh và không gian sạch sẽ.`,
        },
        {
            id: "r2",
            author: "David L.",
            rating: 4,
            date: "1 tuần trước",
            comment: "Good flavor and fair price. The place gets busy at night but still worth trying.",
        },
        {
            id: "r3",
            author: "Yuki",
            rating: 5,
            date: "2 tuần trước",
            comment: "Excellent local food experience. Staff were friendly and portions were generous.",
        },
    ]
}

export default function POIDetailPage({ params }: POIDetailPageProps) {
    const { id } = use(params)
    const { language, setLanguage } = useLanguage()
    const audio = useAudio()
    const visitor = useVisitorSession()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [narrationLanguage, setNarrationLanguage] = useState<LanguageCode>(language)
    const favoriteIds = usePoiFavoriteIds()
    const galleryRef = useRef<HTMLDivElement>(null)
    const narrationCacheRef = useRef<Record<string, string>>({})

    const poi = getClientPOIById(id)

    // Track POI view with time spent (auto cleanup on unmount)
    usePOIViewTracking(poi?.id || null)

    // Audio tracking
    const audioTracking = useAudioTracking(poi?.id || null, language)

    if (!poi) {
        notFound()
    }

    const isFavorite = favoriteIds.includes(poi.id)
    const name = useTranslatedText(poi.name, language)
    const description = useTranslatedText(poi.description, language)
    const featuredLabel = useTranslatedUiText("Nổi bật", language)
    const restaurantLabel = useTranslatedUiText("Quán ăn", language)
    const topRatedLabel = useTranslatedUiText("Top Rated", language, "en")
    const reviewsLabel = useTranslatedUiText("reviews", language, "en")
    const openHoursLabel = useTranslatedUiText("Giờ mở cửa", language)
    const priceLabel = useTranslatedUiText("Giá", language)
    const contactLabel = useTranslatedUiText("Liên hệ", language)
    const introLabel = useTranslatedUiText("Giới thiệu", language)
    const collapseLabel = useTranslatedUiText("Thu gọn", language)
    const readMoreLabel = useTranslatedUiText("Xem thêm", language)
    const shareLabel = useTranslatedUiText("Chia sẻ", language)
    const playAudioLabel = useTranslatedUiText("Nghe thuyết minh", language)
    const audioLanguageLabel = useTranslatedUiText("Ngôn ngữ audio", language)
    const directionsLabel = useTranslatedUiText("Chỉ đường", language)
    const relatedLabel = useTranslatedUiText("Quán ăn liên quan", language)
    const ratingAndCommentsLabel = useTranslatedUiText("Đánh giá và bình luận", language)
    const ratingOverviewLabel = useTranslatedUiText("Tổng quan đánh giá", language)
    const recentCommentsLabel = useTranslatedUiText("Bình luận gần đây", language)
    const images = poi.images.length > 0 ? poi.images : []
    const reviews = getMockReviews(name)
    const totalReviews = poi.reviewCount || reviews.length
    const ratingValue = poi.rating || 4.5
    const ratingPercentages = [
        { star: 5, value: 62 },
        { star: 4, value: 24 },
        { star: 3, value: 9 },
        { star: 2, value: 3 },
        { star: 1, value: 2 },
    ]

    // Get related POIs (same category, excluding current)
    const relatedPois = CLIENT_MOCK_POIS.filter(
        (p) => p.id !== poi.id
    ).slice(0, 6)

    // Audio controls
    const audioContent = poi.audio[language]
    const isCurrentPOI = audio.currentPOI?.id === poi.id
    const availableLanguages = SUPPORTED_LANGUAGES.filter((lang) => poi.audio[lang.code])
    const progress = isCurrentPOI && audio.duration > 0 ? audio.currentTime : 0
    const totalDuration = isCurrentPOI ? audio.duration : (audioContent?.duration || 0)
    React.useEffect(() => {
        setNarrationLanguage(language)
    }, [language])

    const sourceName = poi.name.vi || poi.name.en
    const sourceDescription = poi.description.vi || poi.description.en
    const sourceLanguage: LanguageCode = poi.name.vi || poi.description.vi ? "vi" : "en"

    const getNarrationTextForLanguage = async (langCode: LanguageCode): Promise<string> => {
        const cacheKey = `${poi.id}:${langCode}`
        if (narrationCacheRef.current[cacheKey]) {
            return narrationCacheRef.current[cacheKey]
        }

        const nativeName = poi.name[langCode]
        const nativeDescription = poi.description[langCode]
        if (nativeName && nativeDescription) {
            const directText = `${nativeName}. ${nativeDescription}`
            narrationCacheRef.current[cacheKey] = directText
            return directText
        }

        const baseText = `${sourceName}. ${sourceDescription}`
        if (langCode === sourceLanguage) {
            narrationCacheRef.current[cacheKey] = baseText
            return baseText
        }

        try {
            const params = new URLSearchParams({
                client: "gtx",
                sl: sourceLanguage,
                tl: langCode,
                dt: "t",
                q: baseText,
            })
            const response = await fetch(
                `https://translate.googleapis.com/translate_a/single?${params.toString()}`
            )
            if (!response.ok) throw new Error("Translate request failed")
            const data = (await response.json()) as unknown[]
            const translated = Array.isArray(data?.[0])
                ? (data[0] as unknown[])
                    .map((chunk) => (Array.isArray(chunk) ? String(chunk[0] ?? "") : ""))
                    .join("")
                : baseText
            const finalText = translated || baseText
            narrationCacheRef.current[cacheKey] = finalText
            return finalText
        } catch {
            narrationCacheRef.current[cacheKey] = baseText
            return baseText
        }
    }

    const startNarrationForLanguage = async (langCode: LanguageCode) => {
        const narrationText = await getNarrationTextForLanguage(langCode)
        audio.play(poi, langCode, narrationText)
        audioTracking.onPlay()
    }

    const handlePlayPause = () => {
        const isSameLanguage = audio.currentLanguage === narrationLanguage

        if (isCurrentPOI && audio.isPlaying && isSameLanguage) {
            audio.pause()
        } else if (isCurrentPOI && isSameLanguage) {
            audio.resume()
        } else {
            void startNarrationForLanguage(narrationLanguage)
        }
    }

    // Track audio progress periodically
    React.useEffect(() => {
        if (isCurrentPOI && audio.isPlaying) {
            const interval = setInterval(() => {
                audioTracking.onProgress(audio.currentTime)
            }, 5000) // Update every 5 seconds
            return () => clearInterval(interval)
        }
    }, [isCurrentPOI, audio.isPlaying, audio.currentTime, audioTracking])

    // Track audio completion
    React.useEffect(() => {
        if (isCurrentPOI && audio.currentTime > 0 && audio.duration > 0) {
            if (audio.currentTime >= audio.duration - 1) {
                audioTracking.onComplete()
            }
        }
    }, [isCurrentPOI, audio.currentTime, audio.duration, audioTracking])

    const handleLanguageChange = (langCode: LanguageCode) => {
        setNarrationLanguage(langCode)
        if (langCode !== language) {
            setLanguage(langCode)
        }
        void startNarrationForLanguage(langCode)
    }

    const handleOpenMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`
        window.open(url, "_blank")
        // Track directions for analytics
        visitor.trackDirections(poi.id)
    }

    const handleShare = async () => {
        // Track share for analytics
        visitor.trackShare("poi", poi.id)

        if (navigator.share) {
            await navigator.share({
                title: name,
                text: description,
                url: window.location.href,
            })
        } else {
            await navigator.clipboard.writeText(window.location.href)
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
        <div className="min-h-screen bg-background">
            {/* Hero Image Gallery */}
            <div className="relative">
                {/* Back button overlay */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full"
                            onClick={() => togglePoiFavorite(poi.id)}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 bg-black/30 hover:bg-black/50 text-white rounded-full"
                            onClick={handleShare}
                        >
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

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
                            {images.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="relative h-72 sm:h-80 md:h-96 w-full shrink-0 snap-center bg-muted"
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
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-90 shadow-lg"
                                    onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-90 shadow-lg"
                                    onClick={() => scrollToImage(Math.min(images.length - 1, currentImageIndex + 1))}
                                    disabled={currentImageIndex === images.length - 1}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </>
                        )}

                        {/* Image counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        )}

                        {/* Dots indicator */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`h-2 rounded-full transition-all ${idx === currentImageIndex
                                                ? "w-6 bg-white"
                                                : "w-2 bg-white/60"
                                            }`}
                                        onClick={() => scrollToImage(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-56 bg-muted flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative -mt-6 bg-background rounded-t-3xl">
                <div className="p-5 sm:p-6 space-y-6">
                    {/* Title Section */}
                    <div>
                        <div className="flex items-start gap-2 mb-2">
                            <Badge
                                variant={poi.category === "major" ? "default" : "secondary"}
                                className="shrink-0 bg-orange-500 hover:bg-orange-600"
                            >
                                <Utensils className="h-3 w-3 mr-1" />
                                {poi.category === "major" ? featuredLabel : poi.subCategory || restaurantLabel}
                            </Badge>
                            {poi.rating && poi.rating >= 4.5 && (
                                <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                                    {topRatedLabel}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{name}</h1>

                        {/* Rating */}
                        {poi.rating && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-5 w-5 ${star <= Math.round(poi.rating!)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold text-lg">{poi.rating}</span>
                                {poi.reviewCount && (
                                    <span className="text-muted-foreground">
                                        ({poi.reviewCount.toLocaleString()} {reviewsLabel})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <Card className="p-3 text-center bg-orange-50 border-orange-100">
                            <Clock className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                            <p className="text-xs text-muted-foreground">{openHoursLabel}</p>
                            <p className="text-sm font-medium">16:00 - 23:00</p>
                        </Card>
                        <Card className="p-3 text-center bg-green-50 border-green-100">
                            <DollarSign className="h-5 w-5 mx-auto text-green-500 mb-1" />
                            <p className="text-xs text-muted-foreground">{priceLabel}</p>
                            <p className="text-sm font-medium">50-200k</p>
                        </Card>
                        <Card className="p-3 text-center bg-blue-50 border-blue-100">
                            <Phone className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                            <p className="text-xs text-muted-foreground">{contactLabel}</p>
                            <p className="text-sm font-medium">090.xxx.xxx</p>
                        </Card>
                    </div>

                    {/* Address */}
                    <Card className="p-4">
                        <button
                            onClick={handleOpenMaps}
                            className="flex items-start gap-3 w-full text-left group"
                        >
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium group-hover:text-primary transition-colors">{poi.address}</p>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {poi.latitude.toFixed(6)}, {poi.longitude.toFixed(6)}
                                </p>
                            </div>
                            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
                        </button>
                    </Card>

                    <Separator />

                    {/* Audio Player Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-primary" />
                            {playAudioLabel}
                        </h2>

                        <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
                            {/* Language selector */}
                            {availableLanguages.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    <span className="text-sm text-muted-foreground">{audioLanguageLabel}:</span>
                                    <Select value={narrationLanguage} onValueChange={(value) => handleLanguageChange(value as LanguageCode)}>
                                        <SelectTrigger className="h-9 min-w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent align="start">
                                            {SUPPORTED_LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.code} value={lang.code}>
                                                    <span className="flex items-center gap-2">
                                                        <span className="font-semibold uppercase">{lang.code}</span>
                                                        <span>{lang.nativeName}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Progress bar */}
                            <div className="mb-5">
                                <Slider
                                    value={[progress]}
                                    min={0}
                                    max={totalDuration || 100}
                                    step={1}
                                    onValueChange={(v) => audio.seekTo(v[0])}
                                    disabled={!isCurrentPOI}
                                    className="cursor-pointer"
                                />
                                <div className="flex justify-between mt-2 text-sm text-muted-foreground font-medium">
                                    <span>{formatTime(progress)}</span>
                                    <span>{formatTime(totalDuration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-full"
                                    onClick={() => audio.skipBackward(15)}
                                    disabled={!isCurrentPOI}
                                >
                                    <RotateCcw className="h-6 w-6" />
                                </Button>

                                <Button
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg"
                                    onClick={handlePlayPause}
                                    disabled={audio.isLoading}
                                >
                                    {audio.isLoading ? (
                                        <div className="h-7 w-7 animate-spin rounded-full border-3 border-white border-t-transparent" />
                                    ) : isCurrentPOI && audio.isPlaying ? (
                                        <Pause className="h-8 w-8" />
                                    ) : (
                                        <Play className="h-8 w-8 ml-1" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 rounded-full"
                                    onClick={() => audio.skipForward(15)}
                                    disabled={!isCurrentPOI}
                                >
                                    <RotateCw className="h-6 w-6" />
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="ml-2 h-9 px-3 font-medium">
                                            {audio.playbackRate}x
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {PLAYBACK_RATES.map((rate) => (
                                            <DropdownMenuItem
                                                key={rate}
                                                onClick={() => audio.setPlaybackRate(rate)}
                                                className={audio.playbackRate === rate ? "bg-accent" : ""}
                                            >
                                                {rate}x
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">{introLabel}</h2>
                        <p
                            className={`text-muted-foreground leading-relaxed ${!showFullDescription && description.length > 250 ? "line-clamp-4" : ""
                                }`}
                        >
                            {description}
                        </p>
                        {description.length > 250 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 mt-2 text-orange-500"
                                onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                                {showFullDescription ? collapseLabel : readMoreLabel}
                            </Button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-base"
                            onClick={handleOpenMaps}
                        >
                            <Navigation className="h-5 w-5 mr-2" />
                            {directionsLabel}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-12 text-base"
                            onClick={handleShare}
                        >
                            <Share2 className="h-5 w-5 mr-2" />
                            {shareLabel}
                        </Button>
                    </div>

                    <Separator />

                    {/* Related POIs */}
                    {relatedPois.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">{relatedLabel}</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {relatedPois.slice(0, 4).map((relatedPoi) => (
                                    <RelatedPOITile key={relatedPoi.id} relatedPoi={relatedPoi} language={language} />
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Ratings and Comments */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">{ratingAndCommentsLabel}</h2>

                        <Card className="p-4 sm:p-5 border-border/70 bg-card/70 backdrop-blur-sm mb-4">
                            <p className="text-sm text-muted-foreground mb-3">{ratingOverviewLabel}</p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold">{ratingValue.toFixed(1)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= Math.round(ratingValue)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {totalReviews.toLocaleString()} {reviewsLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {ratingPercentages.map((item) => (
                                    <div key={item.star} className="flex items-center gap-2">
                                        <span className="text-xs w-5">{item.star}</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full"
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-8 text-right">
                                            {item.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div>
                            <p className="text-sm text-muted-foreground mb-3">{recentCommentsLabel}</p>
                            <div className="space-y-3">
                                {reviews.map((review) => (
                                    <Card key={review.id} className="p-4 border-border/70">
                                        <div className="flex items-start justify-between gap-3 mb-1.5">
                                            <div>
                                                <p className="font-medium text-sm">{review.author}</p>
                                                <p className="text-xs text-muted-foreground">{review.date}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="h-3.5 w-3.5 fill-current" />
                                                <span className="text-sm font-medium">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Bottom Safe Area Spacer */}
            <div className="h-20" />

            {/* Mini Player */}
            {audio.currentPOI && audio.currentPOI.id !== poi.id && <MiniPlayer />}
        </div>
    )
}

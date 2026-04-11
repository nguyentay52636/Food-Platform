"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Route, Search, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/client/ButtonNav"
import { TourCard } from "@/components/client/Tours/components/TourCard"
import { TourPaywallDialog } from "@/components/client/Tours/components/TourPaywallDialog"
import { MiniPlayer } from "@/components/client/MiniPlayer"
import { useLanguage } from "@/lib/context/language-context"
import { useAudio } from "@/lib/context/audio-context"
import { CLIENT_MOCK_TOURS } from "@/lib/client-mock-data"
import { LanguageCode, ClientTour } from "@/lib/client-types"
import { useVisitorSession } from "@/lib/context/visitor-session"
import { formatClientTourDuration } from "@/lib/client-tour-duration"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"

const LABELS: Partial<Record<LanguageCode, {
    title: string;
    subtitle: string;
    search: string;
    featured: string;
    allTours: string;
    stops: string;
    duration: string;
}>> = {
    vi: {
        title: "Tours",
        subtitle: "Khám phá các tuyến tham quan",
        search: "Tìm kiếm tour...",
        featured: "Tour nổi bật",
        allTours: "Tất cả Tours",
        stops: "điểm dừng",
        duration: "Thời gian",
    },
    en: {
        title: "Tours",
        subtitle: "Discover guided tours",
        search: "Search tours...",
        featured: "Featured Tour",
        allTours: "All Tours",
        stops: "stops",
        duration: "Duration",
    },
    zh: {
        title: "Tours",
        subtitle: "Discover guided tours",
        search: "Search tours...",
        featured: "Featured Tour",
        allTours: "All Tours",
        stops: "stops",
        duration: "Duration",
    },
    ja: {
        title: "Tours",
        subtitle: "Discover guided tours",
        search: "Search tours...",
        featured: "Featured Tour",
        allTours: "All Tours",
        stops: "stops",
        duration: "Duration",
    },
}

export default function Tours() {
    const { language } = useLanguage()
    const audio = useAudio()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTour, setSelectedTour] = useState<ClientTour | null>(null)
    const [isPaywallOpen, setIsPaywallOpen] = useState(false)
    const labels = LABELS[language] || LABELS.en!
    const visitor = useVisitorSession()


    React.useEffect(() => {
        visitor.trackPageView("home", { filter: "all" })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps   
    const filteredTours = CLIENT_MOCK_TOURS.filter((tour) => {
        const name = tour.name[language] || tour.name.en
        return name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const featuredTour = CLIENT_MOCK_TOURS[0]
    const featuredName = useTranslatedText(featuredTour.name, language)
    const featuredDesc = useTranslatedText(featuredTour.description, language)
    const noToursText = useTranslatedUiText("No tours found", language, "en")

    const handleSelectTour = (tour: ClientTour) => {
        setSelectedTour(tour)
        setIsPaywallOpen(true)
    }

    const handleConfirmPay = () => {
        // Implement purchase sequence here if necessary. Currently, just closes the dialog.
        setIsPaywallOpen(false)
        alert("Chức năng Mua đang được phát triển.")
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background border-b border-border">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                            <Route className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">{labels.title}</h1>
                            <p className="text-xs text-muted-foreground">{labels.subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={labels.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Featured Tour */}
                {!searchQuery && (
                    <section>
                        <h2 className="font-semibold text-lg mb-4 text-foreground/90">{labels.featured}</h2>
                        <div onClick={() => handleSelectTour(featuredTour)} className="block group cursor-pointer">
                            <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-black/5 rounded-2xl bg-card">
                                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-muted">
                                    {featuredTour.coverImage ? (
                                        <Image
                                            src={featuredTour.coverImage}
                                            alt={featuredName}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            priority
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                                            <Route className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg backdrop-blur-md font-semibold px-3 py-1">
                                            ★ {labels.featured}
                                        </Badge>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-white font-bold text-2xl mb-2 drop-shadow-md leading-tight group-hover:text-primary/90 transition-colors">
                                            {featuredName}
                                        </h3>
                                        <p className="text-white/90 text-sm line-clamp-2 drop-shadow mb-4 font-medium">
                                            {featuredDesc}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 md:gap-4 text-xs sm:text-sm font-medium text-white">
                                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                                    <MapPin className="h-4 w-4" />
                                                    {featuredTour.pois.length} {labels.stops}
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                                    <Clock className="h-4 w-4" />
                                                    {formatClientTourDuration(featuredTour.estimatedDuration, language)}
                                                </div>
                                            </div>
                                            {featuredTour.distance && (
                                                <div className="font-bold text-sm bg-primary/90 backdrop-blur-md text-primary-foreground px-3 py-1.5 rounded-full shadow-lg shrink-0">
                                                    {featuredTour.distance}km
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {/* All Tours */}
                <section>
                    <h2 className="font-semibold text-lg mb-4 text-foreground/90">{labels.allTours}</h2>
                    <div className="space-y-3">
                        {filteredTours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} language={language} compact onClick={() => handleSelectTour(tour)} />
                        ))}
                    </div>

                    {filteredTours.length === 0 && (
                        <div className="text-center py-12">
                            <Route className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">
                                {noToursText}
                            </p>
                        </div>
                    )}
                </section>
            </div>

            {/* Bottom Nav */}
            <BottomNav />

            {/* Mini Player */}
            {audio.currentPOI && <MiniPlayer className="bottom-14" />}

            {/* Paywall Dialog */}
            <TourPaywallDialog
                open={isPaywallOpen}
                onOpenChange={setIsPaywallOpen}
                targetTour={selectedTour}
                language={language}
                onConfirmPay={handleConfirmPay}
            />
        </div>
    )
}

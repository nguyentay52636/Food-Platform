"use client"

import React, { useState, useCallback } from "react"
import { MapPin, List, ChevronUp, Headphones, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ClientHeader } from "@/components/client/ClientHeader"
import { ClientMap } from "@/components/client/ClientMap"
import { POICard } from "@/components/client/Poi/PoiCard"
import { MiniPlayer } from "@/components/client/MiniPlayer"
import { BottomNav } from "@/components/client/ButtonNav"
import { POIPreviewDialog } from "@/components/client/PoiPreviewDialog"
import { useLanguage } from "@/lib/context/language-context"
import { useAudio } from "@/lib/context/audio-context"
import { CLIENT_MOCK_POIS } from "@/lib/client-mock-data"
import type { ClientPOI } from "@/lib/client-types"
import Image from "next/image"
import { useVisitorSession } from "@/lib/context/visitor-session"
import useGeolocation from "@/hooks/useGeolocation"
import { usePoiFavoriteIds } from "@/lib/poi-favorites-session"
import { cn } from "@/lib/utils"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"

export default function ExplorePage() {
    const { language } = useLanguage()
    const audio = useAudio()
    const [selectedPoi, setSelectedPoi] = useState<ClientPOI | null>(null)
    const [previewPoi, setPreviewPoi] = useState<ClientPOI | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [filter, setFilter] = useState<"all" | "major" | "minor">("all")
    const [sheetOpen, setSheetOpen] = useState(false)
    const [locateSignal, setLocateSignal] = useState(0)
    const [listTab, setListTab] = useState<"nearby" | "favorites">("nearby")
    const favoriteIds = usePoiFavoriteIds()
    const selectedPoiName = useTranslatedText(selectedPoi?.name ?? { en: "" }, language)
    const selectedPoiDescription = useTranslatedText(selectedPoi?.description ?? { en: "" }, language)
    const allLabel = useTranslatedUiText("All", language, "en")
    const majorLabel = useTranslatedUiText("Điểm chính", language)
    const minorLabel = useTranslatedUiText("Điểm phụ", language)
    const nearbyLabel = useTranslatedUiText("Quán ăn gần đây", language)
    const favoritesLabel = useTranslatedUiText("Quán ăn yêu thích", language)
    const noFavoritesLabel = useTranslatedUiText(
        "Chưa có quán yêu thích. Bấm trái tim ở trang chi tiết để lưu.",
        language
    )
    const viewAllLabel = useTranslatedUiText("Xem tất cả", language)
    const viewDetailLabel = useTranslatedUiText("Xem chi tiết", language)
    const playAudioLabel = useTranslatedUiText("Nghe thuyết minh", language)
    const pauseAudioLabel = useTranslatedUiText("Tạm dừng", language)

    // Track page view and geolocation
    const visitor = useVisitorSession()
    const { position: userLocation } = useGeolocation()

    React.useEffect(() => {
        visitor.trackPageView("home", { filter: "all" })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const matchesMapFilter = (poi: ClientPOI) =>
        filter === "all" || poi.category === filter

    const nearbyPois = CLIENT_MOCK_POIS.filter(matchesMapFilter)
    const favoritePois = CLIENT_MOCK_POIS.filter(
        (p) => favoriteIds.includes(p.id) && matchesMapFilter(p)
    )
    const pois = listTab === "nearby" ? nearbyPois : favoritePois

    const majorPois = CLIENT_MOCK_POIS.filter((p) => p.category === "major")
    const stripPois =
        listTab === "nearby"
            ? majorPois
            : CLIENT_MOCK_POIS.filter((p) => favoriteIds.includes(p.id) && p.category === "major")

    const handleMarkerClick = useCallback((poi: ClientPOI) => {
        setSelectedPoi(poi)
        setPreviewPoi(poi)
        setPreviewOpen(true)
    }, [])

    // Handle locate on map - zoom to location and show preview dialog
    const handleLocate = useCallback((poi: ClientPOI) => {
        setSelectedPoi(poi)
        setPreviewPoi(poi)
        setPreviewOpen(true)
    }, [])

    const handlePlayAudio = useCallback(() => {
        if (!selectedPoi) return
        if (audio.currentPOI?.id === selectedPoi.id && audio.isPlaying) {
            audio.pause()
        } else if (audio.currentPOI?.id === selectedPoi.id) {
            audio.resume()
        } else {
            audio.play(selectedPoi, language)
        }
    }, [selectedPoi, audio, language])

    const closeQuickView = useCallback(() => {
        setSelectedPoi(null)
    }, [])

    return (
        <div className="flex flex-col h-screen bg-background">
            <ClientHeader />

            {/* Google Maps-like layout: list left, map right (50/50 on md+) */}
            <div className="flex-1 min-h-0 md:flex md:flex-row">
                {/* Left: vertical list (desktop/tablet) */}
                <aside className="hidden md:flex md:w-[30%] flex-col border-r border-border bg-card/60 backdrop-blur-xl overflow-y-auto">
                    <div className="p-3 space-y-3 w-full min-h-0">
                        <div className="flex flex-col gap-2 px-1 pt-1">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-1 min-w-0 rounded-lg bg-muted/60 p-0.5 gap-0.5">
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex-1 min-w-0 rounded-md py-2 px-1 text-xs font-medium transition-colors",
                                            listTab === "nearby"
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                        onClick={() => setListTab("nearby")}
                                    >
                                        {nearbyLabel}
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            "flex-1 min-w-0 rounded-md py-2 px-1 text-xs font-medium transition-colors",
                                            listTab === "favorites"
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                        onClick={() => setListTab("favorites")}
                                    >
                                        {favoritesLabel}
                                    </button>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="shrink-0 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                                >
                                    {pois.length}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-3 pb-28">
                            {pois.length === 0 && listTab === "favorites" ? (
                                <p className="text-sm text-muted-foreground text-center py-8 px-2">
                                    {noFavoritesLabel}
                                </p>
                            ) : (
                                pois.map((poi) => (
                                    <POICard
                                        key={poi.id}
                                        poi={poi}
                                        language={language}
                                        compact
                                        distance={Math.random() * 5}
                                        onLocate={(p) => {
                                            setSelectedPoi(p)
                                            setPreviewPoi(p)
                                            setPreviewOpen(true)
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right: map */}
                <div className="relative flex-1 md:w-[70%] min-h-0">
                    <ClientMap
                        pois={pois}
                        selectedPoi={selectedPoi}
                        onMarkerClick={handleMarkerClick}
                        language={language}
                        className="h-full"
                        userLocation={userLocation}
                        locateSignal={locateSignal}
                    />

                    {/* Filter chips - floating */}
                    <div className="absolute top-3 left-3 right-3 flex gap-2 pointer-events-none">
                        <div className="flex gap-2 pointer-events-auto">
                            {(["all", "major", "minor"] as const).map((f) => (
                                <Button
                                    key={f}
                                    variant={filter === f ? "default" : "secondary"}
                                    size="sm"
                                    className="h-8 rounded-full shadow-md"
                                    onClick={() => setFilter(f)}
                                >
                                    {f === "all" ? allLabel : f === "major" ? majorLabel : minorLabel}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* GPS Status / Locate Me Button */}
                    <div className="absolute top-20 right-3 z-[1000] pointer-events-auto">
                        <Button
                            variant="secondary"
                            size="icon"
                            className={`rounded-full shadow-lg h-10 w-10 transition-colors ${userLocation ? 'text-primary' : 'text-muted-foreground'}`}
                            disabled={!userLocation}
                            onClick={() => {
                                // Ask the map to move to the user's current position.
                                setLocateSignal((s) => s + 1)
                            }}
                        >
                            <Navigation className={`h-5 w-5 ${userLocation ? 'fill-primary animate-pulse' : ''}`} />
                        </Button>
                    </div>

                    {/* Selected POI Quick View (on map) */}
                    {selectedPoi && !previewOpen && (
                        <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-4 duration-300">
                            <Card className="overflow-hidden shadow-xl">
                                {/* ... Content remains the same ... */}
                                <div className="flex">
                                    <div className="relative h-28 w-28 shrink-0 bg-muted">
                                        {selectedPoi.images[0] ? (
                                            <Image
                                                src={selectedPoi.images[0]}
                                                alt={selectedPoiName}
                                                fill
                                                className="object-cover"
                                                sizes="112px"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <MapPin className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <Badge
                                            variant={selectedPoi.category === "major" ? "default" : "secondary"}
                                            className="absolute top-2 left-2 text-[10px]"
                                        >
                                            {selectedPoi.category === "major" ? majorLabel : minorLabel}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-1 flex-col p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-sm line-clamp-1">
                                                {selectedPoiName}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 shrink-0 -mr-1 -mt-1"
                                                onClick={closeQuickView}
                                            >
                                                <span className="text-lg">&times;</span>
                                            </Button>
                                        </div>

                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {selectedPoiDescription}
                                        </p>

                                        <div className="flex gap-2 mt-auto pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-8 text-xs"
                                                asChild
                                            >
                                                <a href={`/poi/${selectedPoi.id}`}>
                                                    <MapPin className="h-3.5 w-3.5 mr-1" />
                                                    {viewDetailLabel}
                                                </a>
                                            </Button>

                                            {selectedPoi.audio[language] && (
                                                <Button
                                                    size="sm"
                                                    className="flex-1 h-8 text-xs"
                                                    onClick={handlePlayAudio}
                                                >
                                                    <Headphones className="h-3.5 w-3.5 mr-1" />
                                                    {audio.currentPOI?.id === selectedPoi.id && audio.isPlaying
                                                        ? pauseAudioLabel
                                                        : playAudioLabel}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Bottom Sheet Trigger (mobile only) */}
                    <div className="md:hidden">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full shadow-2xl px-5 h-12 bg-background/95 backdrop-blur-md border border-border/50 text-foreground font-semibold hover:bg-background/80 transition-all font-medium"
                                    onClick={() => !selectedPoi && setSheetOpen(true)}
                                    style={{ display: selectedPoi ? "none" : "flex" }}
                                >
                                    <ChevronUp className="h-5 w-5 mr-1 text-primary" />
                                    <List className="h-4 w-4 mr-2" />
                                    {nearbyLabel}
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-[2rem] px-0 pb-10 border-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] bg-background/98 backdrop-blur-xl">
                                <SheetHeader className="pb-2 pt-2 px-6">
                                    <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-5" />
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-1 min-w-0 rounded-lg bg-muted/60 p-0.5 gap-0.5">
                                                <button
                                                    type="button"
                                                    className={cn(
                                                        "flex-1 min-w-0 rounded-md py-2 px-1 text-xs font-medium transition-colors",
                                                        listTab === "nearby"
                                                            ? "bg-background text-foreground shadow-sm"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                    onClick={() => setListTab("nearby")}
                                                >
                                                    {nearbyLabel}
                                                </button>
                                                <button
                                                    type="button"
                                                    className={cn(
                                                        "flex-1 min-w-0 rounded-md py-2 px-1 text-xs font-medium transition-colors",
                                                        listTab === "favorites"
                                                            ? "bg-background text-foreground shadow-sm"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                    onClick={() => setListTab("favorites")}
                                                >
                                                    {favoritesLabel}
                                                </button>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="shrink-0 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                                            >
                                                {pois.length}
                                            </Badge>
                                        </div>
                                    </div>
                                </SheetHeader>

                                {/* Horizontal Swipeable List */}
                                <div className="flex gap-4 overflow-x-auto pb-6 pt-4 px-6 snap-x snap-mandatory scrollbar-hide">
                                    {pois.length === 0 && listTab === "favorites" ? (
                                        <p className="text-sm text-muted-foreground py-6 px-2 w-full text-center">
                                            {noFavoritesLabel}
                                        </p>
                                    ) : (
                                    pois.map((poi) => (
                                        <div key={poi.id} className="snap-center shrink-0 transition-transform duration-300 hover:scale-[1.02]">
                                            <POICard
                                                poi={poi}
                                                language={language}
                                                compact={false}
                                                distance={Math.random() * 5}
                                                onLocate={(p) => {
                                                    setSheetOpen(false)
                                                    handleLocate(p)
                                                }}
                                            />
                                        </div>
                                    ))
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Nearby Locations Strip (mobile only) */}
            <div className="md:hidden">
                {!selectedPoi && (
                    <div className="bg-card border-t border-border p-4 pb-16">
                        <div className="flex flex-col gap-2 mb-3">
                            <div className="flex rounded-lg bg-muted/60 p-0.5 gap-0.5">
                                <button
                                    type="button"
                                    className={cn(
                                        "flex-1 rounded-md py-2 text-xs font-medium transition-colors",
                                        listTab === "nearby"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={() => setListTab("nearby")}
                                >
                                    {nearbyLabel}
                                </button>
                                <button
                                    type="button"
                                    className={cn(
                                        "flex-1 rounded-md py-2 text-xs font-medium transition-colors",
                                        listTab === "favorites"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={() => setListTab("favorites")}
                                >
                                    {favoritesLabel}
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {listTab === "favorites" ? favoritesLabel : nearbyLabel}
                                </span>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-xs"
                                    onClick={() => setSheetOpen(true)}
                                >
                                    {viewAllLabel}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                            {stripPois.length === 0 && listTab === "favorites" ? (
                                <p className="text-sm text-muted-foreground py-4 px-2 w-full text-center">
                                    {noFavoritesLabel}
                                </p>
                            ) : (
                                stripPois.map((poi) => (
                                    <POICard
                                        key={poi.id}
                                        poi={poi}
                                        language={language}
                                        distance={Math.random() * 5}
                                        onLocate={handleLocate}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Mini Player */}
            {audio.currentPOI && audio.currentPOI.id !== selectedPoi?.id && (
                <MiniPlayer className="bottom-14" />
            )}

            {/* POI Preview Dialog */}
            <POIPreviewDialog
                poi={previewPoi}
                language={language}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
            />
        </div>
    )
}


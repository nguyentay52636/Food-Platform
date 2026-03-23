"use client"

import { useState, useCallback } from "react"
import { MapPin, List, ChevronUp, Headphones } from "lucide-react"
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

export default function ExplorePage() {
    const { language, t } = useLanguage()
    const audio = useAudio()
    const [selectedPoi, setSelectedPoi] = useState<ClientPOI | null>(null)
    const [previewPoi, setPreviewPoi] = useState<ClientPOI | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [filter, setFilter] = useState<"all" | "major" | "minor">("all")
    const [sheetOpen, setSheetOpen] = useState(false)

    const pois = CLIENT_MOCK_POIS.filter((poi) => {
        if (filter === "all") return true
        return poi.category === filter
    })

    const majorPois = CLIENT_MOCK_POIS.filter((p) => p.category === "major")

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

            {/* Map */}
            <div className="relative flex-1">
                <ClientMap
                    pois={pois}
                    selectedPoi={selectedPoi}
                    onMarkerClick={handleMarkerClick}
                    language={language}
                    className="h-full"
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
                                {f === "all" ? "All" : f === "major" ? "Major" : "Minor"}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Selected POI Quick View (on map) */}
                {selectedPoi && !previewOpen && (
                    <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-4 duration-300">
                        <Card className="overflow-hidden shadow-xl">
                            <div className="flex">
                                <div className="relative h-28 w-28 shrink-0 bg-muted">
                                    {selectedPoi.images[0] ? (
                                        <Image
                                            src={selectedPoi.images[0]}
                                            alt={selectedPoi.name[language]}
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
                                        {selectedPoi.category === "major" ? "Major" : "Minor"}
                                    </Badge>
                                </div>

                                <div className="flex flex-1 flex-col p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-sm line-clamp-1">
                                            {selectedPoi.name[language]}
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
                                        {selectedPoi.description[language]}
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
                                                {t.poi.viewDetail}
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
                                                    ? t.poi.pauseAudio
                                                    : t.poi.playAudio}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Bottom Sheet Trigger */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="secondary"
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full shadow-lg px-4 h-10"
                            onClick={() => !selectedPoi && setSheetOpen(true)}
                            style={{ display: selectedPoi ? "none" : "flex" }}
                        >
                            <ChevronUp className="h-4 w-4 mr-2" />
                            <List className="h-4 w-4 mr-2" />
                            {t.home.nearbyLocations}
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
                        <SheetHeader className="pb-4">
                            <SheetTitle>{t.home.nearbyLocations} ({pois.length})</SheetTitle>
                        </SheetHeader>

                        <div className="space-y-3 overflow-y-auto h-[calc(100%-60px)] pb-4">
                            {pois.map((poi) => (
                                <POICard
                                    key={poi.id}
                                    poi={poi}
                                    language={language}
                                    compact
                                    distance={Math.random() * 5}
                                    onLocate={handleLocate}
                                    t={t}
                                />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Nearby Locations Strip (when no selection) */}
            {!selectedPoi && (
                <div className="bg-card border-t border-border p-4 pb-16">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-sm">{t.home.nearbyLocations}</h2>
                        <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => setSheetOpen(true)}
                        >
                            {t.home.viewAll}
                        </Button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {majorPois.map((poi) => (
                            <POICard
                                key={poi.id}
                                poi={poi}
                                language={language}
                                distance={Math.random() * 5}
                                onLocate={handleLocate}
                                t={t}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Mini Player (when audio playing but not viewing that POI) */}
            {audio.currentPOI && audio.currentPOI.id !== selectedPoi?.id && (
                <MiniPlayer className="bottom-14" />
            )}

            {/* POI Preview Dialog */}
            <POIPreviewDialog
                poi={previewPoi}
                language={language}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                t={t}
            />
        </div>
    )
}

import React, { useMemo, useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Volume2, Square, Headphones, Globe, FileText, Music } from "lucide-react"
import type { POI } from "@/lib/types"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import { Badge } from "@/components/ui/badge"

import { useLanguages } from "@/hooks/useLanguages"
import type { ILanguage } from "@/apis/languageApi"

interface DialogDetailAudioProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    poi: POI
    adminUi: AdminPoisUi
}

export default function DialogDetailAudio({ open, onOpenChange, poi, adminUi }: DialogDetailAudioProps) {
    const { languages } = useLanguages()
    const [playingLang, setPlayingLang] = useState<string | null>(null)
    const [synth, setSynth] = useState<SpeechSynthesis | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            setSynth(window.speechSynthesis)
        }
    }, [])

    const getNarrationText = (lang: string) => {
        // If the current language matches the one provided in poiNgonNgu, use its specific moTa
        // mapping logic in usePOIs already prioritizes moTa to description, but we can be explicit here
        const currentContent = (lang.startsWith("vi") && poi.poiNgonNgu) ? poi.poiNgonNgu.moTa : poi.description

        const labels = adminUi.panel
        const addressText = poi.address ? `${labels.addressLabel}: ${poi.address}.` : ""

        // Use Chinese punctuation for ZH codes, standard otherwise
        if (lang.startsWith("zh")) {
            return `${poi.name}。${currentContent}。${labels.categoryLabel}：${poi.category}。${poi.address ? `${labels.addressLabel}：${poi.address}。` : ""}`
        }

        return `${poi.name}. ${currentContent}. ${labels.categoryLabel}: ${poi.category}. ${addressText}`
    }

    const handleToggleSpeech = (lang: string) => {
        if (!synth) return

        if (playingLang === lang) {
            synth.cancel()
            setPlayingLang(null)
            return
        }

        synth.cancel()
        const text = getNarrationText(lang)
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang

        utterance.onend = () => {
            setPlayingLang(null)
        }

        utterance.onerror = () => {
            setPlayingLang(null)
        }

        setPlayingLang(lang)
        synth.speak(utterance)
    }

    // Stop speaking when dialog closes
    useEffect(() => {
        if (!open && synth) {
            synth.cancel()
            setPlayingLang(null)
        }
    }, [open, synth])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Headphones className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-xl">{poi.poiNgonNgu?.tieuDe || poi.name}</DialogTitle>
                                {poi.poiNgonNgu?.usedFallback && (
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 bg-amber-50 text-amber-600 border-amber-200">
                                        Fallback Used
                                    </Badge>
                                )}
                            </div>
                            <DialogDescription>
                                {adminUi.audioDetail.title} {poi.poiNgonNgu ? `(${poi.poiNgonNgu._id})` : ""}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
                                {poi.imageUrl || (poi.images && poi.images[0]) ? (
                                    <img
                                        src={poi.imageUrl || poi.images?.[0]}
                                        alt={poi.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md border-none uppercase text-[10px]">
                                    {poi.category}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Music className="h-4 w-4 text-primary" />
                                    {adminUi.audioDetail.masterAudio}
                                </h4>
                                {(poi.audioUrl || poi.poiNgonNgu?.audio) ? (
                                    <div className="space-y-3">
                                        <audio controls className="w-full h-10">
                                            <source src={poi.audioUrl || poi.poiNgonNgu?.audio?.url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                        <p className="text-[10px] text-muted-foreground italic">
                                            {adminUi.audioDetail.masterAudioDesc}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/30">
                                        <Music className="h-6 w-6 text-muted-foreground/50 mb-1" />
                                        <span className="text-xs text-muted-foreground">{adminUi.audioDetail.noAudio}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                {adminUi.form.description}
                            </h4>
                            {poi.poiNgonNgu?.tieuDe && (
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    Official Title: {poi.poiNgonNgu.tieuDe}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {poi.poiNgonNgu?.moTa || poi.description || "Chưa có mô tả cho địa điểm này."}
                        </p>
                    </div>

                    {/* Narrations Table */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            {adminUi.audioDetail.narrations}
                        </h4>
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[150px]">{adminUi.audioDetail.langCol}</TableHead>
                                        <TableHead>{adminUi.audioDetail.contentCol}</TableHead>
                                        <TableHead className="w-[100px] text-right">{adminUi.audioDetail.actionCol}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {languages.map((lang) => (
                                        <TableRow key={lang._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{lang.flag}</span>
                                                    <span>{lang.nativeName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                                                        {getNarrationText(lang.code)}
                                                    </p>
                                                    <button
                                                        className="text-[10px] text-primary hover:underline w-fit"
                                                        onClick={() => {
                                                            alert(getNarrationText(lang.code))
                                                        }}
                                                    >
                                                        {adminUi.audioDetail.viewFull}
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 rounded-full ${playingLang === lang.code ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : ''}`}
                                                    onClick={() => handleToggleSpeech(lang.code)}
                                                >
                                                    {playingLang === lang.code ? (
                                                        <Square className="h-3 w-3 fill-current" />
                                                    ) : (
                                                        <Volume2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-start gap-1 p-2 bg-muted/20 rounded">
                            <FileText className="h-3 w-3 mt-0.5" />
                            {adminUi.audioDetail.helperText}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

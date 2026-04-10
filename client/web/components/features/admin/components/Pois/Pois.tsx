"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { POI, CreatePOIPayload } from "@/lib/types"
import {
    usePOIs,
    usePOISelection,
    usePOIPicker,
    usePOIActions,
} from "@/components/features/admin/components/Pois/hooks/usePois"
import { PoisMap } from "./components/PoisMap"
import { PoisDeleteDialog } from "./components/Dialog/PoisDeleteDialog"
import { PoisCardStrip } from "./components/PoisCardStrip"
import { PoisSidebarForm } from "./components/PoisSidebarForm"
import type { LanguageCode } from "@/lib/client-types"
import { getAdminPoisBundle } from "@/lib/i18n/admin-pois-i18n"

type NarrationLanguage = "vi-VN" | "en-US" | "zh-CN"

export default function Pois() {
    const {
        pois,
        loadPOIs,
    } = usePOIs()

    const { selectedPoi, selectPoi, clearSelection } = usePOISelection()

    const { pickerState, activatePicker, deactivatePicker, setPickerLocation } = usePOIPicker()

    const [editingPoi, setEditingPoi] = useState<POI | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<POI | null>(null)

    // CRUD actions
    const { handleCreate, handleUpdate, handleDelete } = usePOIActions(loadPOIs, clearSelection)
    const [uiLanguage, setUiLanguage] = useState<LanguageCode>("vi")
    const [narrationLanguage, setNarrationLanguage] = useState<NarrationLanguage>("vi-VN")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    const adminBundle = useMemo(() => getAdminPoisBundle(uiLanguage), [uiLanguage])

    const narrationText = useMemo(() => {
        if (!selectedPoi) return ""
        const labels = adminBundle.panel
        const addressText = selectedPoi.address ? `${labels.addressLabel}: ${selectedPoi.address}.` : ""
        switch (narrationLanguage) {
            case "en-US":
                return `${selectedPoi.name}. ${selectedPoi.description}. ${labels.categoryLabel}: ${selectedPoi.category}. ${selectedPoi.address ? `${labels.addressLabel}: ${selectedPoi.address}.` : ""}`
            case "zh-CN":
                return `${selectedPoi.name}。${selectedPoi.description}。${labels.categoryLabel}：${selectedPoi.category}。${selectedPoi.address ? `${labels.addressLabel}：${selectedPoi.address}。` : ""}`
            default:
                return `${selectedPoi.name}. ${selectedPoi.description}. ${labels.categoryLabel}: ${selectedPoi.category}. ${addressText}`
        }
    }, [selectedPoi, narrationLanguage, adminBundle])

    // ─── Event Handlers ─────────────────────────────────────────────────────────

    const handleEditClick = useCallback(
        (poi: POI) => {
            setEditingPoi(poi)
            selectPoi(poi)
            deactivatePicker()
        },
        [selectPoi, deactivatePicker]
    )

    const handleMapClick = useCallback(
        (lat: number, lng: number) => {
            if (pickerState.isActive) {
                setPickerLocation(lat, lng)
            }
        },
        [pickerState.isActive, setPickerLocation]
    )

    const handleMarkerClick = useCallback(
        (poi: POI) => {
            if (!pickerState.isActive) {
                selectPoi(poi)
                setEditingPoi(poi)
            }
        },
        [pickerState.isActive, selectPoi]
    )

    const handleFormSubmit = useCallback(
        async (data: CreatePOIPayload) => {
            if (editingPoi) {
                await handleUpdate(editingPoi.id, data)
                setEditingPoi((prev) =>
                    prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : prev
                )
            } else {
                await handleCreate(data)
            }
            deactivatePicker()
        },
        [editingPoi, handleCreate, handleUpdate, deactivatePicker]
    )

    const handleDeleteConfirm = useCallback(async () => {
        if (deleteTarget) {
            await handleDelete(deleteTarget)
            setDeleteTarget(null)
            if (editingPoi?.id === deleteTarget.id) {
                setEditingPoi(null)
            }
        }
    }, [deleteTarget, handleDelete, editingPoi])

    const handleResetForm = useCallback(() => {
        setEditingPoi(null)
        clearSelection()
        deactivatePicker()
    }, [clearSelection, deactivatePicker])

    const stopNarration = useCallback(() => {
        if (typeof window === "undefined" || !window.speechSynthesis) return
        window.speechSynthesis.cancel()
        currentUtteranceRef.current = null
        setIsSpeaking(false)
    }, [])

    const speakNarration = useCallback(() => {
        if (!selectedPoi || !narrationText || typeof window === "undefined" || !window.speechSynthesis) {
            return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(narrationText)
        utterance.lang = narrationLanguage
        utterance.rate = 1
        utterance.pitch = 1
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
            setIsSpeaking(false)
            currentUtteranceRef.current = null
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            currentUtteranceRef.current = null
        }

        currentUtteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }, [selectedPoi, narrationText, narrationLanguage])

    useEffect(() => {
        if (!selectedPoi) {
            stopNarration()
            return
        }
        speakNarration()
    }, [selectedPoi, narrationLanguage, speakNarration, stopNarration])

    useEffect(() => {
        return () => stopNarration()
    }, [stopNarration])

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="flex h-full min-h-0">
            <div className="hidden h-full w-[360px] shrink-0 lg:block">
                <PoisSidebarForm
                    poi={editingPoi}
                    pickerLat={pickerState.lat}
                    pickerLng={pickerState.lng}
                    pickerMode={pickerState.isActive}
                    uiLanguage={uiLanguage}
                    onTogglePicker={() => (pickerState.isActive ? deactivatePicker() : activatePicker())}
                    onResetForm={handleResetForm}
                    onSubmit={handleFormSubmit}
                />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="border-b border-border lg:hidden">
                    <PoisSidebarForm
                        poi={editingPoi}
                        pickerLat={pickerState.lat}
                        pickerLng={pickerState.lng}
                        pickerMode={pickerState.isActive}
                        uiLanguage={uiLanguage}
                        onTogglePicker={() => (pickerState.isActive ? deactivatePicker() : activatePicker())}
                        onResetForm={handleResetForm}
                        onSubmit={handleFormSubmit}
                    />
                </div>

                {/* Map (upper) */}
                <div className="relative min-h-[420px] flex-1 overflow-hidden">
                    <PoisMap
                        pois={pois}
                        selectedPoi={selectedPoi}
                        onMapClick={handleMapClick}
                        onMarkerClick={handleMarkerClick}
                        pickerMode={pickerState.isActive}
                        pickerLat={pickerState.lat}
                        pickerLng={pickerState.lng}
                        uiLanguage={uiLanguage}
                        onUiLanguageChange={setUiLanguage}
                        className="h-full w-full"
                    />

                </div>

                {/* Nearby Locations strip (lower) */}
                <div className="shrink-0 border-t border-border">
                    <PoisCardStrip
                        pois={pois}
                        selectedPoi={selectedPoi}
                        uiLanguage={uiLanguage}
                        onSelect={handleEditClick}
                    />
                </div>
            </div>

            {selectedPoi && (
                <div className="fixed bottom-4 right-4 z-[70] w-[360px] rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/85">
                    <p className="text-sm font-semibold">{adminBundle.panel.audioGuide}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{selectedPoi.name}</p>

                    <div className="mt-3 flex items-center gap-2">
                        <label className="text-xs text-muted-foreground">{adminBundle.panel.language}</label>
                        <select
                            value={narrationLanguage}
                            onChange={(e) => setNarrationLanguage(e.target.value as NarrationLanguage)}
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                            <option value="vi-VN">Tiếng Việt</option>
                            <option value="en-US">English</option>
                            <option value="zh-CN">中文</option>
                        </select>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={speakNarration}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            {adminBundle.panel.playAudio}
                        </button>
                        <button
                            type="button"
                            onClick={stopNarration}
                            className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        >
                            {adminBundle.panel.stop}
                        </button>
                        <span className="self-center text-xs text-muted-foreground">
                            {isSpeaking ? adminBundle.panel.playing : adminBundle.panel.ready}
                        </span>
                    </div>
                </div>
            )}

            <PoisDeleteDialog
                poi={deleteTarget}
                uiLanguage={uiLanguage}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

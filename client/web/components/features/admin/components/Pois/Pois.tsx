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
import { PoisSidebarForm } from "./components/PoisSidebarForm"
import TablePois from "./components/TablePois/TablePois"
import { LayoutList, Map as MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PoisCardStrip } from "./components/PoisCardStrip/PoisCardStrip"
import type { LanguageCode } from "@/lib/client-types"
import { getAdminPoisUi } from "@/lib/admin-pois-i18n"
import { fetchTours } from "@/lib/api"

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
    const [deleteTourNames, setDeleteTourNames] = useState<string[]>([])

    // CRUD actions
    const { handleCreate, handleUpdate, handleDelete } = usePOIActions(loadPOIs, clearSelection)
    const [viewMode, setViewMode] = useState<"map" | "table">("map")
    const [uiLanguage, setUiLanguage] = useState<LanguageCode>("vi")
    const [narrationLanguage, setNarrationLanguage] = useState<NarrationLanguage>("vi-VN")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    const adminUi = useMemo(() => getAdminPoisUi(uiLanguage), [uiLanguage])

    const narrationText = useMemo(() => {
        if (!selectedPoi) return ""
        const labels = adminUi.panel
        const addressText = selectedPoi.address ? `${labels.addressLabel}: ${selectedPoi.address}.` : ""
        switch (narrationLanguage) {
            case "en-US":
                return `${selectedPoi.name}. ${selectedPoi.description}. ${labels.categoryLabel}: ${selectedPoi.category}. ${selectedPoi.address ? `${labels.addressLabel}: ${selectedPoi.address}.` : ""}`
            case "zh-CN":
                return `${selectedPoi.name}。${selectedPoi.description}。${labels.categoryLabel}：${selectedPoi.category}。${selectedPoi.address ? `${labels.addressLabel}：${selectedPoi.address}。` : ""}`
            default:
                return `${selectedPoi.name}. ${selectedPoi.description}. ${labels.categoryLabel}: ${selectedPoi.category}. ${addressText}`
        }
    }, [selectedPoi, narrationLanguage, adminUi.panel])

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
            setDeleteTourNames([])
            if (editingPoi?.id === deleteTarget.id) {
                setEditingPoi(null)
            }
        }
    }, [deleteTarget, handleDelete, editingPoi])

    const handleRequestDeleteFromCard = useCallback(async (poi: POI) => {
        setDeleteTarget(poi)
        try {
            const tours = await fetchTours()
            const relatedTourNames = tours
                .filter((tour) => tour.pois.some((tourPoi) => tourPoi.poiId === poi.id))
                .map((tour) => tour.name)
            setDeleteTourNames(relatedTourNames)
        } catch {
            setDeleteTourNames([])
        }
    }, [])

    const handleResetForm = useCallback(() => {
        setEditingPoi(null)
        clearSelection()
        deactivatePicker()
    }, [clearSelection, deactivatePicker])

    const handleViewOnMap = useCallback((poi: POI) => {
        selectPoi(poi)
        setViewMode("map")
    }, [selectPoi])

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
                    adminUi={adminUi}
                    onTogglePicker={() => (pickerState.isActive ? deactivatePicker() : activatePicker())}
                    onResetForm={handleResetForm}
                    onSubmit={handleFormSubmit}
                />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
                    <h2 className="text-sm font-semibold text-muted-foreground">
                        {viewMode === "map" ? "Chế độ bản đồ" : "Quản lý danh sách"}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "map" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("map")}
                            className="h-8 gap-1.5"
                        >
                            <MapIcon className="h-4 w-4" />
                            Bản đồ
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="h-8 gap-1.5"
                        >
                            <LayoutList className="h-4 w-4" />
                            Danh sách
                        </Button>
                    </div>
                </div>

                <div className="border-b border-border lg:hidden">
                    <PoisSidebarForm
                        poi={editingPoi}
                        pickerLat={pickerState.lat}
                        pickerLng={pickerState.lng}
                        pickerMode={pickerState.isActive}
                        uiLanguage={uiLanguage}
                        adminUi={adminUi}
                        onTogglePicker={() => (pickerState.isActive ? deactivatePicker() : activatePicker())}
                        onResetForm={handleResetForm}
                        onSubmit={handleFormSubmit}
                    />
                </div>

                {/* Main Content Area */}
                <div className="relative flex-1 overflow-hidden p-4 lg:p-6">
                    {viewMode === "map" ? (
                        <div className="flex h-full flex-col gap-4">
                            <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-border shadow-sm">
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
                                    mapUi={adminUi.map}
                                    className="h-full w-full"
                                />
                            </div>

                            {/* Nearby Locations strip (lower) */}
                            <div className="shrink-0">
                                <PoisCardStrip
                                    pois={pois}
                                    selectedPoi={selectedPoi}
                                    adminUi={adminUi}
                                    uiLanguage={uiLanguage}
                                    onRequestDelete={handleRequestDeleteFromCard}
                                    onSelect={handleEditClick}
                                />
                            </div>
                        </div>
                    ) : (
                        <TablePois
                            pois={pois}
                            adminUi={adminUi}
                            onEdit={handleEditClick}
                            onDelete={setDeleteTarget}
                            onViewOnMap={handleViewOnMap}
                        />
                    )}
                </div>
            </div>

            {selectedPoi && (
                <div className="fixed bottom-4 right-4 z-[70] w-[360px] rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/85">
                    <p className="text-sm font-semibold">{adminUi.panel.audioGuide}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{selectedPoi.name}</p>

                    <div className="mt-3 flex items-center gap-2">
                        <label className="text-xs text-muted-foreground">{adminUi.panel.language}</label>
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
                        <Button
                            onClick={speakNarration}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            {adminUi.panel.playAudio}
                        </Button>
                        <Button
                            onClick={stopNarration}
                            className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        >
                            {adminUi.panel.stop}
                        </Button>
                        <span className="self-center text-xs text-muted-foreground">
                            {isSpeaking ? adminUi.panel.playing : adminUi.panel.ready}
                        </span>
                    </div>
                </div>
            )}

            <PoisDeleteDialog
                poi={deleteTarget}
                deleteUi={adminUi.delete}
                warningMessage={
                    deleteTourNames.length > 0
                        ? uiLanguage === "vi"
                            ? `Cảnh báo: địa điểm này đang thuộc ${deleteTourNames.length} tour (${deleteTourNames.join(", ")}). Xóa địa điểm có thể làm tour bị thiếu điểm.`
                            : `Warning: this location belongs to ${deleteTourNames.length} tour(s) (${deleteTourNames.join(", ")}). Deleting it may leave those tours incomplete.`
                        : undefined
                }
                backLabel={uiLanguage === "vi" ? "Quay lại" : "Back"}
                onClose={() => {
                    setDeleteTarget(null)
                    setDeleteTourNames([])
                }}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

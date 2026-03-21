"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { POI, CreatePOIPayload } from "@/lib/types"
import {
    usePOIs,
    usePOISelection,
    usePOIPicker,
    usePOIActions,
    usePOIDialogs,
} from "@/components/features/admin/components/Pois/hooks/usePois"
import { PoisListHeader } from "./components/PoisCard/PoisListHeader"
import { PoiSearchBar } from "./components/PoiSearchBar"
import { POILoadingState } from "./components/PoisLoadingState"
import { PoisTable } from "./components/PoisTable"
import { PoisMap } from "./components/PoisMap"
import { POIMapInfoOverlay } from "./components/PoisMapsInfoOverlay"
import { POIFormDialog } from "./components/Dialog/PoisFormDialog"
import { PoisDeleteDialog } from "./components/Dialog/PoisDeleteDialog"
import { PoisCardStrip } from "./components/PoisCardStrip"

type NarrationLanguage = "vi-VN" | "en-US" | "zh-CN"

export default function Pois() {
    const {
        pois,
        isLoading,
        search,
        setSearch,
        filterCategory,
        setFilterCategory,
        filteredPois,
        stats,
        loadPOIs,
    } = usePOIs()

    const { selectedPoi, selectPoi, clearSelection } = usePOISelection()

    const { pickerState, activatePicker, deactivatePicker, setPickerLocation } = usePOIPicker()

    const {
        formOpen,
        setFormOpen,
        editingPoi,
        deleteTarget,
        openCreateDialog,
        openEditDialog,
        closeFormDialog,
        openDeleteDialog,
        closeDeleteDialog,
    } = usePOIDialogs()

    // CRUD actions
    const { handleCreate, handleUpdate, handleDelete } = usePOIActions(loadPOIs, clearSelection)
    const [narrationLanguage, setNarrationLanguage] = useState<NarrationLanguage>("vi-VN")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    const narrationText = useMemo(() => {
        if (!selectedPoi) return ""
        const addressText = selectedPoi.address ? `Địa chỉ: ${selectedPoi.address}.` : ""
        switch (narrationLanguage) {
            case "en-US":
                return `${selectedPoi.name}. ${selectedPoi.description}. Category: ${selectedPoi.category}. ${selectedPoi.address ? `Address: ${selectedPoi.address}.` : ""}`
            case "zh-CN":
                return `${selectedPoi.name}。${selectedPoi.description}。分类：${selectedPoi.category}。${selectedPoi.address ? `地址：${selectedPoi.address}。` : ""}`
            default:
                return `${selectedPoi.name}. ${selectedPoi.description}. Danh mục: ${selectedPoi.category}. ${addressText}`
        }
    }, [selectedPoi, narrationLanguage])

    // ─── Event Handlers ─────────────────────────────────────────────────────────

    const handleCreateClick = useCallback(() => {
        openCreateDialog()
        activatePicker()
    }, [openCreateDialog, activatePicker])

    const handleEditClick = useCallback(
        (poi: POI) => {
            openEditDialog(poi)
            deactivatePicker()
        },
        [openEditDialog, deactivatePicker]
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
            }
        },
        [pickerState.isActive, selectPoi]
    )

    const handleViewOnMap = useCallback(
        (poi: POI) => {
            selectPoi(poi)
        },
        [selectPoi]
    )

    const handleFormSubmit = useCallback(
        async (data: CreatePOIPayload) => {
            if (editingPoi) {
                await handleUpdate(editingPoi.id, data)
            } else {
                await handleCreate(data)
            }
            deactivatePicker()
        },
        [editingPoi, handleCreate, handleUpdate, deactivatePicker]
    )

    const handleFormOpenChange = useCallback(
        (open: boolean) => {
            setFormOpen(open)
            if (!open) {
                closeFormDialog()
                deactivatePicker()
            }
        },
        [setFormOpen, closeFormDialog, deactivatePicker]
    )

    const handleDeleteConfirm = useCallback(async () => {
        if (deleteTarget) {
            await handleDelete(deleteTarget)
            closeDeleteDialog()
        }
    }, [deleteTarget, handleDelete, closeDeleteDialog])

    const handleOverlayClose = useCallback(() => {
        clearSelection()
    }, [clearSelection])

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
        <div className="flex h-full flex-col lg:flex-row">
            {/* Left Panel: POI List */}
            <div className="flex h-full w-full flex-col border-r border-border lg:w-[480px] xl:w-[540px]">
                <PoisListHeader
                    stats={stats}
                    filterCategory={filterCategory}
                    onFilterChange={setFilterCategory}
                    onCreateClick={handleCreateClick}
                />

                <PoiSearchBar
                    search={search}
                    onSearchChange={setSearch}
                    resultCount={filteredPois.length}
                />

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <POILoadingState />
                    ) : (
                        <PoisTable
                            pois={filteredPois}
                            selectedPoi={selectedPoi}
                            onSelect={selectPoi}
                            onEdit={handleEditClick}
                            onDelete={openDeleteDialog}
                        />
                    )}
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                {/* Map (upper) */}
                <div className="relative min-h-[280px] flex-1">
                    <PoisMap
                        pois={pois}
                        selectedPoi={selectedPoi}
                        onMapClick={handleMapClick}
                        onMarkerClick={handleMarkerClick}
                        pickerMode={pickerState.isActive}
                        pickerLat={pickerState.lat}
                        pickerLng={pickerState.lng}
                        className="h-full w-full"
                    />

                    {/* Selected POI Info Overlay */}
                    {selectedPoi && !pickerState.isActive && (
                        <POIMapInfoOverlay
                            poi={selectedPoi}
                            onEdit={() => handleEditClick(selectedPoi)}
                            onDelete={() => openDeleteDialog(selectedPoi)}
                            onClose={handleOverlayClose}
                        />
                    )}
                </div>

                {/* Nearby Locations strip (lower) */}
                <div className="shrink-0 border-t border-border">
                    <PoisCardStrip
                        pois={pois}
                        selectedPoi={selectedPoi}
                        onSelect={selectPoi}
                    />
                </div>
            </div>

            {selectedPoi && (
                <div className="fixed bottom-4 right-4 z-[70] w-[360px] rounded-xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/85">
                    <p className="text-sm font-semibold">Audio thuyết minh</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{selectedPoi.name}</p>

                    <div className="mt-3 flex items-center gap-2">
                        <label className="text-xs text-muted-foreground">Ngôn ngữ:</label>
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
                            Phát audio
                        </button>
                        <button
                            type="button"
                            onClick={stopNarration}
                            className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                        >
                            Dừng
                        </button>
                        <span className="self-center text-xs text-muted-foreground">
                            {isSpeaking ? "Đang phát..." : "Sẵn sàng"}
                        </span>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <POIFormDialog
                open={formOpen}
                onOpenChange={handleFormOpenChange}
                poi={editingPoi}
                onSubmit={handleFormSubmit}
                pickerLat={pickerState.lat}
                pickerLng={pickerState.lng}
            />

            <PoisDeleteDialog
                poi={deleteTarget}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    )
}

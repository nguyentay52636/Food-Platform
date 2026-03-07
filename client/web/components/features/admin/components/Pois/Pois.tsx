"use client"

import { useCallback } from "react"
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

            {/* Right Panel: Map */}
            <div className="relative min-h-[300px] flex-1">
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { GripVertical, Plus, X, MapPin, Route, AlertCircle } from "lucide-react"
import type { Tour, POI, TourPOI, CreateTourPayload } from "@/lib/types"
import { SUB_CATEGORY_LABELS } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface TourFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tour?: Tour | null
    allPois: POI[]
    onSubmit: (data: CreateTourPayload) => Promise<void>
}

export function TourFormDialog({
    open,
    onOpenChange,
    tour,
    allPois,
    onSubmit,
}: TourFormDialogProps) {
    const isEdit = !!tour

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<"draft" | "published">("draft")
    const [tourPois, setTourPois] = useState<TourPOI[]>([])
    const [selectedPoiToAdd, setSelectedPoiToAdd] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    useEffect(() => {
        if (tour) {
            setName(tour.name)
            setDescription(tour.description)
            setStatus(tour.status)
            setTourPois([...tour.pois])
        } else {
            setName("")
            setDescription("")
            setStatus("draft")
            setTourPois([])
        }
        setError("")
        setSelectedPoiToAdd("")
    }, [tour, open])

    const availablePois = allPois.filter(
        (p) => !tourPois.some((tp) => tp.poiId === p.id)
    )

    const majorPois = availablePois.filter((p) => p.category === "major")
    const minorPois = availablePois.filter((p) => p.category === "minor")

    function getPoiName(poiId: string): string {
        return allPois.find((p) => p.id === poiId)?.name ?? "Unknown POI"
    }

    function getPoiObj(poiId: string): POI | undefined {
        return allPois.find((p) => p.id === poiId)
    }

    function handleAddPoi() {
        if (!selectedPoiToAdd) return
        const newOrder = tourPois.length + 1
        setTourPois((prev) => [...prev, { poiId: selectedPoiToAdd, order: newOrder }])
        setSelectedPoiToAdd("")
    }

    function handleRemovePoi(poiId: string) {
        setTourPois((prev) =>
            prev
                .filter((tp) => tp.poiId !== poiId)
                .map((tp, i) => ({ ...tp, order: i + 1 }))
        )
    }

    // Drag and drop reorder
    const handleDragStart = useCallback((index: number) => {
        setDragIndex(index)
    }, [])

    const handleDragOver = useCallback(
        (e: React.DragEvent, overIndex: number) => {
            e.preventDefault()
            if (dragIndex === null || dragIndex === overIndex) return
            setTourPois((prev) => {
                const updated = [...prev]
                const [moved] = updated.splice(dragIndex, 1)
                updated.splice(overIndex, 0, moved)
                return updated.map((tp, i) => ({ ...tp, order: i + 1 }))
            })
            setDragIndex(overIndex)
        },
        [dragIndex]
    )

    const handleDragEnd = useCallback(() => {
        setDragIndex(null)
    }, [])

    function moveUp(index: number) {
        if (index === 0) return
        setTourPois((prev) => {
            const updated = [...prev]
                ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
            return updated.map((tp, i) => ({ ...tp, order: i + 1 }))
        })
    }

    function moveDown(index: number) {
        if (index >= tourPois.length - 1) return
        setTourPois((prev) => {
            const updated = [...prev]
                ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
            return updated.map((tp, i) => ({ ...tp, order: i + 1 }))
        })
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!name.trim()) {
            setError("Tour name is required.")
            return
        }

        if (tourPois.length === 0) {
            setError("A tour must have at least one POI.")
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                pois: tourPois,
                status,
            })
            onOpenChange(false)
        } catch {
            setError("Failed to save tour. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5 text-primary" />
                        {isEdit ? "Edit Tour" : "Create New Tour"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the tour details and route below."
                            : "Set up a new tour itinerary by adding POIs in order."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {error && (
                            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Basic info section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="tour-name">
                                    Tour Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tour-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Da Nang Highlights Tour"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="tour-desc">Description</Label>
                                <Textarea
                                    id="tour-desc"
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    placeholder="Describe this tour itinerary, key highlights, and what visitors can expect..."
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={(v: string) => setStatus(v as "draft" | "published")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-warning" />
                                                Draft
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="published">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-success" />
                                                Published
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="my-5" />

                        {/* POI Route Section */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <Label className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    Tour Route (POIs) <span className="text-destructive">*</span>
                                </Label>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Add POIs to build the route. Drag to reorder or use arrows.
                                </p>
                            </div>

                            {/* Add POI control */}
                            <div className="flex items-center gap-2">
                                <Select value={selectedPoiToAdd} onValueChange={setSelectedPoiToAdd}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select a POI to add..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePois.length === 0 ? (
                                            <SelectItem value="_none" disabled>
                                                All POIs have been added
                                            </SelectItem>
                                        ) : (
                                            <>
                                                {majorPois.length > 0 && (
                                                    <>
                                                        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                            Điểm chính
                                                        </div>
                                                        {majorPois.map((p) => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                <span className="flex items-center gap-2">
                                                                    <MapPin className="h-3 w-3 text-primary" />
                                                                    {p.name}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}
                                                {minorPois.length > 0 && (
                                                    <>
                                                        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                            Điểm phụ
                                                        </div>
                                                        {minorPois.map((p) => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                <span className="flex items-center gap-2">
                                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                                    {p.name}
                                                                    {p.subCategory && (
                                                                        <Badge variant="outline" className="text-[9px] px-1 py-0 ml-1">
                                                                            {SUB_CATEGORY_LABELS[p.subCategory] ?? p.subCategory}
                                                                        </Badge>
                                                                    )}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAddPoi}
                                    disabled={!selectedPoiToAdd}
                                    className="gap-1.5 shrink-0"
                                >
                                    <Plus className="h-3.5 w-3.5" /> Add
                                </Button>
                            </div>

                            {/* POI list with drag */}
                            {tourPois.length > 0 ? (
                                <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2">
                                    {tourPois.map((tp, index) => {
                                        const poi = getPoiObj(tp.poiId)
                                        const isMajor = poi?.category === "major"

                                        return (
                                            <div
                                                key={tp.poiId}
                                                draggable
                                                onDragStart={() => handleDragStart(index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-2 rounded-md border px-3 py-2.5 transition-all ${dragIndex === index
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border bg-card hover:bg-muted/30"
                                                    }`}
                                            >
                                                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing" />

                                                {/* Order number */}
                                                <span
                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isMajor
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted text-muted-foreground"
                                                        }`}
                                                >
                                                    {tp.order}
                                                </span>

                                                {/* POI name & info */}
                                                <div className="flex-1 min-w-0">
                                                    <span className="block truncate text-sm font-medium text-foreground">
                                                        {getPoiName(tp.poiId)}
                                                    </span>
                                                    {poi && (
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Category badge */}
                                                <Badge
                                                    variant={isMajor ? "default" : "outline"}
                                                    className={`text-[9px] shrink-0 px-1.5 py-0 ${!isMajor ? "text-muted-foreground" : ""
                                                        }`}
                                                >
                                                    {isMajor
                                                        ? "Điểm chính"
                                                        : poi?.subCategory
                                                            ? SUB_CATEGORY_LABELS[poi.subCategory] ?? poi.subCategory
                                                            : "Điểm phụ"}
                                                </Badge>

                                                {/* Move arrows */}
                                                <div className="flex flex-col shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveUp(index)}
                                                        disabled={index === 0}
                                                        className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                                                        aria-label="Move up"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveDown(index)}
                                                        disabled={index === tourPois.length - 1}
                                                        className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                                                        aria-label="Move down"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                                                    </button>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePoi(tp.poiId)}
                                                    className="rounded-md p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    aria-label={`Remove ${getPoiName(tp.poiId)}`}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )
                                    })}

                                    {/* Summary */}
                                    <div className="mt-1 flex items-center justify-between px-2 py-1 text-[11px] text-muted-foreground">
                                        <span>{tourPois.length} stop{tourPois.length !== 1 ? "s" : ""} in route</span>
                                        <span>{availablePois.length} POI{availablePois.length !== 1 ? "s" : ""} available</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Route className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium text-muted-foreground">No stops added yet</p>
                                    <p className="mt-1 text-xs text-muted-foreground/70">
                                        Use the selector above to add POIs to your tour route.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <DialogFooter className="px-6 py-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="gap-1.5">
                            {isSubmitting ? (
                                <>
                                    <Spinner className="h-4 w-4" /> Saving...
                                </>
                            ) : isEdit ? (
                                "Update Tour"
                            ) : (
                                "Create Tour"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

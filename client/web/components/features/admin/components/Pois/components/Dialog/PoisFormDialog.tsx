"use client"

import { useState, useEffect } from "react"
import type { POI, POICategory, MinorSubCategory, CreatePOIPayload } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

interface POIFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    poi?: POI | null
    onSubmit: (data: CreatePOIPayload) => Promise<void>
    pickerLat?: number
    pickerLng?: number
}

const SUB_CATEGORIES: { value: MinorSubCategory; label: string }[] = [
    { value: "wc", label: "Restroom (WC)" },
    { value: "ticket", label: "Ticket Booth" },
    { value: "parking", label: "Parking" },
    { value: "dock", label: "Dock" },
]

export function POIFormDialog({
    open,
    onOpenChange,
    poi,
    onSubmit,
    pickerLat,
    pickerLng,
}: POIFormDialogProps) {
    const isEdit = !!poi

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState<POICategory>("major")
    const [subCategory, setSubCategory] = useState<MinorSubCategory | "">("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    // Populate form
    useEffect(() => {
        if (poi) {
            setName(poi.name)
            setDescription(poi.description)
            setCategory(poi.category)
            setSubCategory(poi.subCategory ?? "")
            setLatitude(String(poi.latitude))
            setLongitude(String(poi.longitude))
        } else {
            setName("")
            setDescription("")
            setCategory("major")
            setSubCategory("")
            setLatitude(pickerLat != null ? String(pickerLat.toFixed(6)) : "")
            setLongitude(pickerLng != null ? String(pickerLng.toFixed(6)) : "")
        }
        setError("")
    }, [poi, open, pickerLat, pickerLng])

    // Update lat/lng when picker changes (only for create)
    useEffect(() => {
        if (!isEdit && pickerLat != null && pickerLng != null) {
            setLatitude(String(pickerLat.toFixed(6)))
            setLongitude(String(pickerLng.toFixed(6)))
        }
    }, [pickerLat, pickerLng, isEdit])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!name.trim()) {
            setError("Name is required.")
            return
        }

        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        if (isNaN(lat) || isNaN(lng)) {
            setError("Valid latitude and longitude are required. Click the map to select a location.")
            return
        }

        if (category === "minor" && !subCategory) {
            setError("Sub-category is required for minor POIs.")
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                category,
                subCategory: category === "minor" ? (subCategory as MinorSubCategory) : undefined,
                latitude: lat,
                longitude: lng,
            })
            onOpenChange(false)
        } catch {
            setError("Failed to save POI. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit POI" : "Create New POI"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <p className="rounded-md bg-destructive/10 p-2.5 text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="poi-name">Name</Label>
                        <Input
                            id="poi-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dragon Bridge"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="poi-desc">Description</Label>
                        <Textarea
                            id="poi-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this point of interest..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as POICategory)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="major">Điểm chính</SelectItem>
                                    <SelectItem value="minor">Điểm phụ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {category === "minor" && (
                            <div className="flex flex-col gap-2">
                                <Label>Sub-Category</Label>
                                <Select value={subCategory} onValueChange={(v) => setSubCategory(v as MinorSubCategory)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUB_CATEGORIES.map((sc) => (
                                            <SelectItem key={sc.value} value={sc.value}>
                                                {sc.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="poi-lat">Latitude</Label>
                            <Input
                                id="poi-lat"
                                type="number"
                                step="any"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="16.0611"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="poi-lng">Longitude</Label>
                            <Input
                                id="poi-lng"
                                type="number"
                                step="any"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="108.2278"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Saving...
                                </>
                            ) : isEdit ? (
                                "Update POI"
                            ) : (
                                "Create POI"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

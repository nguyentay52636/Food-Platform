"use client"

import { useEffect, useState } from "react"
import type { CreatePOIPayload, MinorSubCategory, POI, POICategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SUB_CATEGORIES: { value: MinorSubCategory; label: string }[] = [
  { value: "wc", label: "Restroom (WC)" },
  { value: "ticket", label: "Ticket Booth" },
  { value: "parking", label: "Parking" },
  { value: "dock", label: "Dock" },
]

const LANGUAGE_OPTIONS = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English" },
  { value: "zh-CN", label: "中文" },
] as const

interface PoisSidebarFormProps {
  poi: POI | null
  pickerLat?: number
  pickerLng?: number
  pickerMode: boolean
  onTogglePicker: () => void
  onResetForm: () => void
  onSubmit: (data: CreatePOIPayload) => Promise<void>
}

export function PoisSidebarForm({
  poi,
  pickerLat,
  pickerLng,
  pickerMode,
  onTogglePicker,
  onResetForm,
  onSubmit,
}: PoisSidebarFormProps) {
  const isEdit = !!poi
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<POICategory>("major")
  const [subCategory, setSubCategory] = useState<MinorSubCategory | "">("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [narrationLanguage, setNarrationLanguage] = useState<string>("vi-VN")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (poi) {
      setName(poi.name)
      setDescription(poi.description)
      setCategory(poi.category)
      setSubCategory(poi.subCategory ?? "")
      setLatitude(String(poi.latitude))
      setLongitude(String(poi.longitude))
      setImageUrl(poi.imageUrl ?? "")
      setAudioUrl(poi.audioUrl ?? "")
      setNarrationLanguage(poi.narrationLanguages?.[0] ?? "vi-VN")
    } else {
      setName("")
      setDescription("")
      setCategory("major")
      setSubCategory("")
      setLatitude(pickerLat != null ? String(pickerLat.toFixed(6)) : "")
      setLongitude(pickerLng != null ? String(pickerLng.toFixed(6)) : "")
      setImageUrl("")
      setAudioUrl("")
      setNarrationLanguage("vi-VN")
    }
    setError("")
  }, [poi, pickerLat, pickerLng])

  useEffect(() => {
    if (pickerLat != null && pickerLng != null) {
      setLatitude(String(pickerLat.toFixed(6)))
      setLongitude(String(pickerLng.toFixed(6)))
    }
  }, [pickerLat, pickerLng])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
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
        imageUrl: imageUrl.trim() || undefined,
        audioUrl: audioUrl.trim() || undefined,
        narrationLanguages: [narrationLanguage],
      })
    } catch {
      setError("Failed to save POI. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Quản lý điểm đến</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isEdit ? "Đang chỉnh sửa POI đã chọn" : "Thêm POI mới trực tiếp từ sidebar"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {error && <p className="rounded-md bg-destructive/10 p-2.5 text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <Label htmlFor="poi-name">Tên điểm đến</Label>
            <Input id="poi-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên POI" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="poi-desc">Mô tả</Label>
            <Textarea
              id="poi-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về địa điểm..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Loại điểm</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as POICategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Điểm chính</SelectItem>
                  <SelectItem value="minor">Điểm nhỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {category === "minor" && (
              <div className="space-y-1.5">
                <Label>Loại phụ</Label>
                <Select value={subCategory} onValueChange={(value) => setSubCategory(value as MinorSubCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại..." />
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

          <div className="space-y-1.5">
            <Label htmlFor="poi-image">Ảnh đại diện (URL)</Label>
            <Input
              id="poi-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="poi-audio">Audio URL</Label>
            <Input
              id="poi-audio"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Đa ngôn ngữ</Label>
            <Select value={narrationLanguage} onValueChange={setNarrationLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 border-t border-border px-4 py-3">
          <Button type="button" variant={pickerMode ? "default" : "outline"} className="w-full" onClick={onTogglePicker}>
            {pickerMode ? "Đang chọn trên bản đồ..." : "Chọn tọa độ từ bản đồ"}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onResetForm}>
              Đặt lại
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Đang lưu
                </>
              ) : isEdit ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

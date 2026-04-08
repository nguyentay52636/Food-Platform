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
  uiLanguage: "vi" | "en" | "zh"
  onTogglePicker: () => void
  onResetForm: () => void
  onSubmit: (data: CreatePOIPayload) => Promise<void>
}

const FORM_TEXT = {
  vi: {
    title: "Quản lý điểm đến",
    subtitleEdit: "Đang chỉnh sửa POI đã chọn",
    subtitleCreate: "Thêm POI mới trực tiếp từ sidebar",
    latitude: "Latitude",
    longitude: "Longitude",
    name: "Tên điểm đến",
    description: "Mô tả",
    descriptionPlaceholder: "Mô tả ngắn về địa điểm...",
    poiType: "Loại điểm",
    primaryPoint: "Điểm chính",
    secondaryPoint: "Điểm nhỏ",
    subType: "Loại phụ",
    subTypePlaceholder: "Chọn loại...",
    imageUrl: "Ảnh đại diện (URL)",
    audioUrl: "Audio URL",
    language: "Đa ngôn ngữ",
    languagePlaceholder: "Chọn ngôn ngữ",
    mapPickerOn: "Đang chọn trên bản đồ...",
    mapPickerOff: "Chọn tọa độ từ bản đồ",
    reset: "Đặt lại",
    update: "Cập nhật",
    create: "Thêm mới",
    saving: "Đang lưu",
  },
  en: {
    title: "POI Management",
    subtitleEdit: "Editing selected POI",
    subtitleCreate: "Create POI directly from sidebar",
    latitude: "Latitude",
    longitude: "Longitude",
    name: "POI name",
    description: "Description",
    descriptionPlaceholder: "Short description for this location...",
    poiType: "POI type",
    primaryPoint: "Primary point",
    secondaryPoint: "Secondary point",
    subType: "Sub type",
    subTypePlaceholder: "Select type...",
    imageUrl: "Image URL",
    audioUrl: "Audio URL",
    language: "Language",
    languagePlaceholder: "Select language",
    mapPickerOn: "Selecting on map...",
    mapPickerOff: "Pick coordinates from map",
    reset: "Reset",
    update: "Update",
    create: "Create",
    saving: "Saving",
  },
  zh: {
    title: "兴趣点管理",
    subtitleEdit: "正在编辑已选点位",
    subtitleCreate: "在侧栏直接新增点位",
    latitude: "纬度",
    longitude: "经度",
    name: "点位名称",
    description: "描述",
    descriptionPlaceholder: "输入地点简短描述...",
    poiType: "点位类型",
    primaryPoint: "主要点位",
    secondaryPoint: "次要点位",
    subType: "子类型",
    subTypePlaceholder: "选择类型...",
    imageUrl: "图片链接 (URL)",
    audioUrl: "音频链接 (URL)",
    language: "语言",
    languagePlaceholder: "选择语言",
    mapPickerOn: "地图选点中...",
    mapPickerOff: "从地图选择坐标",
    reset: "重置",
    update: "更新",
    create: "新增",
    saving: "保存中",
  },
} as const

export function PoisSidebarForm({
  poi,
  pickerLat,
  pickerLng,
  pickerMode,
  uiLanguage,
  onTogglePicker,
  onResetForm,
  onSubmit,
}: PoisSidebarFormProps) {
  const t = FORM_TEXT[uiLanguage]
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
        <p className="text-sm font-semibold">{t.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isEdit ? t.subtitleEdit : t.subtitleCreate}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {error && <p className="rounded-md bg-destructive/10 p-2.5 text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="poi-lat">{t.latitude}</Label>
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
              <Label htmlFor="poi-lng">{t.longitude}</Label>
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
            <Label htmlFor="poi-name">{t.name}</Label>
            <Input id="poi-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="poi-desc">{t.description}</Label>
            <Textarea
              id="poi-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t.poiType}</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as POICategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">{t.primaryPoint}</SelectItem>
                  <SelectItem value="minor">{t.secondaryPoint}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {category === "minor" && (
              <div className="space-y-1.5">
                <Label>{t.subType}</Label>
                <Select value={subCategory} onValueChange={(value) => setSubCategory(value as MinorSubCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.subTypePlaceholder} />
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
            <Label htmlFor="poi-image">{t.imageUrl}</Label>
            <Input
              id="poi-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="poi-audio">{t.audioUrl}</Label>
            <Input
              id="poi-audio"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.language}</Label>
            <Select value={narrationLanguage} onValueChange={setNarrationLanguage}>
              <SelectTrigger>
                <SelectValue placeholder={t.languagePlaceholder} />
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
            {pickerMode ? t.mapPickerOn : t.mapPickerOff}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onResetForm}>
              {t.reset}
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t.saving}
                </>
              ) : isEdit ? (
                t.update
              ) : (
                t.create
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

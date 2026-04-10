"use client"

import { useEffect, useState } from "react"
import type { CreatePOIPayload, MinorSubCategory, POI, POICategory } from "@/lib/types"
import type { OwnerUser } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, X, ImagePlus } from "lucide-react"
import { createOwner, fetchOwners } from "@/lib/api"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import type { LanguageCode } from "@/lib/client-types"
import { SUPPORTED_LANGUAGES } from "@/lib/client-types"
import { getLanguageLabel } from "@/lib/language-labels"
import { createPoi } from "@/apis/poisApi"
import { register } from "@/apis/authApi"
import { toast } from "sonner"

const SUB_CATEGORY_KEYS: { value: MinorSubCategory; subKey: keyof AdminPoisUi["sub"] }[] = [
  { value: "wc", subKey: "wc" },
  { value: "ticket", subKey: "ticket" },
  { value: "parking", subKey: "parking" },
  { value: "dock", subKey: "dock" },
]

const NARRATION_LANGUAGE_MAP: Record<LanguageCode, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  ar: "ar-SA",
  hi: "hi-IN",
  th: "th-TH",
  id: "id-ID",
  ms: "ms-MY",
  tr: "tr-TR",
  nl: "nl-NL",
  pl: "pl-PL",
  sv: "sv-SE",
}

interface PoisSidebarFormProps {
  poi: POI | null
  pickerLat?: number
  pickerLng?: number
  pickerMode: boolean
  uiLanguage: LanguageCode
  adminUi: AdminPoisUi
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
    owner: "Chủ shop",
    ownerPlaceholder: "Chọn chủ shop...",
    addOwner: "Tạo chủ shop mới",
    ownerUsername: "Tài khoản",
    ownerEmail: "Email",
    ownerPassword: "Mật khẩu",
    ownerCreate: "Tạo",
    images: "Danh sách hình ảnh",
    addImages: "Thêm hình ảnh",
    rangeTrigger: "Phạm vi kích hoạt (m)",
    address: "Địa chỉ",
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
    owner: "Owner",
    ownerPlaceholder: "Select owner...",
    addOwner: "Create owner",
    ownerUsername: "Username",
    ownerPassword: "Password",
    ownerCreate: "Create",
    images: "Image gallery",
    addImages: "Add images",
    rangeTrigger: "Range trigger (m)",
    address: "Address",
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
    owner: "店主",
    ownerPlaceholder: "选择店主...",
    addOwner: "新增店主",
    ownerUsername: "账号",
    ownerPassword: "密码",
    ownerCreate: "新增",
    images: "图片库",
    addImages: "添加图片",
    rangeTrigger: "触发范围 (米)",
    address: "地址",
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
  adminUi,
  onTogglePicker,
  onResetForm,
  onSubmit,
}: PoisSidebarFormProps) {
  const t = adminUi.form
  const err = adminUi.errors
  const isEdit = !!poi
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<POICategory>("major")
  const [subCategory, setSubCategory] = useState<MinorSubCategory | "">("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [narrationLanguage, setNarrationLanguage] = useState<string>("vi-VN")
  const [rangeTrigger, setRangeTrigger] = useState("50")
  const [address, setAddress] = useState("")
  const [owners, setOwners] = useState<OwnerUser[]>([])
  const [ownerId, setOwnerId] = useState<string>("")
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false)
  const [newOwnerUsername, setNewOwnerUsername] = useState("")
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [newOwnerPassword, setNewOwnerPassword] = useState("")
  const [isCreatingOwner, setIsCreatingOwner] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    fetchOwners()
      .then((data) => {
        if (!mounted) return
        setOwners(data)
      })
      .catch(() => {
        // ignore for demo
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (poi) {
      setName(poi.name)
      setDescription(poi.description)
      setCategory(poi.category)
      setSubCategory(poi.subCategory ?? "")
      setLatitude(String(poi.latitude))
      setLongitude(String(poi.longitude))
      setImageUrl(poi.imageUrl ?? "")
      setNarrationLanguage(poi.narrationLanguages?.[0] ?? "vi-VN")
      setOwnerId(poi.ownerId ?? "")
      setRangeTrigger(String(poi.rangeTrigger ?? 50))
      setAddress(poi.address ?? "")
      setImageFiles([])
      setImagePreviews(poi.images ?? [])
    } else {
      setName("")
      setDescription("")
      setCategory("major")
      setSubCategory("")
      setLatitude(pickerLat != null ? String(pickerLat.toFixed(6)) : "")
      setLongitude(pickerLng != null ? String(pickerLng.toFixed(6)) : "")
      setImageUrl("")
      setNarrationLanguage("vi-VN")
      setOwnerId("")
      setRangeTrigger("50")
      setAddress("")
      setImageFiles([])
      setImagePreviews([])
    }
    setError("")
  }, [poi, pickerLat, pickerLng])

  useEffect(() => {
    if (pickerLat != null && pickerLng != null) {
      setLatitude(String(pickerLat.toFixed(6)))
      setLongitude(String(pickerLng.toFixed(6)))
    }
  }, [pickerLat, pickerLng])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles = [...imageFiles, ...files]
    setImageFiles(newFiles)

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews]
    const previewToRemove = newPreviews[index]

    // Revoke the object URL to avoid memory leaks if it was locally created
    if (previewToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove)
    }

    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)

    // Adjust imageFiles index correctly
    // We need to know which ones are files and which are existing URLs
    // For simplicity, let's assume imageFiles maps to the end of imagePreviews if we just added them
    // but a more robust way is needed if we mix them.
    // For now, let's just clear files if we remove something that might be a file
    const fileIndex = index - (imagePreviews.length - imageFiles.length)
    if (fileIndex >= 0) {
      const newFiles = [...imageFiles]
      newFiles.splice(fileIndex, 1)
      setImageFiles(newFiles)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError(err.nameRequired)
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError(err.coordsInvalid)
      return
    }

    if (category === "minor" && !subCategory) {
      setError(err.subCategoryRequired)
      return
    }

    setIsSubmitting(true)
    try {
      if (isEdit) {
        // If editing is still handled by the parent onSubmit
        await onSubmit({
          name: name.trim(),
          description: description.trim(),
          category,
          subCategory: category === "minor" ? (subCategory as MinorSubCategory) : undefined,
          latitude: lat,
          longitude: lng,
          imageUrl: imageUrl.trim() || imagePreviews[0] || undefined,
          narrationLanguages: [narrationLanguage],
          ownerId: ownerId || undefined,
          rangeTrigger: parseInt(rangeTrigger, 10) || 50,
          address: address.trim() || undefined,
        })
      } else {
        await createPoi({
          tenPOI: name.trim(),
          loaiPOI: category,
          moTa: description.trim(),
          latitude: lat,
          longitude: lng,
          rangeTrigger: parseInt(rangeTrigger, 10) || 50,
          thumbnail: imageUrl.trim() || imagePreviews[0] || "",
          images: imagePreviews,
          address: address.trim(),
        })

        toast.success("Thêm địa điểm thành công!")
        onResetForm() // Reset after success
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save POI. Please try again.")
      toast.error("Có lỗi xảy ra khi thêm địa điểm.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateOwner() {
    setIsCreatingOwner(true)
    setError("")
    try {
      const response = await register({
        username: newOwnerUsername,
        email: newOwnerEmail,
        password: newOwnerPassword,
      })
      
      const created = {
        id: response.user._id,
        name: response.user.username,
        username: response.user.username,
        password: "", // Not stored locally
        role: "owner" as const,
        poiIds: []
      }
      
      const updated = [created, ...owners]
      setOwners(updated)
      setOwnerId(created.id)
      setIsOwnerDialogOpen(false)
      setNewOwnerUsername("")
      setNewOwnerEmail("")
      setNewOwnerPassword("")
      toast.success("Tạo chủ shop thành công!")
    } catch (e: any) {
      setError(e?.message || "Failed to create owner.")
      toast.error(e?.message || "Lỗi khi tạo chủ shop.")
    } finally {
      setIsCreatingOwner(false)
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
            <Label htmlFor="poi-address">{t.address}</Label>
            <Input id="poi-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.address} />
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
                    {SUB_CATEGORY_KEYS.map((sc) => (
                      <SelectItem key={sc.value} value={sc.value}>
                        {adminUi.sub[sc.subKey]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="poi-range">{t.rangeTrigger}</Label>
              <Input
                id="poi-range"
                type="number"
                value={rangeTrigger}
                onChange={(e) => setRangeTrigger(e.target.value)}
                placeholder="50"
              />
            </div>
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

          <div className="space-y-2">
            <Label>{t.images}</Label>
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="group relative aspect-square rounded-md border border-border bg-muted overflow-hidden">
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border hover:bg-muted/50 transition-colors">
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                <span className="mt-1 text-[10px] text-muted-foreground">{t.addImages}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label>{t.owner}</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOwnerDialogOpen(true)}
                aria-label={t.addOwner}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger>
                <SelectValue placeholder={t.ownerPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {owners.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* 
          <div className="space-y-1.5">
            <Label>{t.language}</Label>
            <Select value={narrationLanguage} onValueChange={setNarrationLanguage}>
              <SelectTrigger>
                <SelectValue placeholder={t.languagePlaceholder} />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-scroll pr-1">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <SelectItem key={language.code} value={NARRATION_LANGUAGE_MAP[language.code]}>
                    {language.flag} {getLanguageLabel(language.code, uiLanguage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
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

      <Dialog open={isOwnerDialogOpen} onOpenChange={setIsOwnerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.addOwner}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="owner-username">{t.ownerUsername}</Label>
              <Input
                id="owner-username"
                value={newOwnerUsername}
                onChange={(e) => setNewOwnerUsername(e.target.value)}
                placeholder="owner_shop_01"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="owner-email">{t.ownerEmail}</Label>
              <Input
                id="owner-email"
                type="email"
                value={newOwnerEmail}
                onChange={(e) => setNewOwnerEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="owner-password">{t.ownerPassword}</Label>
              <Input
                id="owner-password"
                type="password"
                value={newOwnerPassword}
                onChange={(e) => setNewOwnerPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOwnerDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="button" onClick={handleCreateOwner} disabled={isCreatingOwner}>
              {isCreatingOwner ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  {t.saving}
                </>
              ) : (
                t.ownerCreate
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

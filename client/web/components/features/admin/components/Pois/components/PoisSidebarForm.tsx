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
import { Plus } from "lucide-react"
import { createOwner, fetchOwners } from "@/lib/api"
import type { LanguageCode } from "@/lib/client-types"
import { getAdminPoisBundle } from "@/lib/i18n/admin-pois-i18n"

const SUB_CATEGORY_KEYS: MinorSubCategory[] = ["wc", "ticket", "parking", "dock"]

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
  uiLanguage: LanguageCode
  onTogglePicker: () => void
  onResetForm: () => void
  onSubmit: (data: CreatePOIPayload) => Promise<void>
}

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
  const bundle = getAdminPoisBundle(uiLanguage)
  const t = bundle.form
  const v = bundle.validation
  const isEdit = !!poi
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<POICategory>("major")
  const [subCategory, setSubCategory] = useState<MinorSubCategory | "">("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [narrationLanguage, setNarrationLanguage] = useState<string>("vi-VN")
  const [owners, setOwners] = useState<OwnerUser[]>([])
  const [ownerId, setOwnerId] = useState<string>("")
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false)
  const [newOwnerUsername, setNewOwnerUsername] = useState("")
  const [newOwnerPassword, setNewOwnerPassword] = useState("")
  const [isCreatingOwner, setIsCreatingOwner] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

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
      setError(v.nameRequired)
      return
    }

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError(v.coordsInvalid)
      return
    }

    if (category === "minor" && !subCategory) {
      setError(v.subCategoryRequired)
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
        narrationLanguages: [narrationLanguage],
        ownerId: ownerId || undefined,
      })
    } catch {
      setError(v.saveFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateOwner() {
    setIsCreatingOwner(true)
    setError("")
    try {
      const created = await createOwner({
        username: newOwnerUsername,
        password: newOwnerPassword,
      })
      const updated = [created, ...owners]
      setOwners(updated)
      setOwnerId(created.id)
      setIsOwnerDialogOpen(false)
      setNewOwnerUsername("")
      setNewOwnerPassword("")
    } catch (e) {
      setError(e instanceof Error ? e.message : v.ownerCreateFailed)
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
                    {SUB_CATEGORY_KEYS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {bundle.subCategories[value]}
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

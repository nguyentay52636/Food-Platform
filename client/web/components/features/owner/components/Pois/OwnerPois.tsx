"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Star, Image as ImageIcon, Pencil } from "lucide-react"
import type { POI, Review, UpdatePOIPayload } from "@/lib/types"
import { fetchOwnerPOIReviews, fetchOwnerPOIs, updateOwnerPOI } from "@/lib/api"
import { filterPoisBySearch, getSubCategoryLabel, formatCoordinates } from "@/lib/poi-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

function formatDate(iso?: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString()
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(rating)
        return (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        )
      })}
    </div>
  )
}

export function OwnerPois({ ownerId }: { ownerId: string }) {
  const [pois, setPois] = useState<POI[]>([])
  const [isLoadingPois, setIsLoadingPois] = useState(true)
  const [search, setSearch] = useState("")

  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null)
  const selectedPoi = useMemo(() => pois.find((p) => p.id === selectedPoiId) ?? null, [pois, selectedPoiId])

  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  const [draftImageUrl, setDraftImageUrl] = useState("")
  const [draftDescription, setDraftDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoadingPois(true)
    setPois([])
    setSelectedPoiId(null)

    fetchOwnerPOIs(ownerId)
      .then((data) => {
        if (cancelled) return
        setPois(data)
        setSelectedPoiId(data[0]?.id ?? null)
      })
      .catch(() => {
        toast.error("Không thể tải POI của owner")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPois(false)
      })

    return () => {
      cancelled = true
    }
  }, [ownerId])

  useEffect(() => {
    if (!selectedPoi) {
      setReviews([])
      return
    }

    let cancelled = false
    setIsLoadingReviews(true)

    fetchOwnerPOIReviews(ownerId, selectedPoi.id, 1, 20)
      .then((res) => {
        if (cancelled) return
        setReviews(res.data)
      })
      .catch(() => {
        toast.error("Không thể tải danh sách review")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingReviews(false)
      })

    return () => {
      cancelled = true
    }
  }, [ownerId, selectedPoi?.id])

  useEffect(() => {
    if (!selectedPoi) return
    setDraftImageUrl(selectedPoi.imageUrl ?? "")
    setDraftDescription(selectedPoi.description ?? "")
  }, [selectedPoi?.id])

  const filteredPois = useMemo(() => {
    return filterPoisBySearch(pois, search)
  }, [pois, search])

  const handleSave = async () => {
    if (!selectedPoi) return
    const nextPayload: UpdatePOIPayload = {
      imageUrl: draftImageUrl.trim() ? draftImageUrl.trim() : undefined,
      description: draftDescription.trim(),
    }

    setIsSaving(true)
    try {
      const updated = await updateOwnerPOI(ownerId, selectedPoi.id, nextPayload)
      setPois((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setDraftImageUrl(updated.imageUrl ?? "")
      setDraftDescription(updated.description ?? "")
      toast.success("Cập nhật thành công")
    } catch {
      toast.error("Cập nhật thất bại")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left: list */}
      <div className="w-full max-w-xl border-r border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">POI của bạn</h2>
              <p className="text-xs text-muted-foreground">Chỉ hiển thị POI được owner gán.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tổng</p>
              <p className="text-sm font-semibold">{pois.length}</p>
            </div>
          </div>

          <div className="mt-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc mô tả..."
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-160px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Quán/POI</TableHead>
                <TableHead className="hidden sm:table-cell">Loại</TableHead>
                <TableHead className="hidden md:table-cell">Đánh giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPois ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Spinner />
                      Đang tải...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPois.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10">
                    <div className="flex flex-col items-center text-center gap-2">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">Không có POI nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPois.map((poi) => (
                  <TableRow
                    key={poi.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPoiId === poi.id ? "bg-accent" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPoiId(poi.id)}
                  >
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          {poi.imageUrl ? (
                            <Image src={poi.imageUrl} alt={poi.name} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/60">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{poi.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {poi.description || "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={poi.category === "major" ? "default" : "secondary"} className="text-xs">
                          {poi.category === "major" ? "Điểm chính" : "Điểm nhỏ"}
                        </Badge>
                        {poi.subCategory && (
                          <Badge variant="outline" className="text-xs">
                            {getSubCategoryLabel(poi.subCategory)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {typeof poi.rating === "number" ? (
                        <div className="flex items-center gap-2">
                          <Stars rating={poi.rating} />
                          <span className="text-sm font-medium">{poi.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Chưa có đánh giá</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Right: editor + reviews */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {!selectedPoi ? (
              <Card className="p-8 flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Chọn một POI ở bên trái</p>
                </div>
              </Card>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-foreground truncate">{selectedPoi.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatCoordinates(selectedPoi.latitude, selectedPoi.longitude)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {typeof selectedPoi.rating === "number" ? (
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-sm">{selectedPoi.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({selectedPoi.reviewCount?.toLocaleString() ?? 0})
                        </span>
                      </div>
                    ) : (
                      <Badge variant="secondary">Chưa có đánh giá</Badge>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-1">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Cập nhật hình ảnh & mô tả</p>
                        <p className="mt-1 text-xs text-muted-foreground">Owner chỉ được chỉnh các trường này.</p>
                      </div>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="mt-4 grid gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Ảnh đại diện (URL)</p>
                        <div className="mt-2 relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                          {draftImageUrl.trim() ? (
                            <Image src={draftImageUrl.trim()} alt={selectedPoi.name} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                              <ImageIcon className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <Input value={draftImageUrl} onChange={(e) => setDraftImageUrl(e.target.value)} placeholder="https://..." />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Mô tả</p>
                        <Textarea
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                          rows={4}
                          className="mt-2"
                          placeholder="Viết mô tả ngắn..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm font-semibold text-foreground">Đánh giá người dùng</p>
                    <p className="mt-1 text-xs text-muted-foreground">Xem các review cho POI này.</p>

                    <div className="mt-4">
                      {isLoadingReviews ? (
                        <div className="flex items-center gap-2 text-muted-foreground py-6">
                          <Spinner />
                          Đang tải review...
                        </div>
                      ) : reviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Chưa có đánh giá.</p>
                      ) : (
                        <div className="space-y-3">
                          {reviews.map((r) => (
                            <div key={r.id} className="rounded-lg border border-border bg-card p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold">{r.userName}</p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <Stars rating={r.rating} />
                                    <span className="text-sm font-medium">{r.rating.toFixed(0)}</span>
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{formatDate(r.createdAt)}</span>
                              </div>
                              {r.content && <p className="mt-2 text-sm text-muted-foreground">{r.content}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


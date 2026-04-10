"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import {
  Plus,
  Search,
  Route,
  LayoutGrid,
  LayoutList,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import type { Tour, POI, CreateTourPayload } from "@/lib/types"
import { fetchTours, fetchPOIs, createTour, updateTour, deleteTour } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { TourFormDialog } from "@/components/features/admin/components/Tours/components/TourFormDialog"
import { TourDetailPanel } from "@/components/features/admin/components/Tours/components/TourPanel"
import { TourEmptyState } from "@/components/features/admin/components/Tours/components/TourEmptyState"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { TourPaywallDialog } from "@/components/features/admin/components/Tours/components/TourPaywallDialog"
import { TourDeleteDialog } from "@/components/features/admin/components/Tours/components/TourDeleteDialog"
import { TourGridCard } from "@/components/features/admin/components/Tours/components/TourGridCard"
import { TourListRow } from "@/components/features/admin/components/Tours/components/TourListRow"
import { ToursInsightsSection } from "@/components/features/admin/components/Tours/components/ToursInsightsSection"
import {
  TOUR_PACKAGES,
  TOUR_WALLET_BALANCE_KEY,
  TOUR_PACKAGE_EXPIRY_KEY,
  type TourPackageId,
} from "@/components/features/admin/components/Tours/components/tour-packages"
import { formatVnd, getTourRelativeTime } from "@/components/features/admin/components/Tours/components/tour-format"

type ViewMode = "grid" | "list"
type FilterStatus = "all" | "draft" | "published"

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [allPois, setAllPois] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [walletBalance, setWalletBalance] = useState(0)
  const [depositInput, setDepositInput] = useState("100000")
  const [selectedPackage, setSelectedPackage] = useState<TourPackageId>("monthly")
  const [packageExpiry, setPackageExpiry] = useState<string | null>(null)
  const [paywallTarget, setPaywallTarget] = useState<Tour | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null)
  const [viewingTour, setViewingTour] = useState<Tour | null>(null)
  /** Tour đang hiển thị lộ trình trên bản đồ (cập nhật mỗi khi bấm vào một tour). */
  const [routePreviewTour, setRoutePreviewTour] = useState<Tour | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [toursData, poisData] = await Promise.all([fetchTours(), fetchPOIs()])
      setTours(toursData)
      setAllPois(poisData)
    } catch {
      toast.error("Tải dữ liệu thất bại")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedBalance = window.localStorage.getItem(TOUR_WALLET_BALANCE_KEY)
    const savedExpiry = window.localStorage.getItem(TOUR_PACKAGE_EXPIRY_KEY)
    if (savedBalance) setWalletBalance(Number(savedBalance) || 0)
    if (savedExpiry) setPackageExpiry(savedExpiry)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(TOUR_WALLET_BALANCE_KEY, String(walletBalance))
  }, [walletBalance])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (packageExpiry) {
      window.localStorage.setItem(TOUR_PACKAGE_EXPIRY_KEY, packageExpiry)
    } else {
      window.localStorage.removeItem(TOUR_PACKAGE_EXPIRY_KEY)
    }
  }, [packageExpiry])

  const hasValidPackage = useMemo(() => {
    if (!packageExpiry) return false
    return new Date(packageExpiry).getTime() > Date.now()
  }, [packageExpiry])

  const filteredTours = useMemo(() => {
    return tours.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === "all" || t.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [tours, search, filterStatus])

  useEffect(() => {
    if (filteredTours.length === 0) {
      setRoutePreviewTour(null)
      return
    }
    setRoutePreviewTour((prev) => {
      if (prev && filteredTours.some((t) => t.id === prev.id)) return prev
      return filteredTours[0]!
    })
  }, [filteredTours])

  const stats = useMemo(() => {
    return {
      total: tours.length,
      published: tours.filter((t) => t.status === "published").length,
      draft: tours.filter((t) => t.status === "draft").length,
      totalPois: new Set(tours.flatMap((t) => t.pois.map((p) => p.poiId))).size,
    }
  }, [tours])

  const visualStats = useMemo(() => {
    const totalStops = filteredTours.reduce((acc, t) => acc + t.pois.length, 0)
    const avgStops = filteredTours.length ? Math.round(totalStops / filteredTours.length) : 0
    const publishedRatio = stats.total ? Math.round((stats.published / stats.total) * 100) : 0
    const engagementScore = Math.min(99, 62 + filteredTours.length * 4 + avgStops * 2)
    const vibeScore = Math.min(100, 55 + stats.totalPois * 3)
    const trendScore = Math.min(100, 48 + publishedRatio / 2 + filteredTours.length * 3)

    return {
      totalStops,
      avgStops,
      publishedRatio,
      engagementScore,
      vibeScore,
      trendScore,
    }
  }, [filteredTours, stats.total, stats.published, stats.totalPois])

  function getPoiName(poiId: string) {
    return allPois.find((p) => p.id === poiId)?.name ?? "Unknown"
  }

  function handleDeposit() {
    const amount = Number(depositInput)
    if (!Number.isFinite(amount) || amount < 10000) {
      toast.error("Số tiền nạp tối thiểu là 10.000 VND")
      return
    }
    setWalletBalance((prev) => prev + amount)
    toast.success(`Đã nạp ${formatVnd(amount)} vào ví`)
  }

  function purchaseSelectedPackage() {
    const pkg = TOUR_PACKAGES[selectedPackage]
    if (walletBalance < pkg.price) {
      toast.error("Số dư không đủ. Vui lòng nạp tiền để mua gói.")
      return false
    }
    const expiry = new Date(Date.now() + pkg.days * 24 * 60 * 60 * 1000).toISOString()
    setWalletBalance((prev) => prev - pkg.price)
    setPackageExpiry(expiry)
    toast.success(`Mua ${pkg.name} thành công. Hạn dùng đến ${new Date(expiry).toLocaleDateString("vi-VN")}.`)
    return true
  }

  function handlePurchasePackage() {
    purchaseSelectedPackage()
  }

  function handleViewTour(tour: Tour) {
    setRoutePreviewTour(tour)
    if (!hasValidPackage) {
      setPaywallTarget(tour)
      return
    }
    setViewingTour(tour)
  }

  function handleUnlockAndOpenTour() {
    if (!paywallTarget) return
    const target = paywallTarget
    const ok = purchaseSelectedPackage()
    if (!ok) return
    setPaywallTarget(null)
    setViewingTour(target)
  }

  function handleCreate() {
    setEditingTour(null)
    setFormOpen(true)
  }

  function handleEdit(tour: Tour) {
    setEditingTour(tour)
    setFormOpen(true)
  }

  async function handleDuplicate(tour: Tour) {
    try {
      await createTour({
        name: `${tour.name} (Copy)`,
        description: tour.description,
        pois: tour.pois,
        status: "draft",
      })
      toast.success(`Đã nhân bản "${tour.name}"`)
      await loadData()
    } catch {
      toast.error("Nhân bản tour thất bại")
    }
  }

  async function handleFormSubmit(data: CreateTourPayload) {
    if (editingTour) {
      const updated = await updateTour(editingTour.id, data)
      toast.success(`"${data.name}" đã được cập nhật`)
      if (viewingTour?.id === editingTour.id) {
        setViewingTour(updated)
      }
    } else {
      await createTour(data)
      toast.success(`"${data.name}" đã được tạo`)
    }
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteTour(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" đã được xóa`)
      if (viewingTour?.id === deleteTarget.id) setViewingTour(null)
      await loadData()
    } catch {
      toast.error("Failed to delete tour")
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Quản lý tour</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Danh sách tour ẩm thực — nhấn vào một tour để xem lộ trình và các điểm dừng.
              </p>
            </div>
            <Button size="sm" onClick={handleCreate} className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> Tour mới
            </Button>
          </div>



          {!isLoading && (
            <div className="mt-4 flex flex-wrap cursor-pointer items-center gap-2">
              <Button onClick={() => setFilterStatus("all")}>
                <Route className="h-3.5 w-3.5" />
                Tất cả ({stats.total})
              </Button>
              <Button onClick={() => setFilterStatus("published")}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã xuất bản ({stats.published})
              </Button>
              <Button onClick={() => setFilterStatus("draft")}>
                <FileText className="h-3.5 w-3.5" />
                Bản nháp ({stats.draft})
              </Button>
            </div>
          )}
        </div>

        <div className="shrink-0 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mô tả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center rounded-md border border-border">
              <Button
                onClick={() => setViewMode("grid")}
                className="mx-3 cursor-pointer"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                className="cursor-pointer"
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Spinner className="h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">Đang tải danh sách tour...</p>
              </div>
            </div>
          ) : filteredTours.length === 0 ? (
            <TourEmptyState search={search} filterStatus={filterStatus} onCreateClick={handleCreate} />
          ) : viewMode === "grid" ? (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTours.map((tour) => (
                  <TourGridCard
                    key={tour.id}
                    tour={tour}
                    isSelected={
                      routePreviewTour?.id === tour.id || viewingTour?.id === tour.id
                    }
                    allPois={allPois}
                    getPoiName={getPoiName}
                    onClick={() => handleViewTour(tour)}
                    onEdit={() => handleEdit(tour)}
                    onDuplicate={() => handleDuplicate(tour)}
                    onDelete={() => setDeleteTarget(tour)}
                  />
                ))}
              </div>

              <ToursInsightsSection
                tour={routePreviewTour}
                allPois={allPois}
                tourCount={filteredTours.length}
              />

              <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 p-4 shadow-sm dark:from-violet-950/20 dark:via-sky-950/20 dark:to-emerald-950/20">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-foreground">Bảng thống kê trực quan</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-violet-200/70 bg-white/80 p-3 dark:border-violet-800/40 dark:bg-background/40">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-violet-500" />
                      Mức quan tâm tour
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{visualStats.engagementScore}%</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-900/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{ width: `${visualStats.engagementScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-sky-200/70 bg-white/80 p-3 dark:border-sky-800/40 dark:bg-background/40">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
                      Độ phủ xuất bản
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{visualStats.publishedRatio}%</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-900/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500"
                        style={{ width: `${visualStats.publishedRatio}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-200/70 bg-white/80 p-3 dark:border-emerald-800/40 dark:bg-background/40">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-emerald-500" />
                      Điểm hấp dẫn tuyến
                    </div>
                    <p className="mt-1 text-xl font-bold text-foreground">{visualStats.vibeScore}%</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-500"
                        style={{ width: `${visualStats.vibeScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                  <div className="rounded-lg bg-white/70 px-2.5 py-2 text-muted-foreground dark:bg-background/30">
                    Tổng điểm dừng: <span className="font-semibold text-foreground">{visualStats.totalStops}</span>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2.5 py-2 text-muted-foreground dark:bg-background/30">
                    Trung bình/tour: <span className="font-semibold text-foreground">{visualStats.avgStops}</span>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2.5 py-2 text-muted-foreground dark:bg-background/30">
                    Xu hướng tuần: <span className="font-semibold text-foreground">{visualStats.trendScore}%</span>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2.5 py-2 text-muted-foreground dark:bg-background/30">
                    Bộ lọc hiện tại: <span className="font-semibold text-foreground">{filteredTours.length} tour</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {filteredTours.map((tour, idx) => (
                  <TourListRow
                    key={tour.id}
                    tour={tour}
                    isSelected={
                      routePreviewTour?.id === tour.id || viewingTour?.id === tour.id
                    }
                    getRelativeTime={getTourRelativeTime}
                    isLast={idx === filteredTours.length - 1}
                    onClick={() => handleViewTour(tour)}
                    onEdit={() => handleEdit(tour)}
                    onDuplicate={() => handleDuplicate(tour)}
                    onDelete={() => setDeleteTarget(tour)}
                  />
                ))}
              </div>

              <ToursInsightsSection
                tour={routePreviewTour}
                allPois={allPois}
                tourCount={filteredTours.length}
              />

              <div className="rounded-xl border border-border/60 bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 px-4 py-3 text-xs text-muted-foreground shadow-sm dark:from-amber-950/20 dark:via-rose-950/20 dark:to-indigo-950/20">
                Chế độ danh sách đang hiển thị <span className="font-semibold text-foreground">{filteredTours.length}</span> tour,
                tổng <span className="font-semibold text-foreground">{visualStats.totalStops}</span> điểm dừng, độ phủ xuất bản{" "}
                <span className="font-semibold text-foreground">{visualStats.publishedRatio}%</span>.
              </div>
            </div>
          )}
        </div>
      </section>

      <Sheet
        open={!!viewingTour}
        onOpenChange={(open) => {
          if (!open) setViewingTour(null)
        }}
      >
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden border-l p-0 sm:max-w-2xl lg:max-w-3xl"
        >
          {viewingTour && (
            <>
              <SheetTitle className="sr-only">Chi tiết tour: {viewingTour.name}</SheetTitle>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TourDetailPanel
                  tour={viewingTour}
                  allPois={allPois}
                  getPoiName={getPoiName}
                  onEdit={() => handleEdit(viewingTour)}
                  onClose={() => setViewingTour(null)}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <TourFormDialog
        open={formOpen}
        onOpenChange={(o: boolean) => {
          setFormOpen(o)
          if (!o) setEditingTour(null)
        }}
        tour={editingTour}
        allPois={allPois}
        onSubmit={handleFormSubmit}
      />

      <TourDeleteDialog
        tour={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <TourPaywallDialog
        open={!!paywallTarget}
        onOpenChange={(o) => !o && setPaywallTarget(null)}
        targetTour={paywallTarget}
        selectedPackage={selectedPackage}
        walletBalance={walletBalance}
        onConfirmPay={handleUnlockAndOpenTour}
      />
    </div>
  )
}

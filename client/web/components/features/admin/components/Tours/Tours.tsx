"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import {
  Plus,
  Search,
  Route,
  Pencil,
  Trash2,
  MapPin,
  Eye,
  Clock,
  LayoutGrid,
  LayoutList,
  MoreHorizontal,
  Copy,
  CheckCircle2,
  FileText,
  ChevronRight,
  Wallet,
  CreditCard,
  Lock,
  Unlock,
} from "lucide-react"
import { toast } from "sonner"
import type { Tour, POI, CreateTourPayload } from "@/lib/types"
import { fetchTours, fetchPOIs, createTour, updateTour, deleteTour } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { TourFormDialog } from "@/components/features/admin/components/Tours/components/TourFormDialog"
import { TourDetailPanel } from "@/components/features/admin/components/Tours/components/TourPanel"
import { TourDetailEmptyState, TourEmptyState } from "@/components/features/admin/components/Tours/components/TourEmptyState"

type ViewMode = "grid" | "list"
type FilterStatus = "all" | "draft" | "published"
type TourPackageId = "monthly" | "quarterly"

const TOUR_PACKAGES: Record<TourPackageId, { name: string; price: number; days: number }> = {
  monthly: { name: "Gói tháng", price: 199000, days: 30 },
  quarterly: { name: "Gói quý", price: 499000, days: 90 },
}

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

  // Dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null)
  const [viewingTour, setViewingTour] = useState<Tour | null>(null)

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
    const savedBalance = window.localStorage.getItem("tour_wallet_balance_vnd")
    const savedExpiry = window.localStorage.getItem("tour_package_expiry")
    if (savedBalance) setWalletBalance(Number(savedBalance) || 0)
    if (savedExpiry) setPackageExpiry(savedExpiry)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("tour_wallet_balance_vnd", String(walletBalance))
  }, [walletBalance])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (packageExpiry) {
      window.localStorage.setItem("tour_package_expiry", packageExpiry)
    } else {
      window.localStorage.removeItem("tour_package_expiry")
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

  const stats = useMemo(() => {
    return {
      total: tours.length,
      published: tours.filter((t) => t.status === "published").length,
      draft: tours.filter((t) => t.status === "draft").length,
      totalPois: new Set(tours.flatMap((t) => t.pois.map((p) => p.poiId))).size,
    }
  }, [tours])

  function getPoiName(poiId: string) {
    return allPois.find((p) => p.id === poiId)?.name ?? "Unknown"
  }

  function formatVnd(amount: number) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
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

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function getRelativeTime(dateStr: string) {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}mo ago`
  }

  return (

    <div className="flex h-full w-full flex-col overflow-hidden bg-background lg:flex-row">
      {/* Left: list pane */}
      <section className="flex w-full flex-col overflow-hidden border-b border-border lg:w-[520px] lg:shrink-0 lg:border-b-0 lg:border-r">
        {/* Header */}
        <div className="shrink-0 border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Quản lý tour</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Danh sách tour ẩm thực - chọn tour để sử dụng
              </p>
            </div>
            <Button size="sm" onClick={handleCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> Tour mới
            </Button>
          </div>

          <Card className="mt-4">
            <CardContent className="grid gap-3 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" /> Số dư ví
                </span>
                <span className="font-semibold">{formatVnd(walletBalance)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" /> Trạng thái gói
                </span>
                <Badge variant={hasValidPackage ? "default" : "secondary"} className="gap-1">
                  {hasValidPackage ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {hasValidPackage ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="number"
                  min={10000}
                  step={10000}
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  placeholder="Nạp tiền"
                  className="h-8 w-[130px]"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleDeposit}>
                  Nạp tiền
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedPackage === "monthly" ? "default" : "outline"}
                  onClick={() => setSelectedPackage("monthly")}
                >
                  Gói tháng
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={selectedPackage === "quarterly" ? "default" : "outline"}
                  onClick={() => setSelectedPackage("quarterly")}
                >
                  Gói quý
                </Button>
                <Button type="button" size="sm" onClick={handlePurchasePackage}>
                  Mua gói ({formatVnd(TOUR_PACKAGES[selectedPackage].price)})
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Khi chọn một tour, hệ thống yêu cầu mua gói dịch vụ để sử dụng.
                {hasValidPackage && packageExpiry
                  ? ` Gói hiện tại hết hạn ngày ${new Date(packageExpiry).toLocaleDateString("vi-VN")}.`
                  : ""}
              </p>
            </CardContent>
          </Card>

          {/* Stats bar */}
          {!isLoading && (
            <div className="mt-4 flex flex-wrap items-center gap-2 cursor-pointer">
              <Button
                onClick={() => setFilterStatus("all")}

              >
                <Route className="h-3.5 w-3.5" />
                Tất cả ({stats.total})
              </Button>
              <Button
                onClick={() => setFilterStatus("published")}

              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã xuất bản ({stats.published})
              </Button>
              <Button
                onClick={() => setFilterStatus("draft")}

              >
                <FileText className="h-3.5 w-3.5" />
                Bản nháp ({stats.draft})
              </Button>
            </div>
          )}
        </div>

        {/* Search + view toggle */}
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

        {/* List */}
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
            <div className="flex flex-col gap-3 p-4">
              {filteredTours.map((tour) => (
                <TourGridCard
                  key={tour.id}
                  tour={tour}
                  isSelected={viewingTour?.id === tour.id}
                  allPois={allPois}
                  getPoiName={getPoiName}
                  formatDate={formatDate}
                  getRelativeTime={getRelativeTime}
                  onClick={() => handleViewTour(tour)}
                  onEdit={() => handleEdit(tour)}
                  onDuplicate={() => handleDuplicate(tour)}
                  onDelete={() => setDeleteTarget(tour)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredTours.map((tour, idx) => (
                <TourListRow
                  key={tour.id}
                  tour={tour}
                  isSelected={viewingTour?.id === tour.id}
                  getPoiName={getPoiName}
                  getRelativeTime={getRelativeTime}
                  isLast={idx === filteredTours.length - 1}
                  onClick={() => handleViewTour(tour)}
                  onEdit={() => handleEdit(tour)}
                  onDuplicate={() => handleDuplicate(tour)}
                  onDelete={() => setDeleteTarget(tour)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Right: detail pane */}
      <aside className="flex-1 min-w-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {viewingTour ? (
            <TourDetailPanel
              tour={viewingTour}
              allPois={allPois}
              getPoiName={getPoiName}
              onEdit={() => handleEdit(viewingTour)}
              onClose={() => setViewingTour(null)}
            />
          ) : (
            <TourDetailEmptyState />
          )}
        </div>
      </aside>

      {/* Form Dialog */}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o: boolean) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tour</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{deleteTarget?.name}&quot;? Hành động này không thể
              hoàn tác. Tour này có {deleteTarget?.pois.length ?? 0} điểm dừng POI sẽ bị gỡ liên kết.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Paywall dialog */}
      <AlertDialog open={!!paywallTarget} onOpenChange={(o: boolean) => !o && setPaywallTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mua gói để mở tour</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đang chọn tour &quot;{paywallTarget?.name}&quot;. Để sử dụng tour này, bạn cần mua gói dịch vụ.
              Gói hiện chọn: <strong>{TOUR_PACKAGES[selectedPackage].name}</strong> (
              {formatVnd(TOUR_PACKAGES[selectedPackage].price)}). Số dư hiện tại:{" "}
              <strong>{formatVnd(walletBalance)}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Để sau</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlockAndOpenTour}>
              Thanh toán và mở tour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Grid Card ────────────────────────────────────

function TourGridCard({
  tour,
  isSelected,
  allPois,
  getPoiName,
  formatDate,
  getRelativeTime,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  tour: Tour
  isSelected: boolean
  allPois: POI[]
  getPoiName: (id: string) => string
  formatDate: (d: string) => string
  getRelativeTime: (d: string) => string
  onClick: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const majorPois = tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "major"
  })
  const minorPois = tour.pois.filter((tp) => {
    const poi = allPois.find((p) => p.id === tp.poiId)
    return poi?.category === "minor"
  })

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary shadow-md" : "hover:border-primary/30"
        }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Card header stripe */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tour.status === "published" ? "bg-success/10" : "bg-warning/10"
                }`}
            >
              <Route
                className={`h-4.5 w-4.5 ${tour.status === "published" ? "text-success" : "text-warning"
                  }`}
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{tour.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant={tour.status === "published" ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {tour.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Cập nhật {getRelativeTime(tour.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onClick}>
                <Eye className="mr-2 h-3.5 w-3.5" /> Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Chỉnh sửa tour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-3.5 w-3.5" /> Nhân bản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="px-4 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {tour.description}
        </p>

        {/* Route preview (mini) */}
        <div className="mx-4 mt-3 flex items-center gap-1 overflow-hidden">
          {tour.pois
            .sort((a, b) => a.order - b.order)
            .slice(0, 4)
            .map((tp, i) => (
              <div key={tp.poiId} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                )}
                <span className="truncate rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {getPoiName(tp.poiId)}
                </span>
              </div>
            ))}
          {tour.pois.length > 4 && (
            <span className="shrink-0 text-[10px] text-muted-foreground/60">
              +{tour.pois.length - 4} more
            </span>
          )}
        </div>

        <Separator className="mt-3" />

        {/* Footer stats */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {majorPois.length} điểm chính, {minorPois.length} điểm phụ
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDate(tour.createdAt)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-primary hover:text-primary"
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            Chi tiết <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── List Row ─────────────────────────────────────

function TourListRow({
  tour,
  isSelected,
  getPoiName,
  getRelativeTime,
  isLast,
  onClick,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  tour: Tour
  isSelected: boolean
  getPoiName: (id: string) => string
  getRelativeTime: (d: string) => string
  isLast: boolean
  onClick: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={`group flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors ${isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/50"
        } ${!isLast ? "border-b border-border" : ""}`}
      onClick={onClick}
    >
      {/* Status icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tour.status === "published" ? "bg-success/10" : "bg-warning/10"
          }`}
      >
        <Route
          className={`h-4 w-4 ${tour.status === "published" ? "text-success" : "text-warning"
            }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{tour.name}</h3>
          <Badge
            variant={tour.status === "published" ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0 shrink-0"
          >
            {tour.status}
          </Badge>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {tour.pois.length} điểm dừng
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(tour.updatedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label={`Chỉnh sửa ${tour.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onClick}>
              <Eye className="mr-2 h-3.5 w-3.5" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </div>
  )
}

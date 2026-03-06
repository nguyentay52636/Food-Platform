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
} from "lucide-react"
import { toast } from "sonner"
import type { Tour, POI, CreateTourPayload } from "@/app/apis/type"
import { fetchTours, fetchPOIs, createTour, updateTour, deleteTour } from "@/app/apis/test"
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

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [allPois, setAllPois] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")

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
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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
      toast.success(`Duplicated "${tour.name}"`)
      await loadData()
    } catch {
      toast.error("Failed to duplicate tour")
    }
  }

  async function handleFormSubmit(data: CreateTourPayload) {
    if (editingTour) {
      const updated = await updateTour(editingTour.id, data)
      toast.success(`"${data.name}" updated successfully`)
      if (viewingTour?.id === editingTour.id) {
        setViewingTour(updated)
      }
    } else {
      await createTour(data)
      toast.success(`"${data.name}" created successfully`)
    }
    await loadData()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteTour(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" deleted`)
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
              <h1 className="text-lg font-semibold text-foreground">Tour Management</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Create and manage tour itineraries
              </p>
            </div>
            <Button size="sm" onClick={handleCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> New Tour
            </Button>
          </div>

          {/* Stats bar */}
          {!isLoading && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${filterStatus === "all"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Route className="h-3.5 w-3.5" />
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus("published")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${filterStatus === "published"
                  ? "bg-success/10 text-success"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Published ({stats.published})
              </button>
              <button
                onClick={() => setFilterStatus("draft")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${filterStatus === "draft"
                  ? "bg-warning/10 text-warning"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Draft ({stats.draft})
              </button>
            </div>
          )}
        </div>

        {/* Search + view toggle */}
        <div className="shrink-0 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center rounded-l-md p-2 transition-colors ${viewMode === "grid"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center rounded-r-md p-2 transition-colors ${viewMode === "list"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Spinner className="h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">Loading tours...</p>
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
                  onClick={() => setViewingTour(tour)}
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
                  onClick={() => setViewingTour(tour)}
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
            <AlertDialogTitle>Delete Tour</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot
              be undone. This tour has {deleteTarget?.pois.length ?? 0} POI stops that will be
              unlinked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
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
                  {tour.status === "published" ? "Published" : "Draft"}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Updated {getRelativeTime(tour.updatedAt)}
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
                <Eye className="mr-2 h-3.5 w-3.5" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Tour
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
                {majorPois.length} major, {minorPois.length} minor
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
            Details <ChevronRight className="h-3 w-3" />
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
            {tour.pois.length} stop{tour.pois.length !== 1 ? "s" : ""}
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
          aria-label={`Edit ${tour.name}`}
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

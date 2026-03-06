"use client"

import { LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        Trang chủ
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Chọn mục trong sidebar để quản lý.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/tours"
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          Quản lý Tour
        </Link>
        <Link
          href="/admin/pois"
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          Điểm đến (POIs)
        </Link>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { LayoutDashboard, MapPin } from "lucide-react"

export default function OwnerPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        Owner
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Chỉ xem & cập nhật POI của riêng bạn.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/owner/pois?ownerId=owner-1"
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Điểm đến (POIs) của tôi
          </div>
        </Link>
      </div>
    </div>
  )
}


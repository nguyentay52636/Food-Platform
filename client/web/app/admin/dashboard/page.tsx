"use client"

import { LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tổng quan quản trị.
      </p>
    </div>
  )
}

"use client"

import React, { Suspense } from "react"
import { SidebarOwner } from "@/components/features/owner/components/Sidebar/SidebarOwner"

function SidebarOwnerFallback() {
  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
      aria-hidden
    />
  )
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full min-h-0 overflow-x-hidden overflow-y-hidden">
      <Suspense fallback={<SidebarOwnerFallback />}>
        <SidebarOwner />
      </Suspense>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}


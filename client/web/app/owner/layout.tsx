"use client"

import React from "react"
import { SidebarOwner } from "@/components/features/owner/components/Sidebar/SidebarOwner"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full min-h-0 overflow-x-hidden overflow-y-hidden">
      <SidebarOwner />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}


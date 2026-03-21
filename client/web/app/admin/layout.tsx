"use client"

import { SidebarAdmin } from "@/components/features/admin/components/Sidebar/SidebarAdmin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full min-h-0 overflow-x-hidden overflow-y-hidden">
      <SidebarAdmin />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

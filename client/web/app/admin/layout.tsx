"use client"

import { SidebarAdmin } from "@/components/features/admin/components/Sidebar/SidebarAdmin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarAdmin />
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

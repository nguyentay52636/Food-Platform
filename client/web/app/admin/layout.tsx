"use client"

import { SiderBarAdmin } from "@/components/features/admin/components/SiderBar/SiderBarAdmin"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SiderBarAdmin />
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

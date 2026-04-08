"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Home, Menu, X, LayoutDashboard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderAppSider, NavigateItem, SearchBarAppSider, ToggerThemeAppSider, UserProfileAppSider } from "@/components/features/admin/components/Sidebar/components"
import { MOCK_OWNERS } from "@/lib/mocks/data"

type NavItem = {
  name: string
  href: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

function navigation(pathname: string): NavItem[] {
  return [
    { name: "Trang chủ", href: "/owner", path: "/owner", icon: LayoutDashboard },
    { name: "Điểm đến (POIs)", href: "/owner/pois", path: "/owner/pois", icon: MapPin },
  ]
    .map((item) => ({
      ...item,
      current: pathname === item.path || pathname.startsWith(item.path),
    }))
}

export function SidebarOwner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ownerId = searchParams.get("ownerId") ?? "owner-1"

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [, setIsProfileDialogOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: 767px)`)
    const apply = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      if (mobile) setIsCollapsed(true)
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    // Demo: tạo `currentUser` để `UserProfileAppSider` hiển thị thông tin owner.
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("currentUser")
      if (raw) return
      const owner = MOCK_OWNERS.find((o) => o.id === ownerId)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          fullName: owner?.name ?? "Owner",
          username: `${ownerId}@demo.owner`,
          roleName: "Chủ quán",
          userId: 0,
          roleId: 0,
          id: 0,
        }),
      )
    } catch {
      // ignore
    }
  }, [ownerId])

  return (
    <>
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      <Button
        type="button"
        aria-label={isMobileOpen ? "Đóng menu" : "Mở menu"}
        onClick={() => setIsMobileOpen((open) => !open)}
        className="fixed top-4 left-4 z-[60] size-10 bg-background text-foreground shadow-md border md:hidden"
        size="icon"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <aside
        className={cn(
          "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar theme-transition",
          "transition-transform duration-300 ease-out",
          isCollapsed && !isMobile ? "w-16" : "w-64",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-xl",
          isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:relative md:translate-x-0",
        )}
      >
        <HeaderAppSider isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {(!isCollapsed || isMobile) && (
          <div className="px-4 py-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:text-black hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Home className="text-black h-4 w-4" />
              <span>Quay lại trang chủ</span>
            </Link>
          </div>
        )}

        <SearchBarAppSider isCollapsed={isCollapsed} isMobile={isMobile} />

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navigation(pathname ?? "").map((item) => (
            <NavigateItem
              key={item.name}
              item={item as any}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsMobileOpen={setIsMobileOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <UserProfileAppSider
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            setIsProfileDialogOpen={setIsProfileDialogOpen}
          />
          <ToggerThemeAppSider isCollapsed={isCollapsed} isMobile={isMobile} />
        </div>
      </aside>
    </>
  )
}


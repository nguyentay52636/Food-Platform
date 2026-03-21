"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu, X, Home } from "lucide-react"
import { HeaderAppSider, SearchBarAppSider, NavigateItem, ToggerThemeAppSider, UserProfileAppSider } from "./components"
import Link from "next/link"
import { navigation, type NavItem } from "./router"
import { cn } from "@/lib/utils"

const MOBILE_BREAKPOINT = 768

export function SidebarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [, setIsProfileDialogOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const apply = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return (
    <>
      {/* Overlay: chỉ mobile, luôn gắn class md:hidden — không phụ thuộc isMobile sau effect */}
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Nút mở menu: luôn render, ẩn từ md+ bằng CSS — tránh lúc đầu không có nút */}
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
          /* Mobile: drawer */
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:shadow-xl",
          isMobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          /* Desktop: luôn trong layout, luôn hiển thị (không phụ thuộc isMobile / hydration) */
          "md:relative md:translate-x-0"
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
          {navigation(pathname).map((item: NavItem) => (
            <NavigateItem key={item.name} item={item} isCollapsed={isCollapsed} isMobile={isMobile} setIsMobileOpen={setIsMobileOpen} />
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <UserProfileAppSider isCollapsed={isCollapsed} isMobile={isMobile} setIsProfileDialogOpen={setIsProfileDialogOpen} />
          <ToggerThemeAppSider isCollapsed={isCollapsed} isMobile={isMobile} />

        </div>
      </aside>
    </>
  )
}

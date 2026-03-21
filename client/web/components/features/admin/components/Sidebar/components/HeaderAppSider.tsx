import { Button } from "@/components/ui/button"
import { ChevronRight, Route } from "lucide-react"

export default function HeaderAppSider({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}) {
  return (
    <div className="relative p-4 border-b border-sidebar-border bg-primary dark:bg-primary">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded gap-3 flex items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Route className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-sidebar-primary-foreground font-bold mx-2">Quản lý</p>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        size="icon"
        aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border border-sidebar-border bg-sidebar shadow-sm hover:bg-sidebar-accent md:inline-flex"
      >
        <ChevronRight className={`h-3 w-3 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
      </Button>
    </div>
  )
}

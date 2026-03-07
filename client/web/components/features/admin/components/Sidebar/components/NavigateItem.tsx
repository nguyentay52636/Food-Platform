import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const NavigateItem = ({
  item,
  isCollapsed,
  isMobile,
  setIsMobileOpen,
}: {
  item: { name: string; href: string; icon: React.ComponentType<{ className?: string }>; current?: boolean; badge?: string }
  isCollapsed: boolean
  isMobile: boolean
  setIsMobileOpen: (v: boolean) => void
}) => {
  const content = (
    <Link
      href={item.href}
      onClick={() => isMobile && setIsMobileOpen(false)}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
        ${item.current ? "bg-sidebar-primary text-sidebar-primary-foreground border-l-4 border-sidebar-primary" : "text-sidebar-foreground hover:text-black hover:bg-gray-300"}
        ${isCollapsed && !isMobile ? "justify-center px-2" : ""}
      `}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {(!isCollapsed || isMobile) && (
        <>
          <span className="font-medium">{item.name}</span>
          {item.badge && (
            <Badge className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center">
              {item.badge}
            </Badge>
          )}
        </>
      )}
      {item.current && (!isCollapsed || isMobile) && (
        <div className="absolute right-2">
          <ChevronRight className="h-4 w-4 text-sidebar-primary" />
        </div>
      )}
    </Link>
  )

  if (isCollapsed && !isMobile) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground border">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

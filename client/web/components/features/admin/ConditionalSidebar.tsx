"use client"

import { usePathname } from "next/navigation"
import { SidebarAdmin } from "./components/Sidebar/SidebarAdmin"

export default function ConditionalSidebar() {
    const pathname = usePathname()

    if (!pathname || pathname.startsWith("/auth")) {
        return null
    }

    return <SidebarAdmin />
}


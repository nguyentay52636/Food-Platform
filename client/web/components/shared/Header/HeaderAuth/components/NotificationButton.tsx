"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { ModeToggle } from "@/components/ModeToggle"
import { useTranslation } from "@/app/context/TranslationContext"

export function NotificationButton() {
    const { t } = useTranslation()

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-11 w-11 hover:bg-accent">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                </Badge>
            </Button>
            <ModeToggle />
        </div>
    )
}


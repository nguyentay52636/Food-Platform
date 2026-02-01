"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Shield, LogOut } from "lucide-react"
import { useTranslation } from "@/app/context/TranslationContext"

export function UserMenu() {
    const { t } = useTranslation()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                >
                    <Avatar className="h-11 w-11 ring-2 ring-border">
                        <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-bold text-lg">
                            NV
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                        <p className="text-base font-semibold leading-none">Nguyễn Văn A</p>
                        <p className="text-sm leading-none text-muted-foreground">
                            nguyenvana@email.com
                        </p>
                        <Badge variant="secondary" className="w-fit">
                            {t('adminPanel')}
                        </Badge>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer py-3">
                        <User className="mr-3 h-5 w-5" />
                        <span className="text-base">{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer py-3">
                        <Shield className="mr-3 h-5 w-5" />
                        <span className="text-base">{t('admin')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer text-destructive py-3">
                        <LogOut className="mr-3 h-5 w-5" />
                        <span className="text-base">{t('logout')}</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


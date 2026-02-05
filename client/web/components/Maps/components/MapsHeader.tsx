"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, NavigationIcon, ArrowLeft } from "lucide-react"

interface MapsHeaderProps {
    restaurantCount: number
}

export default function MapsHeader({ restaurantCount }: MapsHeaderProps) {
    return (
        <header className="border-gray-200 z-10 bg-primary/10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon" className=" cursor-pointer hover:bg-primary/10">
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-center">Bản đồ nhà hàng</h1>
                                <p className="text-xs text-muted-foreground">{restaurantCount} nhà hàng gần bạn</p>
                            </div>
                        </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md cursor-pointer">
                        <NavigationIcon className="h-4 w-4 mr-2" />
                        Vị trí của tôi
                    </Button>
                </div>
            </div>
        </header>
    )
}


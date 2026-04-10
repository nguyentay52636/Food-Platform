import React from 'react'
import { MapPin, Star, Trash2, Headphones, Mic } from "lucide-react"
import type { POI } from "@/lib/types"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
import DialogDetailAudio from "./Dialog/DialogDetailAudio"
import { useState } from "react"

interface ActionCardScripProps {
    poi: POI
    distance?: number
    adminUi: AdminPoisUi
    uiLanguage: string
    onDelete: () => void
}

export default function ActionCardScrip({ poi, distance, adminUi, uiLanguage, onDelete }: ActionCardScripProps) {
    const t = adminUi.strip
    const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false)

    const formatDistance = (km: number) => {
        if (km < 1) return `${Math.round(km * 1000)}m`
        return `${km.toFixed(1)}km`
    }

    return (
        <div className="p-3 relative group/child">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground line-clamp-1">{poi.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        {distance != null && (
                            <p className="text-[10px] text-muted-foreground">
                                {formatDistance(distance)}
                            </p>
                        )}
                        {poi.rangeTrigger && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-primary/5 text-primary border-primary/20">
                                {poi.rangeTrigger}m
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    {poi.images && poi.images.length > 0 && (
                        <div className="flex shrink-0 items-center justify-center h-4 px-1 rounded-sm bg-muted text-[9px] font-medium text-muted-foreground">
                            +{poi.images.length}
                        </div>
                    )}
                    {poi.rating && (
                        <div className="flex shrink-0 items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium">{poi.rating}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsAudioDialogOpen(true)
                            }}
                        >
                            <Mic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete()
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            {poi.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 whitespace-normal">
                    {poi.description}
                </p>
            )}
            {poi.address && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1 whitespace-normal">{poi.address}</span>
                </div>
            )}

            <DialogDetailAudio
                open={isAudioDialogOpen}
                onOpenChange={setIsAudioDialogOpen}
                poi={poi}
                adminUi={adminUi}
            />
        </div>
    )
}

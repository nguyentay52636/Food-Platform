"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Route } from "lucide-react"
import { BottomNav } from "@/components/client/ButtonNav"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getClientTourById, getClientPOIById } from "@/lib/client-mock-data"
import type { ClientPOI, LanguageCode } from "@/lib/client-types"
import { useLanguage } from "@/lib/context/language-context"
import { formatClientTourDuration } from "@/lib/client-tour-duration"
import { useTranslatedText, useTranslatedUiText } from "@/lib/translation-utils"

const LABELS: Partial<
    Record<
        LanguageCode,
        {
            stops: string
            duration: string
            route: string
            distance: string
            notFound: string
            backToList: string
        }
    >
> = {
    vi: {
        stops: "điểm dừng",
        duration: "Thời gian ước lượng",
        route: "Lộ trình",
        distance: "Quãng đường",
        notFound: "Không tìm thấy tour.",
        backToList: "Về danh sách tour",
    },
    en: {
        stops: "stops",
        duration: "Duration (est.)",
        route: "Route",
        distance: "Distance",
        notFound: "Tour not found.",
        backToList: "Back to tours",
    },
    zh: {
        stops: "stops",
        duration: "Duration (est.)",
        route: "Route",
        distance: "Distance",
        notFound: "Tour not found.",
        backToList: "Back to tours",
    },
    ja: {
        stops: "stops",
        duration: "Duration (est.)",
        route: "Route",
        distance: "Distance",
        notFound: "Tour not found.",
        backToList: "Back to tours",
    },
}

function TourStopRow({
    index,
    poi,
    fallbackId,
    language,
}: {
    index: number
    poi: ClientPOI | undefined
    fallbackId: string
    language: LanguageCode
}) {
    const name = useTranslatedText(poi?.name ?? { en: fallbackId }, language)
    return (
        <Card className="border border-border/80 p-3">
            <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{name}</p>
                    {poi?.address && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {poi.address}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    )
}

export function TourDetailView() {
    const params = useParams()
    const id = typeof params.id === "string" ? params.id : ""
    const { language } = useLanguage()
    const tour = useMemo(() => getClientTourById(id), [id])

    const labels = LABELS[language] || LABELS.en!
    const name = useTranslatedText(tour?.name ?? { en: "" }, language)
    const description = useTranslatedText(tour?.description ?? { en: "" }, language)
    const backLabel = useTranslatedUiText("Back", language, "en")

    const sortedPois = useMemo(() => {
        if (!tour) return []
        return [...tour.pois].sort((a, b) => a.order - b.order)
    }, [tour])

    if (!tour) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pb-24">
                <p className="text-muted-foreground">{labels.notFound}</p>
                <Button asChild variant="outline">
                    <Link href="/tours">{labels.backToList}</Link>
                </Button>
                <BottomNav />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
                <div className="flex items-center gap-2 px-3 py-3">
                    <Button variant="ghost" size="icon" className="shrink-0" asChild>
                        <Link href="/tours" aria-label={backLabel}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="min-w-0 flex-1 truncate text-base font-semibold">{name}</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-black/5">
                    <div className="relative aspect-[16/10] w-full bg-muted">
                        {tour.coverImage ? (
                            <Image
                                src={tour.coverImage}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Route className="h-16 w-16 text-muted-foreground/40" />
                            </div>
                        )}
                    </div>
                </Card>

                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 rounded-full">
                        <MapPin className="h-3.5 w-3.5" />
                        {tour.pois.length} {labels.stops}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        {labels.duration}: {formatClientTourDuration(tour.estimatedDuration, language)}
                    </Badge>
                    {tour.distance != null && tour.distance > 0 && (
                        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 rounded-full">
                            {labels.distance}: {tour.distance} km
                        </Badge>
                    )}
                </div>

                <section>
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Route className="h-4 w-4 text-primary" />
                        {labels.route}
                    </h2>
                    <ol className="space-y-2">
                        {sortedPois.map((tp, index) => (
                            <li key={`${tp.poiId}-${tp.order}`}>
                                <TourStopRow
                                    index={index}
                                    poi={getClientPOIById(tp.poiId)}
                                    fallbackId={tp.poiId}
                                    language={language}
                                />
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            <BottomNav />
        </div>
    )
}

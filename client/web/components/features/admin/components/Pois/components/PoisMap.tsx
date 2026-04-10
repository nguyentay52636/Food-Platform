"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import type { POI } from "@/lib/types"
import type { LanguageCode } from "@/lib/client-types"
import { SUPPORTED_LANGUAGES } from "@/lib/client-types"
import type { AdminPoisUi } from "@/lib/admin-pois-i18n"
import { Navigation } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LANGUAGE_LABELS: Partial<Record<LanguageCode, Partial<Record<LanguageCode, string>>>> = {
    vi: {
        vi: "Tiếng Việt",
        en: "Tiếng Anh",
        zh: "Tiếng Trung",
        ja: "Tiếng Nhật",
        ko: "Tiếng Hàn",
        fr: "Tiếng Pháp",
        de: "Tiếng Đức",
        es: "Tiếng Tây Ban Nha",
        it: "Tiếng Ý",
        pt: "Tiếng Bồ Đào Nha",
        ru: "Tiếng Nga",
        ar: "Tiếng Ả Rập",
        hi: "Tiếng Hindi",
        th: "Tiếng Thái",
        id: "Tiếng Indonesia",
        ms: "Tiếng Malaysia",
        tr: "Tiếng Thổ Nhĩ Kỳ",
        nl: "Tiếng Hà Lan",
        pl: "Tiếng Ba Lan",
        sv: "Tiếng Thụy Điển",
    },
    en: {
        vi: "Vietnamese",
        en: "English",
        zh: "Chinese",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        es: "Spanish",
        it: "Italian",
        pt: "Portuguese",
        ru: "Russian",
        ar: "Arabic",
        hi: "Hindi",
        th: "Thai",
        id: "Indonesian",
        ms: "Malay",
        tr: "Turkish",
        nl: "Dutch",
        pl: "Polish",
        sv: "Swedish",
    },
    ko: {
        vi: "베트남어",
        en: "영어",
        zh: "중국어",
        ja: "일본어",
        ko: "한국어",
        fr: "프랑스어",
        de: "독일어",
        es: "스페인어",
        it: "이탈리아어",
        pt: "포르투갈어",
        ru: "러시아어",
        ar: "아랍어",
        hi: "힌디어",
        th: "태국어",
        id: "인도네시아어",
        ms: "말레이어",
        tr: "터키어",
        nl: "네덜란드어",
        pl: "폴란드어",
        sv: "스웨덴어",
    },
    ja: {
        vi: "ベトナム語",
        en: "英語",
        zh: "中国語",
        ja: "日本語",
        ko: "韓国語",
        fr: "フランス語",
        de: "ドイツ語",
        es: "スペイン語",
        it: "イタリア語",
        pt: "ポルトガル語",
        ru: "ロシア語",
        ar: "アラビア語",
        hi: "ヒンディー語",
        th: "タイ語",
        id: "インドネシア語",
        ms: "マレー語",
        tr: "トルコ語",
        nl: "オランダ語",
        pl: "ポーランド語",
        sv: "スウェーデン語",
    },
    zh: {
        vi: "越南语",
        en: "英语",
        zh: "中文",
        ja: "日语",
        ko: "韩语",
        fr: "法语",
        de: "德语",
        es: "西班牙语",
        it: "意大利语",
        pt: "葡萄牙语",
        ru: "俄语",
        ar: "阿拉伯语",
        hi: "印地语",
        th: "泰语",
        id: "印尼语",
        ms: "马来语",
        tr: "土耳其语",
        nl: "荷兰语",
        pl: "波兰语",
        sv: "瑞典语",
    },
}

function getLanguageLabel(code: LanguageCode, uiLanguage: LanguageCode): string {
    const perUi = LANGUAGE_LABELS[uiLanguage]
    if (perUi && perUi[code]) return perUi[code] as string
    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === code)
    return meta?.nativeName ?? code.toUpperCase()
}

interface POIMapProps {
    pois: POI[]
    selectedPoi?: POI | null
    onMapClick?: (lat: number, lng: number) => void
    onMarkerClick?: (poi: POI) => void
    pickerMode?: boolean
    pickerLat?: number
    pickerLng?: number
    uiLanguage: LanguageCode
    onUiLanguageChange: (language: LanguageCode) => void
    mapUi: AdminPoisUi["map"]
    className?: string
}

export function PoisMap({
    pois,
    selectedPoi,
    onMapClick,
    onMarkerClick,
    pickerMode = false,
    pickerLat,
    pickerLng,
    uiLanguage,
    onUiLanguageChange,
    mapUi,
    className = "",
}: POIMapProps) {
    const t = mapUi
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.Marker[]>([])
    const pickerMarkerRef = useRef<L.Marker | null>(null)
    const userMarkerRef = useRef<L.Marker | null>(null)
    const [isReady, setIsReady] = useState(false)
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)

    // Initialize map
    useEffect(() => {
        let isMounted = true
        let mapInstance: L.Map | null = null

        async function init() {
            if (!mapRef.current) return

            const container = mapRef.current as HTMLElement & { _leaflet_id?: number }
            if (container._leaflet_id) {
                return
            }

            const L = (await import("leaflet")).default
            await import("leaflet/dist/leaflet.css")

            if (!isMounted || !mapRef.current) return

            mapInstance = L.map(mapRef.current, {
                center: [10.7579, 106.7005],
                zoom: 16,
                zoomControl: true,
            })

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors",
            }).addTo(mapInstance)

            if (isMounted) {
                mapInstanceRef.current = mapInstance
                setIsReady(true)
            }
        }

        init()

        return () => {
            isMounted = false
            const map = mapInstanceRef.current
            if (map) {
                try {
                    map.remove()
                } catch {
                    // Container may already be reused (e.g. Strict Mode)
                }
                mapInstanceRef.current = null
            }
            setIsReady(false)
        }
    }, [])

    // Handle map click
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return

        function handler(e: L.LeafletMouseEvent) {
            onMapClick?.(e.latlng.lat, e.latlng.lng)
        }

        if (pickerMode && onMapClick) {
            mapInstanceRef.current.on("click", handler)
            mapInstanceRef.current.getContainer().style.cursor = "crosshair"
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off("click", handler)
                mapInstanceRef.current.getContainer().style.cursor = ""
            }
        }
    }, [pickerMode, onMapClick, isReady])

    // Render POI markers
    const renderMarkers = useCallback(async () => {
        if (!mapInstanceRef.current || !isReady) return

        const L = (await import("leaflet")).default

        // Clear existing
        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []

        pois.forEach((poi) => {
            const isMajor = poi.category === "major"
            const isSelected = selectedPoi?.id === poi.id

            const markerColor = isSelected ? "#22c55e" : isMajor ? "#3b82f6" : "#f59e0b"

            const icon = L.divIcon({
                className: "custom-marker",
                html: `<div style="
          position: relative;
          width: ${isSelected ? "22px" : "18px"};
          height: ${isSelected ? "22px" : "18px"};
        ">
          <div style="
            position: absolute;
            inset: ${isSelected ? "-8px" : "-6px"};
            border-radius: 50%;
            background: ${markerColor};
            opacity: ${isSelected ? "0.24" : "0.14"};
            animation: ping ${isSelected ? "1.5s" : "2.2s"} cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: ${markerColor};
            border: 2px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.5)"};
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
          <svg width="${isSelected ? "12" : "10"}" height="${isSelected ? "12" : "10"}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="white" fill-opacity="0.95"/>
            <circle cx="12" cy="10" r="2.5" fill="${markerColor}"/>
          </svg>
          </div>
        </div>`,
                iconSize: [isSelected ? 22 : 18, isSelected ? 22 : 18],
                iconAnchor: [isSelected ? 11 : 9, isSelected ? 11 : 9],
            })

            const marker = L.marker([poi.latitude, poi.longitude], { icon })
                .addTo(mapInstanceRef.current!)
                .bindTooltip(poi.name, {
                    direction: "top",
                    offset: [0, -10],
                    className: "poi-tooltip",
                })

            marker.on("click", () => onMarkerClick?.(poi))
            markersRef.current.push(marker)
        })
    }, [pois, selectedPoi, onMarkerClick, isReady])

    useEffect(() => {
        renderMarkers()
    }, [renderMarkers])

    // Picker marker
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return

        async function updatePicker() {
            const L = (await import("leaflet")).default

            if (pickerMarkerRef.current) {
                pickerMarkerRef.current.remove()
                pickerMarkerRef.current = null
            }

            if (pickerMode && pickerLat != null && pickerLng != null) {
                const icon = L.divIcon({
                    className: "picker-marker",
                    html: `<div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f43f5e;
            border: 3px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                })
                pickerMarkerRef.current = L.marker([pickerLat, pickerLng], { icon }).addTo(
                    mapInstanceRef.current!
                )
            }
        }

        updatePicker()
    }, [pickerMode, pickerLat, pickerLng, isReady])

    // Pan to selected POI
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedPoi || !isReady) return
        mapInstanceRef.current.setView([selectedPoi.latitude, selectedPoi.longitude], 17, {
            animate: true,
        })
    }, [selectedPoi, isReady])

    const handleLocateUser = useCallback(() => {
        if (!mapInstanceRef.current || !isReady) return
        if (!navigator.geolocation) {
            setLocationError(t.unsupported)
            return
        }

        setIsLocating(true)
        setLocationError(null)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const map = mapInstanceRef.current
                if (!map) {
                    setIsLocating(false)
                    return
                }

                const L = (await import("leaflet")).default
                if (userMarkerRef.current) {
                    userMarkerRef.current.remove()
                    userMarkerRef.current = null
                }

                const icon = L.divIcon({
                    className: "user-location-marker",
                    html: `<div style="
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background: #3b82f6;
                        border: 3px solid #fff;
                        box-shadow: 0 0 0 2px rgba(59,130,246,0.35), 0 2px 8px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                })

                userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(map)
                map.setView([latitude, longitude], 17, { animate: true })
                setIsLocating(false)
            },
            (error) => {
                setIsLocating(false)
                setLocationError(error.message || t.locateFailed)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 8000,
            }
        )
    }, [isReady, t.locateFailed, t.unsupported])

    // Ensure map recalculates size after layout changes
    useEffect(() => {
        if (!mapInstanceRef.current || !isReady) return
        const map = mapInstanceRef.current
        const handleResize = () => map.invalidateSize()
        const timeout = window.setTimeout(handleResize, 120)
        window.addEventListener("resize", handleResize)
        return () => {
            window.clearTimeout(timeout)
            window.removeEventListener("resize", handleResize)
        }
    }, [isReady, pois.length, pickerMode])

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="h-full w-full rounded-lg" />
            <div className="absolute right-3 top-3 z-[1000]">
                <Select
                    value={uiLanguage}
                    onValueChange={(value) => onUiLanguageChange(value as LanguageCode)}
                >
                    <SelectTrigger
                        className="h-8 min-w-[10.5rem] max-w-[min(100vw-1.5rem,16rem)] border-border bg-background/95 px-2 text-xs text-foreground shadow-md backdrop-blur-sm"
                        aria-label={t.uiLanguageSelect}
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" className="z-[2200] max-h-56 overflow-y-scroll pr-1">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code} className="text-xs">
                                {lang.flag} {getLanguageLabel(lang.code, uiLanguage)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <button
                type="button"
                onClick={handleLocateUser}
                className="absolute left-3 top-[98px] z-[1000] flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background/95 text-foreground shadow-md backdrop-blur hover:bg-accent"
                title={t.locateTitle}
                disabled={!isReady || isLocating}
            >
                <Navigation className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
            </button>
            {pickerMode && (
                <div className="absolute left-3 top-12 z-[1000] rounded-md bg-card/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-sm">
                    {t.pickerHint}
                </div>
            )}
            {locationError && (
                <div className="absolute bottom-3 left-3 z-[1000] rounded-md bg-destructive/90 px-2.5 py-1.5 text-xs text-destructive-foreground shadow-md">
                    {locationError}
                </div>
            )}
            <div className="absolute bottom-3 right-3 z-[900] rounded-md border border-border bg-background/95 px-3 py-2 shadow-md backdrop-blur-sm">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t.legend}</p>
                <div className="space-y-1.5 text-xs text-foreground">
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                        </span>
                        <span>{t.selected}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <span>{t.primary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                        <span>{t.secondary}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

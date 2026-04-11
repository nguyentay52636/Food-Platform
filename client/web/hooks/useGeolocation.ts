import { useEffect, useState } from "react"
import {
  acquireBestEffortPosition,
  isGeolocationContextOk,
  probeGeolocationPermission,
  watchPosition as subscribeGeolocation,
} from "@/lib/browser-geolocation"
import type { GeolocationSource } from "@/lib/browser-geolocation"

export interface GeoPosition {
  lat: number
  lng: number
  /** Ước lượng sai số (m), null khi nguồn IP hoặc không có. */
  accuracyMeters?: number | null
}

export default function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<GeolocationSource | null>(null)

  useEffect(() => {
    let cancelled = false
    let watchId: number | undefined

    if (isGeolocationContextOk()) {
      probeGeolocationPermission()
    }

    const startWatch = () => {
      if (!navigator.geolocation || !isGeolocationContextOk()) return
      watchId = subscribeGeolocation(
        (c) => {
          if (cancelled) return
          setError(null)
          setPosition({
            lat: c.lat,
            lng: c.lng,
            accuracyMeters: c.accuracyMeters,
          })
          setSource("gps")
        },
        (msg) => {
          if (cancelled || !msg) return
          setError(msg)
        }
      )
    }

    if (isGeolocationContextOk() && navigator.geolocation) {
      startWatch()
    }

    void acquireBestEffortPosition()
      .then(({ coords, source: src, accuracyMeters }) => {
        if (cancelled) return
        setError(null)
        setPosition({
          lat: coords.lat,
          lng: coords.lng,
          accuracyMeters: accuracyMeters ?? null,
        })
        setSource(src)
      })
      .catch(() => {
        if (cancelled) return
        if (isGeolocationContextOk() && navigator.geolocation) {
          setError(null)
        } else {
          setError(
            "Không lấy được vị trí. Kiểm tra mạng; trên HTTPS bạn có thể bật quyền vị trí chính xác (GPS)."
          )
        }
      })

    return () => {
      cancelled = true
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  return { position, error, source }
}

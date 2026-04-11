import { useEffect, useState } from "react"
import {
  acquireBestEffortPosition,
  isGeolocationContextOk,
  probeGeolocationPermission,
  watchPosition as subscribeWebGeolocation,
} from "@/lib/browser-geolocation"
import {
  clearNativeWatch,
  isCapacitorNative,
  watchNativePosition,
} from "@/lib/capacitor-location"
import type { GeolocationSource } from "@/lib/geo-types"

export interface GeoPosition {
  lat: number
  lng: number
  accuracyMeters?: number | null
}

export default function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<GeolocationSource | null>(null)

  useEffect(() => {
    let cancelled = false
    const watchState = {
      webId: undefined as number | undefined,
      capId: undefined as string | undefined,
    }

    const apply = (
      lat: number,
      lng: number,
      accuracyMeters: number | null,
      src: GeolocationSource
    ) => {
      if (cancelled) return
      setError(null)
      setPosition({ lat, lng, accuracyMeters })
      setSource(src)
    }

    void (async () => {
      const native = await isCapacitorNative()
      if (cancelled) return

      if (isGeolocationContextOk()) {
        probeGeolocationPermission()
      }

      if (native) {
        try {
          const id = await watchNativePosition(
            (c) => apply(c.lat, c.lng, c.accuracyMeters, "gps"),
            () => {}
          )
          if (cancelled) {
            void clearNativeWatch(id)
          } else {
            watchState.capId = id
          }
        } catch {
          /* quyền native từ chối — thử web watch bên dưới */
        }
      }

      if (watchState.capId === undefined && isGeolocationContextOk() && navigator.geolocation) {
        watchState.webId = subscribeWebGeolocation(
          (c) => apply(c.lat, c.lng, c.accuracyMeters, "gps"),
          (msg) => {
            if (cancelled || !msg) return
            setError(msg)
          }
        )
      }

      void acquireBestEffortPosition()
        .then(({ coords, source: src, accuracyMeters }) => {
          if (cancelled) return
          apply(coords.lat, coords.lng, accuracyMeters ?? null, src)
        })
        .catch(() => {
          if (cancelled) return
          if (watchState.capId !== undefined || watchState.webId !== undefined) {
            setError(null)
          } else {
            setError(
              "Không lấy được vị trí. Trên app Android hãy cấp quyền vị trí chính xác; trên web cần HTTPS."
            )
          }
        })
    })()

    return () => {
      cancelled = true
      if (watchState.webId !== undefined) {
        navigator.geolocation.clearWatch(watchState.webId)
      }
      if (watchState.capId !== undefined) {
        void clearNativeWatch(watchState.capId)
      }
    }
  }, [])

  return { position, error, source }
}

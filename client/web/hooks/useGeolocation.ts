import { useEffect, useState } from "react"
import {
  acquireCurrentPosition,
  isGeolocationContextOk,
  watchPosition as subscribeGeolocation,
} from "@/lib/browser-geolocation"

export interface GeoPosition {
  lat: number
  lng: number
}

export default function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị")
      return
    }
    if (!isGeolocationContextOk()) {
      setError("Cần HTTPS hoặc localhost để dùng vị trí")
      return
    }

    let cancelled = false
    let watchId: number | undefined

    const startWatch = () => {
      watchId = subscribeGeolocation(
        (c) => {
          if (cancelled) return
          setError(null)
          setPosition(c)
        },
        (msg) => {
          if (cancelled || !msg) return
          setError(msg)
        }
      )
    }

    void acquireCurrentPosition()
      .then((coords) => {
        if (cancelled) return
        setError(null)
        setPosition(coords)
        startWatch()
      })
      .catch(() => {
        if (cancelled) return
        startWatch()
      })

    return () => {
      cancelled = true
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  return { position, error }
}

/**
 * Browser geolocation helpers. Prefer network/Wi‑Fi fixes first — high‑accuracy
 * GPS often times out on desktop and indoors.
 */

export type LatLng = { lat: number; lng: number }

const OPT_NETWORK_FIRST: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 300_000,
  timeout: 25_000,
}

const OPT_HIGH_ACCURACY: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 60_000,
  timeout: 20_000,
}

const OPT_WATCH: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 30_000,
  timeout: 30_000,
}

function positionToLatLng(p: GeolocationPosition): LatLng {
  return { lat: p.coords.latitude, lng: p.coords.longitude }
}

function once(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

/** True when the Geolocation API may run (secure context rules). */
export function isGeolocationContextOk(): boolean {
  if (typeof window === "undefined" || !navigator.geolocation) return false
  if (window.isSecureContext) return true
  const h = window.location.hostname
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]"
}

/**
 * One-shot position: try network/cached first, then high accuracy.
 */
export async function acquireCurrentPosition(): Promise<LatLng> {
  if (!navigator.geolocation) {
    throw new Error("NO_GEO")
  }
  if (!isGeolocationContextOk()) {
    throw new Error("INSECURE_CONTEXT")
  }
  try {
    return positionToLatLng(await once(OPT_NETWORK_FIRST))
  } catch {
    return positionToLatLng(await once(OPT_HIGH_ACCURACY))
  }
}

export function watchPosition(
  onSuccess: (coords: LatLng) => void,
  onError?: (message: string) => void
): number {
  return navigator.geolocation.watchPosition(
    (pos) => onSuccess(positionToLatLng(pos)),
    (err) => onError?.(err.message),
    OPT_WATCH
  )
}

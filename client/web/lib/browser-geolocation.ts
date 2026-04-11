/**
 * Định vị trình duyệt: high accuracy + dữ liệu mới nhất (maximumAge: 0).
 * Trình duyệt chỉ báo độ tin cậy qua coords.accuracy (m); không thể “đảm bảo từng mét”
 * theo chuẩn web, nhưng có thể luôn xin GPS/Wi‑Fi fine và cập nhật liên tục.
 */

export type LatLng = { lat: number; lng: number }

export type LatLngWithAccuracy = LatLng & {
  /** Ước lượng bởi trình duyệt (m); càng nhỏ càng tốt khi có GPS. */
  accuracyMeters: number | null
}

export type GeolocationSource = "gps" | "ip"

/** Một lần: chờ GPS/Wi‑Fi fine, không dùng cache cũ. */
const OPT_PRECISE_ONCE: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 45_000,
}

const OPT_NETWORK_FIRST: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 120_000,
  timeout: 18_000,
}

const OPT_HIGH_ACCURACY: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 25_000,
}

/**
 * Luôn bật fine location, luôn lấy đo mới (không dùng cache vài phút).
 * Cập nhật liên tục khi người dùng đã cấp quyền.
 */
const OPT_WATCH: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 120_000,
}

/** Ngưỡng “rất tốt” để dừng sớm khi watch (m). */
const TARGET_ACCURACY_M = 5
/** Ngưỡng chấp nhận một shot nếu chưa watch (m). */
const GOOD_ONCE_ACCURACY_M = 25

function toLatLngWithAccuracy(p: GeolocationPosition): LatLngWithAccuracy {
  const acc = p.coords.accuracy
  return {
    lat: p.coords.latitude,
    lng: p.coords.longitude,
    accuracyMeters: Number.isFinite(acc) && acc > 0 ? acc : null,
  }
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

function parseLatLngRecord(d: Record<string, unknown>): LatLng | null {
  const lat = parseFloat(String(d.latitude ?? d.lat ?? ""))
  const lng = parseFloat(String(d.longitude ?? d.lng ?? d.lon ?? ""))
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  return { lat, lng }
}

export async function acquireApproximateLocationByIp(): Promise<LatLng | null> {
  if (typeof window === "undefined") return null
  const urls = [
    "https://get.geojs.io/v1/ip/geo.json",
    "https://ipapi.co/json/",
  ] as const
  for (const url of urls) {
    try {
      const r = await fetch(url, { cache: "no-store" })
      if (!r.ok) continue
      const d = (await r.json()) as Record<string, unknown>
      if (d.error === true || d.error === "true" || d.reason === "RateLimited") continue
      const p = parseLatLngRecord(d)
      if (p) return p
    } catch {
      continue
    }
  }
  return null
}

export async function acquirePreciseGpsPosition(): Promise<LatLngWithAccuracy> {
  if (!navigator.geolocation) {
    throw new Error("NO_GEO")
  }
  if (!isGeolocationContextOk()) {
    throw new Error("INSECURE_CONTEXT")
  }

  const tryOncePrecise = async (): Promise<GeolocationPosition | null> => {
    try {
      return await once(OPT_PRECISE_ONCE)
    } catch {
      return null
    }
  }

  const watchBest = (maxMs: number): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      let best: GeolocationPosition | null = null
      let bestAcc = Number.POSITIVE_INFINITY
      const started = Date.now()
      let tick: ReturnType<typeof setInterval> | undefined
      let stableHits = 0
      let lastStableAcc = Number.POSITIVE_INFINITY
      const cleanup = () => {
        navigator.geolocation.clearWatch(id)
        if (tick !== undefined) window.clearInterval(tick)
      }
      const watchOpts: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: maxMs,
      }
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const acc = pos.coords.accuracy
          const finite = Number.isFinite(acc) && acc > 0
          if (!finite) {
            if (!best || pos.timestamp >= best.timestamp) best = pos
            return
          }
          if (acc < bestAcc) {
            bestAcc = acc
            best = pos
          }
          if (acc <= TARGET_ACCURACY_M) {
            cleanup()
            resolve(pos)
            return
          }
          if (acc <= 10 && Math.abs(acc - lastStableAcc) < 3) {
            stableHits += 1
            if (stableHits >= 2) {
              cleanup()
              resolve(pos)
            }
          } else {
            stableHits = acc <= 10 ? 1 : 0
          }
          lastStableAcc = acc
        },
        (err) => {
          if (err.code === 1) {
            cleanup()
            reject(err)
          }
        },
        watchOpts
      )
      tick = window.setInterval(() => {
        if (Date.now() - started < maxMs) return
        cleanup()
        if (best) resolve(best)
        else reject(new Error("WATCH_TIMEOUT"))
      }, 250)
    })

  const first = await tryOncePrecise()
  if (first) {
    const acc = first.coords.accuracy
    if (!Number.isFinite(acc) || acc <= 0 || acc <= GOOD_ONCE_ACCURACY_M) {
      return toLatLngWithAccuracy(first)
    }
  }

  try {
    const fromWatch = await watchBest(38_000)
    return toLatLngWithAccuracy(fromWatch)
  } catch {
    /* fall through */
  }

  if (first) {
    return toLatLngWithAccuracy(first)
  }

  try {
    return toLatLngWithAccuracy(await once(OPT_NETWORK_FIRST))
  } catch {
    return toLatLngWithAccuracy(await once(OPT_HIGH_ACCURACY))
  }
}

export async function acquireBestEffortPosition(): Promise<{
  coords: LatLng
  source: GeolocationSource
  accuracyMeters: number | null
}> {
  if (isGeolocationContextOk() && navigator.geolocation) {
    try {
      const p = await acquirePreciseGpsPosition()
      return {
        coords: { lat: p.lat, lng: p.lng },
        source: "gps",
        accuracyMeters: p.accuracyMeters,
      }
    } catch {
      /* fall through to IP */
    }
  }
  const ip = await acquireApproximateLocationByIp()
  if (ip) {
    return {
      coords: ip,
      source: "ip",
      accuracyMeters: null,
    }
  }
  if (!navigator.geolocation) {
    throw new Error("NO_GEO")
  }
  if (!isGeolocationContextOk()) {
    throw new Error("INSECURE_NO_IP")
  }
  throw new Error("GEO_FAILED")
}

export async function acquireCurrentPosition(): Promise<LatLngWithAccuracy> {
  return acquirePreciseGpsPosition()
}

export function watchPosition(
  onSuccess: (result: LatLngWithAccuracy) => void,
  onError?: (message: string) => void
): number {
  return navigator.geolocation.watchPosition(
    (pos) => onSuccess(toLatLngWithAccuracy(pos)),
    (err) => onError?.(err.message),
    OPT_WATCH
  )
}

/** Gợi ý trình duyệt xin quyền sớm (không hiện prompt trên mọi trình duyệt). */
export function probeGeolocationPermission(): void {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) return
  void navigator.permissions
    .query({ name: "geolocation" as PermissionName })
    .catch(() => {})
}

/**
 * Định vị native (Android FusedLocationProvider / iOS Core Location) qua Capacitor.
 * Chính xác hơn Geolocation trong WebView khi người dùng cấp quyền vị trí chính xác.
 */
import type { LatLngWithAccuracy } from "@/lib/geo-types"

export async function isCapacitorNative(): Promise<boolean> {
    if (typeof window === "undefined") return false
    try {
        const { Capacitor } = await import("@capacitor/core")
        return Capacitor.isNativePlatform()
    } catch {
        return false
    }
}

function capPositionToLatLng(p: {
    coords: { latitude: number; longitude: number; accuracy: number }
}): LatLngWithAccuracy {
    const acc = p.coords.accuracy
    return {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracyMeters: Number.isFinite(acc) && acc > 0 ? acc : null,
    }
}

const NATIVE_OPTS = {
    enableHighAccuracy: true,
    timeout: 45_000,
    maximumAge: 0,
} as const

const NATIVE_WATCH_OPTS = {
    enableHighAccuracy: true,
    timeout: 120_000,
    maximumAge: 0,
    /** Android: cập nhật thường xuyên hơn khi di chuyển (ms). */
    minimumUpdateInterval: 1000,
} as const

/** Xin quyền + lấy một điểm (GPS / fused). */
export async function acquireNativePosition(): Promise<LatLngWithAccuracy> {
    const { Geolocation } = await import("@capacitor/geolocation")
    const status = await Geolocation.requestPermissions({
        permissions: ["location"],
    })
    if (status.location === "denied") {
        throw new Error("PERMISSION_DENIED")
    }
    const pos = await Geolocation.getCurrentPosition(NATIVE_OPTS)
    return capPositionToLatLng(pos)
}

/** Theo dõi vị trí native; trả về callback id để clearWatch. */
export async function watchNativePosition(
    onSuccess: (p: LatLngWithAccuracy) => void,
    onError?: (message: string) => void
): Promise<string> {
    const { Geolocation } = await import("@capacitor/geolocation")
    const status = await Geolocation.requestPermissions({
        permissions: ["location"],
    })
    if (status.location === "denied") {
        onError?.("denied")
        throw new Error("PERMISSION_DENIED")
    }
    return Geolocation.watchPosition(NATIVE_WATCH_OPTS, (pos, err) => {
        if (err) {
            onError?.(String(err.message ?? err))
            return
        }
        if (pos) onSuccess(capPositionToLatLng(pos))
    })
}

export async function clearNativeWatch(callbackId: string): Promise<void> {
    const { Geolocation } = await import("@capacitor/geolocation")
    await Geolocation.clearWatch({ id: callbackId })
}

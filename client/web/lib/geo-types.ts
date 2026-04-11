export type LatLng = { lat: number; lng: number }

export type LatLngWithAccuracy = LatLng & {
    /** Ước lượng bởi hệ thống (m); càng nhỏ càng tốt khi có GPS/fused. */
    accuracyMeters: number | null
}

export type GeolocationSource = "gps" | "ip"

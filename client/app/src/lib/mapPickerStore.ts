type Listener = (lat: number, lng: number) => void

let listener: Listener | null = null

export function setMapPickerListener(fn: Listener | null) {
  listener = fn
}

export function confirmMapPickerLocation(lat: number, lng: number) {
  listener?.(lat, lng)
  listener = null
}

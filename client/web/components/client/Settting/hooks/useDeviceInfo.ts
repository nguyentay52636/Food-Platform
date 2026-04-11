"use client"

import { useEffect, useState } from "react"

const DEVICE_ID_KEY = "food_platform_device_id"

/** Narrow types for APIs not present in all TypeScript lib targets. */
type NetworkConnectionLite = {
  effectiveType?: string
  type?: string
  addEventListener(type: string, listener: () => void): void
  removeEventListener(type: string, listener: () => void): void
}

type UserAgentDataHints = {
  platform?: string
  fullVersionList?: { brand: string; version: string }[]
}

type NavigatorExt = Navigator & {
  deviceMemory?: number
  connection?: NetworkConnectionLite
  userAgentData?: {
    platform?: string
    brands?: { brand: string; version: string }[]
    getHighEntropyValues?: (keys: string[]) => Promise<UserAgentDataHints>
  }
}

export type DeviceInfoSnapshot = {
  deviceId: string
  platform: string
  browser: string
  vendor: string
  screenRes: string
  colorDepth: string
  language: string
  timezone: string
  connectionEffective: string
  connectionType: string
  cookiesEnabled: boolean
  memoryGb: string | null
  cpuCores: string | null
}

function ensureDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

function parseBrowser(ua: string): string {
  if (ua.includes("Edg/")) return "Edge"
  if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera"
  if (ua.includes("Chrome/") && !ua.includes("Edg")) return "Chrome"
  if (ua.includes("Firefox/")) return "Firefox"
  if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Safari"
  return "Unknown"
}

function readSnapshot(): DeviceInfoSnapshot {
  const nav = navigator as NavigatorExt
  const scr = window.screen
  const conn = nav.connection
  const deviceMemory = nav.deviceMemory

  const vendor = nav.vendor?.trim() ? nav.vendor : "—"
  const connectionType = conn?.type ?? "—"
  const effective = conn?.effectiveType ?? (nav.onLine ? "unknown" : "offline")

  return {
    deviceId: ensureDeviceId(),
    platform: nav.userAgentData?.platform ?? nav.platform ?? "—",
    browser: parseBrowser(nav.userAgent),
    vendor,
    screenRes: `${Math.round(window.innerWidth)}×${Math.round(window.innerHeight)}`,
    colorDepth: `${scr.colorDepth ?? 24} bit`,
    language: nav.language || "—",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "—",
    connectionEffective: effective,
    connectionType,
    cookiesEnabled: nav.cookieEnabled,
    memoryGb: deviceMemory != null ? String(deviceMemory) : null,
    cpuCores:
      nav.hardwareConcurrency != null && nav.hardwareConcurrency > 0
        ? String(nav.hardwareConcurrency)
        : null,
  }
}

export function useDeviceInfo() {
  const [info, setInfo] = useState<DeviceInfoSnapshot | null>(null)

  useEffect(() => {
    const update = () => setInfo(readSnapshot())
    update()

    window.addEventListener("resize", update)
    const conn = (navigator as NavigatorExt).connection
    conn?.addEventListener("change", update)

    const nav = navigator as NavigatorExt
    const uaData = nav.userAgentData
    if (uaData?.getHighEntropyValues) {
      uaData
        .getHighEntropyValues(["platform", "fullVersionList"])
        .then((hints: UserAgentDataHints) => {
          setInfo((prev) => {
            const base = prev ?? readSnapshot()
            const platform = hints.platform || base.platform
            let browser = base.browser
            const brands = hints.fullVersionList
            if (brands?.length) {
              const primary = brands.find((b: { brand: string }) => !/Not.?A.?Brand/i.test(b.brand))
              if (primary) browser = `${primary.brand}`
            }
            return { ...base, platform, browser }
          })
        })
        .catch(() => {})
    }

    return () => {
      window.removeEventListener("resize", update)
      conn?.removeEventListener("change", update)
    }
  }, [])

  return info
}

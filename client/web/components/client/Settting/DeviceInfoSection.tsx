"use client"

import type { ReactNode } from "react"
import { ChevronDown, Cpu, Loader2, MonitorSmartphone, Signal } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { LanguageCode } from "@/lib/client-types"
import { useTranslatedUiText } from "@/lib/translation-utils"
import { useDeviceInfo } from "./hooks/useDeviceInfo"

function truncateId(id: string, max = 22): string {
  if (id.length <= max) return id
  return `${id.slice(0, max)}…`
}

function Row({
  label,
  value,
  valueClassName,
  endAdornment,
}: {
  label: string
  value: string
  valueClassName?: string
  endAdornment?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2 text-right">
        {endAdornment}
        <span className={`break-all font-medium ${valueClassName ?? ""}`} title={value}>
          {value}
        </span>
      </div>
    </div>
  )
}

export function DeviceInfoSection({ language }: { language: LanguageCode }) {
  const info = useDeviceInfo()

  const sectionTitle = useTranslatedUiText("Thông tin thiết bị", language)
  const deviceIdLabel = useTranslatedUiText("Mã thiết bị", language)
  const platformLabel = useTranslatedUiText("Nền tảng", language)
  const browserLabel = useTranslatedUiText("Trình duyệt", language)
  const vendorLabel = useTranslatedUiText("Nhà cung cấp", language)
  const screenLabel = useTranslatedUiText("Màn hình", language)
  const colorDepthLabel = useTranslatedUiText("Độ sâu màu", language)
  const languageLabel = useTranslatedUiText("Ngôn ngữ", language)
  const timezoneLabel = useTranslatedUiText("Múi giờ", language)
  const connectionLabel = useTranslatedUiText("Kết nối", language)
  const networkTypeLabel = useTranslatedUiText("Loại mạng", language)
  const cookiesLabel = useTranslatedUiText("Cookies", language)
  const memoryLabel = useTranslatedUiText("Bộ nhớ", language)
  const cpuLabel = useTranslatedUiText("CPU", language)
  const enabledText = useTranslatedUiText("Bật", language)
  const disabledText = useTranslatedUiText("Tắt", language)
  const unknownText = useTranslatedUiText("Không xác định", language)
  const loadingText = useTranslatedUiText("Đang tải…", language)

  if (!info) {
    return (
      <section>
        <Card className="flex items-center justify-center gap-2 py-10">
          <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{loadingText}</span>
        </Card>
      </section>
    )
  }

  const cookiesValue = info.cookiesEnabled ? enabledText : disabledText
  const memoryValue = info.memoryGb ? `${info.memoryGb} GB` : unknownText
  const cpuValue = info.cpuCores ? `${info.cpuCores} cores` : unknownText
  const connDisplay =
    info.connectionEffective === "offline"
      ? "offline"
      : info.connectionEffective !== "unknown"
        ? info.connectionEffective
        : navigator.onLine
          ? "online"
          : "offline"
  const online = navigator.onLine && info.connectionEffective !== "offline"

  return (
    <section>
      <Collapsible defaultOpen className="group/collapsible">
        <Card className="overflow-hidden">
          <CollapsibleTrigger className="flex w-full items-center gap-2 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/40">
            <MonitorSmartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {sectionTitle}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="divide-y divide-border px-4">
              <Row
                label={deviceIdLabel}
                value={truncateId(info.deviceId)}
                valueClassName="font-mono text-xs"
              />
              <Row label={platformLabel} value={info.platform} />
              <Row label={browserLabel} value={info.browser} />
              <Row label={vendorLabel} value={info.vendor} />
              <Row label={screenLabel} value={info.screenRes} />
              <Row label={colorDepthLabel} value={info.colorDepth} />
              <Row label={languageLabel} value={info.language} />
              <Row label={timezoneLabel} value={info.timezone} />
              <Row
                label={connectionLabel}
                value={connDisplay}
                valueClassName={online ? "text-emerald-600 dark:text-emerald-400" : ""}
                endAdornment={
                  <Signal
                    className={`h-4 w-4 shrink-0 ${online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                    aria-hidden
                  />
                }
              />
              <Row
                label={networkTypeLabel}
                value={info.connectionType === "—" ? unknownText : info.connectionType}
              />
              <Row label={cookiesLabel} value={cookiesValue} />
              <Row label={memoryLabel} value={memoryValue} />
              <Row
                label={cpuLabel}
                value={cpuValue}
                endAdornment={<Cpu className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </section>
  )
}

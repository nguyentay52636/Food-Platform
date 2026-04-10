"use client"

import { useMemo } from "react"
import { BarChart3 } from "lucide-react"

interface ToursGrowthChartProps {
  /** Dùng để neo dữ liệu (ổn định theo số tour đang lọc). */
  tourCount: number
  className?: string
}

/** Biểu đồ tăng trưởng (SVG). */
export function ToursGrowthChart({ tourCount, className = "" }: ToursGrowthChartProps) {
  const { labels, values, max } = useMemo(() => {
    const weeks = 10
    const seed = Math.max(1, tourCount * 7 + 11)
    const vals: number[] = []
    let v = 35 + (seed % 15)
    for (let i = 0; i < weeks; i++) {
      v += 4 + ((seed + i * 13) % 9)
      vals.push(v)
    }
    const m = Math.max(...vals, 1)
    const lbls = Array.from({ length: weeks }, (_, i) => `T${i + 1}`)
    return { labels: lbls, values: vals, max: m }
  }, [tourCount])

  const w = 520
  const h = 160
  const padL = 36
  const padR = 12
  const padT = 16
  const padB = 28
  const innerW = w - padL - padR
  const innerH = h - padT - padB
  const n = values.length

  const points = values.map((val, i) => {
    const x = padL + (innerW * (i / Math.max(n - 1, 1)))
    const y = padT + innerH * (1 - val / max)
    return { x, y, val }
  })

  const lineD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  const areaD = `${lineD} L ${points[n - 1]!.x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${points[0]!.x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-50 to-sky-50/80 p-4 shadow-sm dark:from-slate-950/40 dark:to-sky-950/20 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-semibold text-foreground">Tăng trưởng tương tác</h3>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">10 tuần</span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto max-h-[200px] w-full text-muted-foreground"
        role="img"
        aria-label="Biểu đồ tăng trưởng"
      >
        <defs>
          <linearGradient id="tourGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(14 165 233)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(14 165 233)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="tourGrowthStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + innerH * (1 - t)
          return (
            <line
              key={t}
              x1={padL}
              y1={y}
              x2={w - padR}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
          )
        })}
        <path d={areaD} fill="url(#tourGrowthFill)" />
        <path
          d={lineD}
          fill="none"
          stroke="url(#tourGrowthStroke)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={`c-${i}`} cx={p.x} cy={p.y} r={4} fill="white" stroke="#0ea5e9" strokeWidth={2} />
        ))}
        {points.map((p, i) => (
          <text
            key={`lbl-${i}`}
            x={p.x}
            y={h - 6}
            textAnchor="middle"
            fill="currentColor"
            fontSize={9}
            opacity={0.75}
          >
            {labels[i]}
          </text>
        ))}
      </svg>
    </div>
  )
}

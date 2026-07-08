"use client"

const data = [
  1200, 1800, 1400, 2600, 2200, 3400, 2800, 3900, 3200, 4600, 4100, 5200, 4800, 6100, 5400, 6800, 6200, 7400,
]

export function SpendChart() {
  const width = 640
  const height = 220
  const pad = 12
  const max = Math.max(...data)
  const min = 0
  const stepX = (width - pad * 2) / (data.length - 1)

  const points = data.map((v, i) => {
    const x = pad + i * stepX
    const y = height - pad - ((v - min) / (max - min)) * (height - pad * 2)
    return [x, y] as const
  })

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ")
  const area = `${line} L ${points[points.length - 1][0]},${height - pad} L ${points[0][0]},${height - pad} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" preserveAspectRatio="none" role="img" aria-label="График расходов по дням">
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad}
            x2={width - pad}
            y1={height - pad - t * (height - pad * 2)}
            y2={height - pad - t * (height - pad * 2)}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        <path d={area} fill="url(#spendFill)" />
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) =>
          i === points.length - 1 ? (
            <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="var(--primary)" stroke="var(--card)" strokeWidth="2.5" />
          ) : null,
        )}
      </svg>
      <div className="mt-2 flex justify-between px-1 text-xs text-muted-foreground">
        <span>1</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
        <span>30</span>
      </div>
    </div>
  )
}

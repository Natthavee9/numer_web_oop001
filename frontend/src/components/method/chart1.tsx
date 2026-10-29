import { useState, useMemo } from "react"

export interface HistoryRow {
  iteration: number
  root: number
  error: number
  fx: number
}

export interface Chart1Props {
  history: HistoryRow[]
  fxString?: string
  xl?: number
  xr?: number
  finalRoot?: number
  title?: string
}

export function Chart1({ history, title = "Error Plot" }: Chart1Props) {
  const [hoveredPoint, setHoveredPoint] = useState<HistoryRow | null>(null)

  // Chart dimensions
  const width = 760
  const height = 320
  const pad = { top: 25, right: 30, bottom: 45, left: 85 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  // Subsample points if history is large (e.g. Graphical Method with many steps)
  const displayHistory = useMemo(() => {
    if (history.length <= 250) return history
    const step = Math.ceil(history.length / 250)
    const sampled: HistoryRow[] = []
    for (let i = 0; i < history.length; i += step) {
      sampled.push(history[i])
    }
    if (sampled[sampled.length - 1].iteration !== history[history.length - 1].iteration) {
      sampled.push(history[history.length - 1])
    }
    return sampled
  }, [history])

  const maxIter = history.length > 0 ? history[history.length - 1].iteration : 1
  const maxErr = useMemo(() => {
    if (history.length === 0) return 0.000001
    return Math.max(...displayHistory.map((h) => h.error), 0.000001)
  }, [displayHistory, history])

  // Scaling functions
  const scaleX = (iter: number) =>
    pad.left + ((iter - 1) / Math.max(maxIter - 1, 1)) * innerW

  const scaleY = (errVal: number) =>
    pad.top + ((maxErr - errVal) / maxErr) * innerH

  // Path connecting all error points
  const errorPathD = useMemo(() => {
    if (displayHistory.length === 0) return ""
    return displayHistory
      .map((h, i) => `${i === 0 ? "M" : "L"} ${scaleX(h.iteration).toFixed(1)},${scaleY(h.error).toFixed(1)}`)
      .join(" ")
  }, [displayHistory, maxIter, maxErr])

  return (
    <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-xs text-base-content/60">
            Plotting Error values across all {history.length} iterations
          </p>
        </div>
        <div className="badge badge-outline text-xs">
          Final Error: {history.length > 0 ? history[history.length - 1].error.toFixed(6) : "0.000000"}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible select-none">
          {/* Horizontal Grid Lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const yVal = maxErr * (1 - pct)
            const yPos = pad.top + pct * innerH
            return (
              <g key={`grid-y-${pct}`}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={yPos}
                  y2={yPos}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <text
                  x={pad.left - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="currentColor"
                  fillOpacity={0.6}
                  className="font-mono"
                >
                  {yVal.toFixed(6)}
                </text>
              </g>
            )
          })}

          {/* X-axis Line */}
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={height - pad.bottom}
            y2={height - pad.bottom}
            stroke="currentColor"
            strokeOpacity={0.2}
          />

          {/* X-axis Iteration Ticks & Labels */}
          {displayHistory.map((row) => {
            const cx = scaleX(row.iteration)
            const skipStep = Math.ceil(displayHistory.length / 15)
            const showLabel = row.iteration === 1 || row.iteration === maxIter || row.iteration % skipStep === 0

            return (
              <g key={`grid-x-${row.iteration}`}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={height - pad.bottom}
                  y2={height - pad.bottom + 5}
                  stroke="currentColor"
                  strokeOpacity={0.2}
                />
                {showLabel && (
                  <text
                    x={cx}
                    y={height - pad.bottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    fillOpacity={0.6}
                  >
                    {row.iteration}
                  </text>
                )}
              </g>
            )
          })}

          {/* Error Line Plot (Clean line without area fill) */}
          {errorPathD && (
            <path
              d={errorPathD}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Error Points on each iteration */}
          {displayHistory.map((row) => {
            const cx = scaleX(row.iteration)
            const cy = scaleY(row.error)
            const isHovered = hoveredPoint?.iteration === row.iteration
            const isLast = row.iteration === maxIter

            return (
              <g
                key={`point-${row.iteration}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(row)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Highlight ring on hover */}
                {isHovered && (
                  <circle cx={cx} cy={cy} r="8" fill="#6366f1" fillOpacity="0.2" />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5.5 : isLast ? 5 : 4}
                  fill={isLast ? "#10b981" : "#6366f1"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            )
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-base-300 bg-base-100/95 p-2 text-xs shadow-lg backdrop-blur"
            style={{
              left: `${Math.min(Math.max(scaleX(hoveredPoint.iteration), 90), width - 140)}px`,
              top: `${Math.max(scaleY(hoveredPoint.error) - 75, 10)}px`,
            }}
          >
            <p className="font-bold text-primary">Iteration {hoveredPoint.iteration}</p>
            <p>
              Error: <span className="font-mono font-semibold">{hoveredPoint.error.toFixed(6)}</span>
            </p>
            <p>
              X: <span className="font-mono">{hoveredPoint.root.toFixed(6)}</span>
            </p>
          </div>
        )}

        {/* Axis Labels & Legend */}
        <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
          <div></div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-indigo-500" />
            <span>Error at each iteration</span>
            <span className="inline-block size-2.5 rounded-full bg-emerald-500 ml-3" />
            <span>Final Error</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Chart1


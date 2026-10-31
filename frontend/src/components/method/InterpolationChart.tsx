import { useMemo } from "react"
import Plotly from "plotly.js-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"

const Plot = createPlotlyComponent(Plotly)

export interface InterpolationPointData {
  x: number
  y: number
}

interface InterpolationChartProps {
  points: InterpolationPointData[]
  targetX?: number
  targetY?: number
  curvePoints?: InterpolationPointData[]
  title?: string
}

export function InterpolationChart({
  points,
  targetX,
  targetY,
  curvePoints,
  title = "Interpolation Plot",
}: InterpolationChartProps) {
  const plotData = useMemo(() => {
    const traces: any[] = []

    // 1. Smooth curve if available, or connecting line
    if (curvePoints && curvePoints.length > 0) {
      traces.push({
        x: curvePoints.map((p) => p.x),
        y: curvePoints.map((p) => p.y),
        type: "scatter" as const,
        mode: "lines" as const,
        name: "Interpolation Curve",
        line: {
          color: "#3b82f6",
          width: 2.5,
          shape: "spline",
        },
        hoverinfo: "x+y",
      })
    }

    // 2. Known Data Points
    if (points.length > 0) {
      traces.push({
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
        type: "scatter" as const,
        mode: "markers+text" as const,
        name: "Data Points",
        text: points.map((_, i) => `P${i}`),
        textposition: "top center",
        marker: {
          color: "#6366f1",
          size: 10,
          line: { color: "#ffffff", width: 2 },
        },
        hoverinfo: "x+y+name",
      })
    }

    // 3. Target Evaluated Point
    if (targetX !== undefined && targetY !== undefined && !Number.isNaN(targetY)) {
      traces.push({
        x: [targetX],
        y: [targetY],
        type: "scatter" as const,
        mode: "markers+text" as const,
        name: `Interpolated f(${targetX})`,
        text: [`f(${targetX}) = ${Number(targetY.toFixed(4))}`],
        textposition: "bottom right",
        marker: {
          color: "#10b981",
          size: 14,
          symbol: "diamond",
          line: { color: "#ffffff", width: 2 },
        },
        hoverinfo: "x+y+name",
      })
    }

    return traces
  }, [points, targetX, targetY, curvePoints])

  const layout: Partial<Plotly.Layout> = useMemo(
    () => ({
      autosize: true,
      title: {
        text: title,
        font: { size: 14, color: "#9ca3af" },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#9ca3af", family: "inherit" },
      margin: { l: 50, r: 25, t: 35, b: 45 },
      xaxis: {
        gridcolor: "rgba(156, 163, 175, 0.15)",
        zerolinecolor: "rgba(156, 163, 175, 0.3)",
        title: { text: "x" },
      },
      yaxis: {
        gridcolor: "rgba(156, 163, 175, 0.15)",
        zerolinecolor: "rgba(156, 163, 175, 0.3)",
        title: { text: "y" },
      },
      legend: {
        orientation: "h" as const,
        y: -0.2,
        x: 0.5,
        xanchor: "center" as const,
      },
      hovermode: "closest" as const,
    }),
    [title],
  )

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "320px" }}
      />
    </div>
  )
}


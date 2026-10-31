import { useMemo } from "react"
import Plotly from "plotly.js-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"
import { parse } from "mathjs"

const Plot = createPlotlyComponent(Plotly)

interface IntegrationChartProps {
  fxString: string
  a: number
  b: number
  subdivisions?: number
  title?: string
}

export function IntegrationChart({
  fxString,
  a,
  b,
  subdivisions = 1,
  title = "Integration Area Plot",
}: IntegrationChartProps) {
  const plotData = useMemo(() => {
    if (!fxString || Number.isNaN(a) || Number.isNaN(b) || a === b) return []

    const clean = fxString.replace(/(\d)([a-zA-Z])/g, "$1*$2")
    let compiled: any
    try {
      compiled = parse(clean).compile()
    } catch {
      return []
    }

    const evalSafe = (val: number) => {
      try {
        const res = compiled.evaluate({ x: val })
        return typeof res === "number" && !Number.isNaN(res) ? res : 0
      } catch {
        return 0
      }
    }

    const minX = Math.min(a, b)
    const maxX = Math.max(a, b)
    const width = maxX - minX || 1
    const domainMin = minX - width * 0.2
    const domainMax = maxX + width * 0.2

    // 1. Continuous function curve
    const curveX: number[] = []
    const curveY: number[] = []
    const numPoints = 120
    for (let i = 0; i <= numPoints; i++) {
      const curX = domainMin + (i * (domainMax - domainMin)) / numPoints
      curveX.push(curX)
      curveY.push(evalSafe(curX))
    }

    // 2. Integration area under curve on [a, b]
    const areaX: number[] = []
    const areaY: number[] = []
    const areaSteps = 80
    for (let i = 0; i <= areaSteps; i++) {
      const curX = minX + (i * width) / areaSteps
      areaX.push(curX)
      areaY.push(evalSafe(curX))
    }

    // 3. Grid segment points x_0, ..., x_n
    const gridX: number[] = []
    const gridY: number[] = []
    const n = Math.max(1, Math.min(subdivisions, 100))
    for (let i = 0; i <= n; i++) {
      const xVal = a + (i * (b - a)) / n
      gridX.push(xVal)
      gridY.push(evalSafe(xVal))
    }

    return [
      // Shaded Area under f(x)
      {
        x: areaX,
        y: areaY,
        type: "scatter" as const,
        mode: "lines" as const,
        name: "Integral Area",
        fill: "tozeroy" as const,
        fillcolor: "rgba(99, 102, 241, 0.25)",
        line: { color: "rgba(99, 102, 241, 0)" },
        hoverinfo: "skip",
      },
      // Continuous function line
      {
        x: curveX,
        y: curveY,
        type: "scatter" as const,
        mode: "lines" as const,
        name: `f(x) = ${fxString}`,
        line: { color: "#6366f1", width: 2.5 },
        hoverinfo: "x+y",
      },
      // Numerical rule points & straight segment chords
      {
        x: gridX,
        y: gridY,
        type: "scatter" as const,
        mode: "lines+markers" as const,
        name: "Approximation Segments",
        line: { color: "#10b981", width: 2, dash: "dot" },
        marker: { color: "#10b981", size: 7 },
        hoverinfo: "x+y",
      },
    ]
  }, [fxString, a, b, subdivisions])

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
        title: { text: "f(x)" },
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

  if (plotData.length === 0) return null

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  )
}


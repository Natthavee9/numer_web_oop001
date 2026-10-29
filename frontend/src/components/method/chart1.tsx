import { useMemo } from "react"
import Plotly from "plotly.js-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"

const Plot = createPlotlyComponent(Plotly)

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
  const finalError = history.length > 0 ? history[history.length - 1].error : 0

  const plotData = useMemo(() => {
    if (history.length === 0) return []

    const xVals = history.map((h) => h.iteration)
    const yVals = history.map((h) => h.error)
    const customData = history.map((h) => [h.root, h.fx])
    const markerColors = history.map((_, i) =>
      i === history.length - 1 ? "#10b981" : "#6366f1"
    )
    const markerSizes = history.map((_, i) =>
      i === history.length - 1 ? 9 : 6
    )

    return [
      {
        x: xVals,
        y: yVals,
        customdata: customData,
        type: "scatter" as const,
        mode: "lines+markers" as const,
        name: "Error",
        line: {
          color: "#6366f1",
          width: 2.5,
        },
        marker: {
          color: markerColors,
          size: markerSizes,
        },
        hovertemplate:
          "<b>Iteration %{x}</b><br>" +
          "Error: %{y:.6f}<br>" +
          "x: %{customdata[0]:.6f}<br>" +
          "<extra></extra>",
      },
    ]
  }, [history])

  const plotLayout = useMemo(() => {
    return {
      autosize: true,
      margin: { l: 65, r: 25, t: 20, b: 45 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: {
        family: "inherit",
        color: "currentColor",
      },
      xaxis: {
        title: { text: "Iteration Number", font: { size: 12 } },
        gridcolor: "rgba(150, 150, 150, 0.15)",
        zerolinecolor: "rgba(150, 150, 150, 0.2)",
        tickfont: { size: 11 },
      },
      yaxis: {
        title: { text: "Error (Decimal)", font: { size: 12 } },
        gridcolor: "rgba(150, 150, 150, 0.15)",
        zerolinecolor: "rgba(150, 150, 150, 0.2)",
        tickformat: ".6f",
        tickfont: { size: 11 },
      },
      showlegend: false,
    }
  }, [])

  return (
    <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-xs text-base-content/60">
            Plotting Error values across all {history.length} iterations (Plotly)
          </p>
        </div>
        <div className="badge badge-outline text-xs">
          Final Error: {finalError.toFixed(6)}
        </div>
      </div>

      <div className="w-full">
        {history.length > 0 ? (
          <Plot
            data={plotData}
            layout={plotLayout}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ["select2d", "lasso2d"],
            }}
            useResizeHandler
            style={{ width: "100%", height: "340px" }}
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-base-content/50">
            No iteration data available to plot
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
        <div>Y-axis: Error (Decimal)</div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full bg-indigo-500" />
          <span>Error at each iteration</span>
          <span className="inline-block size-2.5 rounded-full bg-emerald-500 ml-3" />
          <span>Final Error</span>
        </div>
        <div>X-axis: Iteration Number</div>
      </div>
    </div>
  )
}

export default Chart1

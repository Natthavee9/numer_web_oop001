import { useState } from "react"
import { Shuffle, Plus, Minus, Trash2 } from "lucide-react"
import { Regression } from "@/calculate/extrapolation/regression.js"
import { MathView } from "@/components/ui/MathView"
import { InterpolationChart } from "@/components/method/InterpolationChart"
import { getRandomRegressionProblem } from "@/lib/equationPresets"

interface RegressionPoint {
  x: string
  y: string
}

interface RegressionResult {
  result: number
  steps: string[]
  coefficients: number[]
  curvePoints: { x: number; y: number }[]
}

export default function RegressionPage() {
  const [points, setPoints] = useState<RegressionPoint[]>([
    { x: "10", y: "106" },
    { x: "15", y: "159" },
    { x: "20", y: "212" },
    { x: "25", y: "265" },
    { x: "30", y: "318" },
  ])
  const [targetX, setTargetX] = useState<string>("16")
  const [countInput, setCountInput] = useState<string>("5")

  const [result, setResult] = useState<RegressionResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const applyCount = (newCount: number) => {
    const clamped = Math.max(2, Math.min(newCount, 25))
    setCountInput(clamped.toString())

    if (clamped > points.length) {
      const lastX = points.length > 0 ? parseFloat(points[points.length - 1].x) || points.length : 0
      const added: RegressionPoint[] = Array.from({ length: clamped - points.length }, (_, i) => ({
        x: (lastX + (i + 1) * 5).toString(),
        y: "0",
      }))
      setPoints([...points, ...added])
    } else if (clamped < points.length) {
      setPoints(points.slice(0, clamped))
    }
    setResult(null)
    setErrorMsg("")
  }

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCountInput(val)
    const parsed = parseInt(val, 10)
    if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 25) {
      applyCount(parsed)
    }
  }

  const handleCountBlur = () => {
    const parsed = parseInt(countInput, 10)
    if (Number.isNaN(parsed) || parsed < 2) {
      applyCount(2)
    } else if (parsed > 25) {
      applyCount(25)
    } else {
      applyCount(parsed)
    }
  }

  const handlePointChange = (index: number, field: "x" | "y", val: string) => {
    const updated = points.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    setPoints(updated)
  }

  const handleAddPoint = () => {
    const lastX = points.length > 0 ? parseFloat(points[points.length - 1].x) || points.length : 0
    setPoints([...points, { x: (lastX + 5).toString(), y: "0" }])
    setCountInput((points.length + 1).toString())
    setResult(null)
  }

  const handleRemovePoint = (index: number) => {
    if (points.length <= 2) return
    const updated = points.filter((_, i) => i !== index)
    setPoints(updated)
    setCountInput(updated.length.toString())
    setResult(null)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setErrorMsg("")

      const parsedTargetX = parseFloat(targetX)
      if (Number.isNaN(parsedTargetX)) {
        throw new Error("Please enter a valid target x value")
      }

      const numPoints = points.map((p, i) => {
        const xVal = parseFloat(p.x)
        const yVal = parseFloat(p.y)
        if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
          throw new Error(`Point ${i + 1} has invalid number values`)
        }
        return { x: [xVal], y: yVal }
      })

      const solver = new Regression()
      const res = solver.solve(numPoints, [parsedTargetX], "linear", 1)

      // Generate linear curve points
      const allX = points.map((p) => parseFloat(p.x) || 0)
      const minX = Math.min(...allX, parsedTargetX)
      const maxX = Math.max(...allX, parsedTargetX)
      const padding = (maxX - minX) * 0.1 || 1
      const startX = minX - padding
      const endX = maxX + padding

      const curvePoints = [
        { x: startX, y: res.coefficients[0] + res.coefficients[1] * startX },
        { x: endX, y: res.coefficients[0] + res.coefficients[1] * endX },
      ]

      setResult({
        result: res.result,
        steps: res.steps,
        coefficients: res.coefficients,
        curvePoints,
      })
    } catch (err: any) {
      setResult(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const preset = getRandomRegressionProblem()
    setPoints(preset.points)
    setTargetX(preset.targetX)
    setCountInput(preset.points.length.toString())
    setResult(null)
    setErrorMsg("")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Linear Regression</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Controls: Point Count & Target X */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">Number of Data Points:</label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyCount(points.length - 1)}
                disabled={points.length <= 2}
                className="btn btn-sm btn-outline btn-square"
                title="Decrease points"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="number"
                min="2"
                max="25"
                value={countInput}
                onChange={handleCountChange}
                onBlur={handleCountBlur}
                className="input input-bordered input-sm w-16 text-center font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => applyCount(points.length + 1)}
                disabled={points.length >= 25}
                className="btn btn-sm btn-outline btn-square"
                title="Increase points"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Target X input */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Target (x):</label>
            <input
              type="number"
              step="any"
              value={targetX}
              onChange={(e) => setTargetX(e.target.value)}
              className="input input-bordered input-sm w-28 font-mono font-bold text-primary"
              placeholder="e.g. 16"
              required
            />
          </div>
        </div>

        {/* Points Table */}
        <div className="overflow-x-auto">
          <table className="table table-sm text-center">
            <thead>
              <tr>
                <th className="w-12">No.</th>
                <th className="min-w-32">x</th>
                <th className="min-w-32">y</th>
                <th className="w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={`point-${i}`}>
                  <td className="font-mono text-xs font-semibold text-base-content/60">{i + 1}</td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      value={p.x}
                      onChange={(e) => handlePointChange(i, "x", e.target.value)}
                      className="input input-bordered input-sm w-full text-center font-mono"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      value={p.y}
                      onChange={(e) => handlePointChange(i, "y", e.target.value)}
                      className="input input-bordered input-sm w-full text-center font-mono"
                      required
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(i)}
                      disabled={points.length <= 2}
                      className="btn btn-ghost btn-xs text-error"
                      title="Remove point"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex justify-start">
          <button
            type="button"
            onClick={handleAddPoint}
            disabled={points.length >= 25}
            className="btn btn-ghost btn-xs gap-1 text-primary"
          >
            <Plus className="size-3.5" /> Add Point
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-error mt-4 py-2 text-sm">
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleRandom}
            className="btn btn-outline gap-2"
          >
            <Shuffle className="size-4" />
            Random
          </button>
          <button type="submit" className="btn btn-primary px-6">
            Calculate
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Predicted Result Card */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/70">
              Predicted Result at x = {targetX}
            </h2>
            <div className="mt-2 font-mono text-3xl font-extrabold text-primary">
              f({targetX}) = {Number(result.result.toFixed(6))}
            </div>
            <div className="mt-2 text-sm font-mono text-base-content/80">
              Model: f(x) = {result.coefficients[0].toFixed(4)} + {result.coefficients[1].toFixed(4)}x
            </div>
          </div>

          {/* Regression Chart */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Fitted Line &amp; Data Points</h2>
            <InterpolationChart
              points={points.map((p) => ({ x: parseFloat(p.x) || 0, y: parseFloat(p.y) || 0 }))}
              targetX={parseFloat(targetX)}
              targetY={result.result}
              curvePoints={result.curvePoints}
              title="Linear Regression Line"
            />
          </div>

          {/* Normal Equations & Gauss-Jordan Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Normal Equations &amp; Steps</h2>
              <div className="space-y-3">
                {result.steps.map((step, idx) => (
                  <div
                    key={`regress-step-${idx}`}
                    className="overflow-x-auto rounded-lg bg-base-200/40 p-3 text-center"
                  >
                    <MathView equation={step} className="text-sm sm:text-base" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


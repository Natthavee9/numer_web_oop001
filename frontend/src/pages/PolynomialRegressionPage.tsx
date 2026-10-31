import { useState } from "react"
import { Shuffle, Plus, Minus, Trash2 } from "lucide-react"
import { PolynomialRegression } from "@/calculate/extrapolation/polynomailregress.js"
import { MathView } from "@/components/ui/MathView"
import { InterpolationChart } from "@/components/method/InterpolationChart"
import { getRandomRegressionProblem } from "@/lib/equationPresets"

interface RegressionPoint {
  x: string
  y: string
}

interface PolynomialResult {
  result: number
  steps: string[]
  coefficients: number[]
  curvePoints: { x: number; y: number }[]
}

export default function PolynomialRegressionPage() {
  const [order, setOrder] = useState<string>("2")
  const [points, setPoints] = useState<RegressionPoint[]>([
    { x: "1", y: "2.1" },
    { x: "2", y: "7.9" },
    { x: "3", y: "18.2" },
    { x: "4", y: "31.9" },
    { x: "5", y: "50.1" },
  ])
  const [targetX, setTargetX] = useState<string>("2.5")
  const [countInput, setCountInput] = useState<string>("5")

  const [result, setResult] = useState<PolynomialResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const parsedOrder = parseInt(order, 10) || 2
  const minPointsRequired = parsedOrder + 1

  const applyOrder = (newOrder: number) => {
    const clamped = Math.max(1, Math.min(newOrder, 6))
    setOrder(clamped.toString())
    if (points.length <= clamped) {
      applyCount(clamped + 1)
    }
    setResult(null)
    setErrorMsg("")
  }

  const applyCount = (newCount: number) => {
    const clamped = Math.max(minPointsRequired, Math.min(newCount, 25))
    setCountInput(clamped.toString())

    if (clamped > points.length) {
      const lastX = points.length > 0 ? parseFloat(points[points.length - 1].x) || points.length : 0
      const added: RegressionPoint[] = Array.from({ length: clamped - points.length }, (_, i) => ({
        x: (lastX + i + 1).toString(),
        y: "0",
      }))
      setPoints([...points, ...added])
    } else if (clamped < points.length) {
      setPoints(points.slice(0, clamped))
    }
    setResult(null)
    setErrorMsg("")
  }

  const handlePointChange = (index: number, field: "x" | "y", val: string) => {
    const updated = points.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    setPoints(updated)
  }

  const handleAddPoint = () => {
    const lastX = points.length > 0 ? parseFloat(points[points.length - 1].x) || points.length : 0
    setPoints([...points, { x: (lastX + 1).toString(), y: "0" }])
    setCountInput((points.length + 1).toString())
    setResult(null)
  }

  const handleRemovePoint = (index: number) => {
    if (points.length <= minPointsRequired) return
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

      const parsedOrderNum = parseInt(order, 10)
      if (Number.isNaN(parsedOrderNum) || parsedOrderNum < 1) {
        throw new Error("Order must be at least 1")
      }

      if (points.length <= parsedOrderNum) {
        throw new Error(`Number of points (${points.length}) must be strictly greater than polynomial order (${parsedOrderNum})`)
      }

      const numPoints = points.map((p, i) => {
        const xVal = parseFloat(p.x)
        const yVal = parseFloat(p.y)
        if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
          throw new Error(`Point ${i + 1} has invalid number values`)
        }
        return { x: xVal, y: yVal }
      })

      const solver = new PolynomialRegression(numPoints, parsedTargetX, parsedOrderNum)
      const res = solver.solve()

      // Generate smooth curve points
      const allX = points.map((p) => parseFloat(p.x) || 0)
      const minX = Math.min(...allX, parsedTargetX)
      const maxX = Math.max(...allX, parsedTargetX)
      const padding = (maxX - minX) * 0.1 || 1
      const startX = minX - padding
      const endX = maxX + padding
      const stepsCount = 80
      const curvePoints: { x: number; y: number }[] = []

      for (let s = 0; s <= stepsCount; s++) {
        const curX = startX + ((endX - startX) * s) / stepsCount
        let curY = 0
        for (let i = 0; i < res.coefficients.length; i++) {
          curY += res.coefficients[i] * Math.pow(curX, i)
        }
        curvePoints.push({ x: curX, y: curY })
      }

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
    if (preset.order) setOrder(preset.order)
    setCountInput(preset.points.length.toString())
    setResult(null)
    setErrorMsg("")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header */}
      <div className="border-b border-base-300 pb-4">
        <h1 className="text-3xl font-bold">Polynomial Regression</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Controls: Order, Point Count & Target X */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Polynomial Order (m) */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">Order (m):</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => applyOrder(parsedOrder - 1)}
                  disabled={parsedOrder <= 1}
                  className="btn btn-sm btn-outline btn-square"
                  title="Decrease order"
                >
                  <Minus className="size-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value)
                    const p = parseInt(e.target.value, 10)
                    if (!Number.isNaN(p) && p >= 1 && p <= 6) applyOrder(p)
                  }}
                  className="input input-bordered input-sm w-14 text-center font-mono font-bold"
                  required
                />
                <button
                  type="button"
                  onClick={() => applyOrder(parsedOrder + 1)}
                  disabled={parsedOrder >= 6}
                  className="btn btn-sm btn-outline btn-square"
                  title="Increase order"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Points Count */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">Points:</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => applyCount(points.length - 1)}
                  disabled={points.length <= minPointsRequired}
                  className="btn btn-sm btn-outline btn-square"
                  title="Decrease points"
                >
                  <Minus className="size-4" />
                </button>
                <input
                  type="number"
                  min={minPointsRequired}
                  max="25"
                  value={countInput}
                  onChange={(e) => {
                    setCountInput(e.target.value)
                    const p = parseInt(e.target.value, 10)
                    if (!Number.isNaN(p) && p >= minPointsRequired && p <= 25) applyCount(p)
                  }}
                  className="input input-bordered input-sm w-14 text-center font-mono font-bold"
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
              placeholder="e.g. 2.5"
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
                      disabled={points.length <= minPointsRequired}
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
              Polynomial Order {order} Prediction at x = {targetX}
            </h2>
            <div className="mt-2 font-mono text-3xl font-extrabold text-primary">
              f({targetX}) = {Number(result.result.toFixed(6))}
            </div>
            <div className="mt-2 text-sm font-mono text-base-content/80">
              Model: {result.steps[result.steps.length - 1]}
            </div>
          </div>

          {/* Polynomial Curve Chart */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Fitted Polynomial Curve &amp; Data Points</h2>
            <InterpolationChart
              points={points.map((p) => ({ x: parseFloat(p.x) || 0, y: parseFloat(p.y) || 0 }))}
              targetX={parseFloat(targetX)}
              targetY={result.result}
              curvePoints={result.curvePoints}
              title={`Polynomial Regression (Order ${order})`}
            />
          </div>

          {/* Normal Equations & Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Normal Equations Matrix &amp; Steps</h2>
              <div className="space-y-3">
                {result.steps.map((step, idx) => (
                  <div
                    key={`poly-reg-step-${idx}`}
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


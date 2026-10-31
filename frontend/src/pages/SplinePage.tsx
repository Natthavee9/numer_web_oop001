import { useState } from "react"
import { Shuffle, Plus, Minus, Trash2 } from "lucide-react"
import { Spline } from "@/calculate/Interpolation/Spline.js"
import { MathView } from "@/components/ui/MathView"
import { InterpolationChart } from "@/components/method/InterpolationChart"
import { getRandomInterpolationProblem, type InterpolationPoint } from "@/lib/equationPresets"

type SplineType = "linear" | "quadratic" | "cubic"

interface SplineResult {
  result: number
  steps: string[]
  curvePoints: { x: number; y: number }[]
  splineType: SplineType
}

export default function SplinePage() {
  const [splineType, setSplineType] = useState<SplineType>("cubic")
  const [points, setPoints] = useState<InterpolationPoint[]>([
    { x: "2", y: "9.5" },
    { x: "4", y: "8.0" },
    { x: "6", y: "10.5" },
    { x: "8", y: "39.5" },
    { x: "10", y: "72.5" },
  ])
  const [targetX, setTargetX] = useState<string>("4.5")
  const [countInput, setCountInput] = useState<string>("5")

  const [result, setResult] = useState<SplineResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const minPointsRequired = splineType === "quadratic" ? 3 : 2

  const applyCount = (newCount: number) => {
    const clamped = Math.max(minPointsRequired, Math.min(newCount, 15))
    setCountInput(clamped.toString())

    if (clamped > points.length) {
      const lastX = points.length > 0 ? parseFloat(points[points.length - 1].x) || points.length : 0
      const added: InterpolationPoint[] = Array.from({ length: clamped - points.length }, (_, i) => ({
        x: (lastX + (i + 1) * 2).toString(),
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
    if (!Number.isNaN(parsed) && parsed >= minPointsRequired && parsed <= 15) {
      applyCount(parsed)
    }
  }

  const handleCountBlur = () => {
    const parsed = parseInt(countInput, 10)
    if (Number.isNaN(parsed) || parsed < minPointsRequired) {
      applyCount(minPointsRequired)
    } else if (parsed > 15) {
      applyCount(15)
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
    setPoints([...points, { x: (lastX + 2).toString(), y: "0" }])
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

      if (points.length < minPointsRequired) {
        throw new Error(`${splineType.toUpperCase()} Spline requires at least ${minPointsRequired} points.`)
      }

      const numPoints = points.map((p, i) => {
        const xVal = parseFloat(p.x)
        const yVal = parseFloat(p.y)
        if (Number.isNaN(xVal) || Number.isNaN(yVal)) {
          throw new Error(`Point ${i + 1} has invalid number values`)
        }
        return { x: xVal, y: yVal }
      })

      // Check unique x
      const xSet = new Set<number>()
      for (const p of numPoints) {
        if (xSet.has(p.x)) {
          throw new Error(`Duplicate x value (${p.x}) found. All x values must be strictly distinct.`)
        }
        xSet.add(p.x)
      }

      const solver = new Spline(numPoints)
      const res = solver.solve(parsedTargetX, splineType)

      // Generate curve points for graph across sorted points range
      const sortedX = [...numPoints].sort((a, b) => a.x - b.x).map((p) => p.x)
      const minX = Math.min(sortedX[0], parsedTargetX)
      const maxX = Math.max(sortedX[sortedX.length - 1], parsedTargetX)
      const steps = 80
      const curvePoints: { x: number; y: number }[] = []

      for (let s = 0; s <= steps; s++) {
        const curX = minX + ((maxX - minX) * s) / steps
        try {
          const curRes = solver.solve(curX, splineType)
          curvePoints.push({ x: curX, y: curRes.result })
        } catch {
          // ignore out-of-range evaluation issues if any
        }
      }

      setResult({
        result: res.result,
        steps: res.steps,
        curvePoints,
        splineType,
      })
    } catch (err: any) {
      setResult(null)
      setErrorMsg(err.message || "An error occurred during calculation")
    }
  }

  const handleRandom = () => {
    const preset = getRandomInterpolationProblem()
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
        <h1 className="text-3xl font-bold">Spline Interpolation</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Spline Degree Type Selection */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Spline Type:</span>
            <div className="join">
              <button
                type="button"
                onClick={() => {
                  setSplineType("linear")
                  setResult(null)
                }}
                className={`btn btn-sm join-item ${splineType === "linear" ? "btn-primary" : "btn-outline"}`}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => {
                  setSplineType("quadratic")
                  if (points.length < 3) applyCount(3)
                  setResult(null)
                }}
                className={`btn btn-sm join-item ${splineType === "quadratic" ? "btn-primary" : "btn-outline"}`}
              >
                Quadratic
              </button>
              <button
                type="button"
                onClick={() => {
                  setSplineType("cubic")
                  setResult(null)
                }}
                className={`btn btn-sm join-item ${splineType === "cubic" ? "btn-primary" : "btn-outline"}`}
              >
                Cubic (Natural)
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
              placeholder="e.g. 4.5"
              required
            />
          </div>
        </div>

        {/* Number of Points Control */}
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-semibold">Number of Points:</label>
          <div className="flex items-center gap-1.5">
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
              max={15}
              value={countInput}
              onChange={handleCountChange}
              onBlur={handleCountBlur}
              className="input input-bordered input-sm w-16 text-center font-mono font-bold"
            />
            <button
              type="button"
              onClick={() => applyCount(points.length + 1)}
              disabled={points.length >= 15}
              className="btn btn-sm btn-outline btn-square"
              title="Increase points"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Points Table */}
        <div className="overflow-x-auto">
          <table className="table table-sm text-center">
            <thead>
              <tr>
                <th className="w-12">Point</th>
                <th className="min-w-32">x</th>
                <th className="min-w-32">f(x) or y</th>
                <th className="w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={`point-${i}`}>
                  <td className="font-mono text-xs font-semibold text-base-content/60">P{i}</td>
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
            disabled={points.length >= 15}
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
          {/* Interpolated Value Card */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/70">
              {result.splineType.toUpperCase()} Spline Result at x = {targetX}
            </h2>
            <div className="mt-2 font-mono text-3xl font-extrabold text-primary">
              f({targetX}) = {Number(result.result.toFixed(6))}
            </div>
          </div>

          {/* Interpolation Chart */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">
              {result.splineType.toUpperCase()} Spline Curve &amp; Points
            </h2>
            <InterpolationChart
              points={points.map((p) => ({ x: parseFloat(p.x) || 0, y: parseFloat(p.y) || 0 }))}
              targetX={parseFloat(targetX)}
              targetY={result.result}
              curvePoints={result.curvePoints}
              title={`${result.splineType.charAt(0).toUpperCase() + result.splineType.slice(1)} Spline Curves`}
            />
          </div>

          {/* Segment Equations / Steps */}
          {result.steps.length > 0 && (
            <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-base-content/80">Piecewise Spline Equations &amp; Steps</h2>
              <div className="space-y-3">
                {result.steps.map((step, idx) => (
                  <div
                    key={`spline-step-${idx}`}
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


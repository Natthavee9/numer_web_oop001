import { useState } from "react"
import { Shuffle, Plus, Minus, Trash2 } from "lucide-react"
import { NewtonDivided } from "@/calculate/Interpolation/NewtonDivided.js"
import { InterpolationChart } from "@/components/method/InterpolationChart"
import { getRandomInterpolationProblem, type InterpolationPoint } from "@/lib/equationPresets"

interface NewtonResult {
  result: number
  table: number[][]
  curvePoints: { x: number; y: number }[]
}

export default function NewtonDividedPage() {
  const [points, setPoints] = useState<InterpolationPoint[]>([
    { x: "10", y: "2.3026" },
    { x: "15", y: "2.7081" },
    { x: "20", y: "2.9957" },
  ])
  const [targetX, setTargetX] = useState<string>("16")
  const [countInput, setCountInput] = useState<string>("3")

  const [result, setResult] = useState<NewtonResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const applyCount = (newCount: number) => {
    const clamped = Math.max(2, Math.min(newCount, 12))
    setCountInput(clamped.toString())

    if (clamped > points.length) {
      const added: InterpolationPoint[] = Array.from({ length: clamped - points.length }, (_, i) => ({
        x: (points.length + i + 1).toString(),
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
    if (!Number.isNaN(parsed) && parsed >= 2 && parsed <= 12) {
      applyCount(parsed)
    }
  }

  const handleCountBlur = () => {
    const parsed = parseInt(countInput, 10)
    if (Number.isNaN(parsed) || parsed < 2) {
      applyCount(2)
    } else if (parsed > 12) {
      applyCount(12)
    } else {
      applyCount(parsed)
    }
  }

  const handlePointChange = (index: number, field: "x" | "y", val: string) => {
    const updated = points.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    setPoints(updated)
  }

  const handleAddPoint = () => {
    const nextX = points.length > 0 ? (parseFloat(points[points.length - 1].x) || points.length) + 1 : 0
    setPoints([...points, { x: nextX.toString(), y: "0" }])
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
        return { x: xVal, y: yVal }
      })

      // Check unique x
      const xSet = new Set<number>()
      for (const p of numPoints) {
        if (xSet.has(p.x)) {
          throw new Error(`Duplicate x value (${p.x}) found. All x values must be unique.`)
        }
        xSet.add(p.x)
      }

      const solver = new NewtonDivided(numPoints, parsedTargetX)
      const res = solver.solve()

      // Generate curve points for graph
      const minX = Math.min(...numPoints.map((p) => p.x), parsedTargetX)
      const maxX = Math.max(...numPoints.map((p) => p.x), parsedTargetX)
      const padding = (maxX - minX) * 0.1 || 1
      const startX = minX - padding
      const endX = maxX + padding
      const steps = 60
      const curvePoints: { x: number; y: number }[] = []

      for (let s = 0; s <= steps; s++) {
        const curX = startX + ((endX - startX) * s) / steps
        const curSolver = new NewtonDivided(numPoints, curX)
        const curRes = curSolver.solve()
        curvePoints.push({ x: curX, y: curRes.result })
      }

      setResult({
        result: res.result,
        table: res.table,
        curvePoints,
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
        <h1 className="text-3xl font-bold">Newton&apos;s Divided-Differences</h1>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="card border border-base-300 bg-base-100 p-6 shadow-sm">
        {/* Controls: Point Count & Target X */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">Number of Points:</label>
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
                max="12"
                value={countInput}
                onChange={handleCountChange}
                onBlur={handleCountBlur}
                className="input input-bordered input-sm w-16 text-center font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => applyCount(points.length + 1)}
                disabled={points.length >= 12}
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
            disabled={points.length >= 12}
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
              Interpolated Result at x = {targetX}
            </h2>
            <div className="mt-2 font-mono text-3xl font-extrabold text-primary">
              f({targetX}) = {Number(result.result.toFixed(6))}
            </div>
          </div>

          {/* Interpolation Chart */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Interpolation Curve &amp; Points</h2>
            <InterpolationChart
              points={points.map((p) => ({ x: parseFloat(p.x) || 0, y: parseFloat(p.y) || 0 }))}
              targetX={parseFloat(targetX)}
              targetY={result.result}
              curvePoints={result.curvePoints}
              title="Newton's Polynomial Curve"
            />
          </div>

          {/* Divided Difference Table */}
          <div className="card border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-base-content/80">Divided-Difference Table</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm text-center">
                <thead>
                  <tr className="bg-base-200">
                    <th className="w-12">i</th>
                    <th>x_i</th>
                    <th>f[x_i]</th>
                    {Array.from({ length: points.length - 1 }, (_, order) => (
                      <th key={`ord-${order}`}>
                        Order {order + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {points.map((p, i) => (
                    <tr key={`diff-row-${i}`}>
                      <td className="font-mono text-xs">{i}</td>
                      <td className="font-mono font-semibold">{p.x}</td>
                      <td className="font-mono">{result.table[i]?.[0] !== undefined ? Number(result.table[i][0].toFixed(5)) : "-"}</td>
                      {Array.from({ length: points.length - 1 }, (_, order) => {
                        const val = result.table[i]?.[order + 1]
                        return (
                          <td key={`diff-cell-${i}-${order}`} className="font-mono">
                            {val !== undefined && val !== 0 && !Number.isNaN(val)
                              ? Number(val.toFixed(5))
                              : i + order + 1 < points.length
                              ? Number((val || 0).toFixed(5))
                              : "-"}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


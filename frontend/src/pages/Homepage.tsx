import { Link } from "react-router-dom"
import { ArrowRight, Binary, ChartLine, FunctionSquare, Grid3x3, Sigma, TrendingUp } from "lucide-react"
import { methodGroups, type MethodGroup, type MethodItem } from "@/lib/methods"

const CATEGORY_ICONS = [FunctionSquare, Grid3x3, ChartLine, TrendingUp, Sigma, Binary]

export function HomePage() {
      return (
            <div className="space-y-8">
                  <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {methodGroups.map((group: MethodGroup, index: number) => {
                              const Icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
                              return (
                                    <div
                                          key={group.category}
                                          className="card border border-base-300 bg-base-100 shadow-sm"
                                    >
                                          <div className="card-body gap-4">
                                                <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                                                      <Icon className="size-5 text-primary" />
                                                </div>
                                                <h2 className="card-title">{group.label}</h2>
                                                <div className="space-y-1">
                                                      {group.methods.map((method: MethodItem) => (
                                                            <Link
                                                                  key={method.title}
                                                                  to={`/${group.category}`}
                                                                  className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-base-200"
                                                            >
                                                                  {method.title}
                                                                  <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                                            </Link>
                                                      ))}
                                                </div>
                                          </div>
                                    </div>
                              )
                        })}
                  </section>
            </div>
      )
}

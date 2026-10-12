import { Link, useLocation } from "react-router-dom"
import { methodGroups, type MethodGroup, type MethodItem } from "@/lib/methods"
import { cn } from "@/lib/utils"

export function Navbar() {
      const location = useLocation()

      return (
            <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur">
                  <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4">
                        {/* Brand logo and home link */}
                        <Link to="/" className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                              <span className="hidden sm:inline">Numerical Methods</span>
                        </Link>

                        {/* Desktop navigation menu with category dropdowns */}
                        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Method categories">
                              {methodGroups.map((group: MethodGroup) => {
                                    const basePath = `/${group.category}`
                                    const active = location.pathname.startsWith(basePath)
                                    return (
                                          <div key={group.category} className="dropdown dropdown-hover dropdown-bottom">
                                                <div
                                                      tabIndex={0}
                                                      role="button"
                                                      className={cn(
                                                            "rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-base-200",
                                                            active && "bg-base-200",
                                                      )}
                                                >
                                                      {group.label}
                                                </div>
                                                <div className="dropdown-content z-50 w-64 pt-1">
                                                      <ul className="grid gap-0.5 rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl">
                                                            {group.methods.map((method: MethodItem) => (
                                                                  <li key={method.title}>
                                                                        <Link
                                                                              to={basePath}
                                                                              className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-base-200"
                                                                        >
                                                                              {method.title}
                                                                        </Link>
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </div>
                                          </div>
                                    )
                              })}
                        </nav>

                        {/* Right-side action area (e.g., ThemeToggle) */}
                        <div className="ml-auto flex items-center">
                              {/* <ThemeToggle /> */}
                        </div>
                  </div>

                  {/* Mobile horizontal scrollable navigation bar */}
                  <nav className="flex gap-2 overflow-x-auto border-t border-base-300 px-4 py-1.5 lg:hidden">
                        {methodGroups.map((group: MethodGroup) => (
                              <Link
                                    key={group.category}
                                    to={`/${group.category}`}
                                    className={cn(
                                          "whitespace-nowrap rounded-lg px-2 py-1 text-xs",
                                          location.pathname.startsWith(`/${group.category}`)
                                                ? "bg-base-200"
                                                : "text-base-content/60",
                                    )}
                              >
                                    {group.label}
                              </Link>
                        ))}
                  </nav>
            </header>
      )
}

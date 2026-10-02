import { Link } from "react-router-dom";
import { Sigma } from "lucide-react";

export function Navbar() {
      return (
            <header className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100">
                  <div className="mx-auto flex w-full max-w-7xl items-center px-4">
                        <Link to="/" className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                              <Sigma className="size-5 text-primary" />
                              <span className="hidden sm:inline">Numerical Method</span>
                        </Link>
                  </div>
            </header>
      )
}

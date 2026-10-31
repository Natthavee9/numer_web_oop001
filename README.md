# Numerical Methods Web

A modern, full-stack web application designed for solving and visualizing **Numerical Methods** problems, complete with step-by-step LaTeX formula rendering, interactive convergence graphs, and database-driven problem generation.

Developed as part of the Numerical Methods curriculum at King Mongkut's University of Technology North Bangkok (KMUTNB).

---

## 🚀 Features & Supported Methods

### 1. Root of Equations
- **Graphical Method**: Interactive function plotting with root isolation
- **Bisection Method**: Interval halving with convergence history and error tracking
- **False Position Method (Regula Falsi)**: Linear interpolation bracket method
- **One-Point Iteration**: Fixed-point method $x = g(x)$ with iterative convergence checking
- **Newton-Raphson Method**: First-order tangent line method with analytical derivative calculation
- **Secant Method**: Two-point secant line approximation

### 2. Linear Algebra Systems
- **Cramer's Rule**: Determinant-based solution with sub-matrix visualizers ($N \times N$)
- **Gauss Elimination**: Forward elimination to upper triangular with backward substitution
- **Gauss-Jordan**: Complete row reduction to reduced row echelon form (RREF)
- **Matrix Inversion**: Augmented matrix inversion $[A \mid I] \rightarrow [I \mid A^{-1}]$
- **LU Decomposition**: Doolittle algorithm decomposing $A = L \cdot U$ with intermediate vector $y$
- **Cholesky Decomposition**: Symmetric positive-definite matrix decomposition $NA = L \cdot L^T$ with forward/backward substitution steps
- **Jacobi Iteration**: Iterative diagonally-dominant linear solver
- **Conjugate Gradient**: Krylov subspace method for symmetric positive-definite systems with error convergence chart

### 3. Interpolation
- **Newton's Divided-Differences**: Divided-difference table and polynomial evaluation
- **Lagrange Interpolation**: Fundamental Lagrange polynomial basis computation
- **Spline Interpolation**: Linear, Quadratic, and Cubic spline piecewise polynomials

### 4. Extrapolation & Regression
- **Linear Regression**: Ordinary Least Squares (OLS) line fitting with $R^2$ determination
- **Polynomial Regression**: Arbitrary $M$-th order polynomial curve fitting with interactive scatter plot

### 5. Numerical Differentiation
- **Forward Divided-Differences**: $O(h)$ and $O(h^2)$ approximations
- **Backward Divided-Differences**: $O(h)$ and $O(h^2)$ approximations
- **Central Divided-Differences**: $O(h^2)$ and $O(h^4)$ high-accuracy approximations
- Supports **1st, 2nd, 3rd, and 4th order derivatives** ($f', f'', f''', f^{(4)}$)
- Analytical exact derivative verification via Math.js with True Relative Error ($\epsilon_t$) calculation
- Multi-method comparison table (Forward vs. Backward vs. Central)

### 6. Numerical Integration
- **Trapezoidal Rule**: Single-interval trapezoid area
- **Composite Trapezoidal Rule**: Multi-segment integration with configurable subintervals
- **Simpson's 1/3 Rule**: Parabolic arc integration
- **Composite Simpson's 1/3 Rule**: High-accuracy composite parabolic integration ($2n$ segments) with area shading plots

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + DaisyUI 5
- **Math & LaTeX Rendering**: MathJax (`better-react-mathjax`) + Math.js (symbolic differentiation & expressions)
- **Charts & Visualization**: Plotly.js (`react-plotly.js`)
- **Icons**: Lucide React
- **Routing**: React Router v7

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & DB Engine**: SQLAlchemy 2.x
- **Database Driver**: `psycopg2-binary`
- **Database**: PostgreSQL hosted on Supabase (Session Pooler IPv4)
- **ASGI Server**: Uvicorn

---

## 📁 Project Structure

```text
numer_web_oop001/
├── backend/
│   ├── main.py              # FastAPI application, CORS, and REST API endpoints
│   ├── database.py          # SQLAlchemy engine, session maker, and DB dependency
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (Supabase connection string)
├── frontend/
│   ├── src/
│   │   ├── calculate/       # OOP Mathematical calculation engines
│   │   │   ├── Diff/        # Numerical differentiation logic
│   │   │   ├── extrapolation/# Linear & Polynomial Regression algorithms
│   │   │   ├── Integration/ # Trapezoidal & Simpson rules
│   │   │   ├── Interpolation/# Newton, Lagrange, and Spline algorithms
│   │   │   ├── LinearAlgrebra/# Matrix algorithms (Cholesky, LU, Cramer, etc.)
│   │   │   └── root_of_equation/# Root-finding algorithms (Bisection, Secant, etc.)
│   │   ├── components/      # UI, Navbar, MathView, and Plotly Chart components
│   │   ├── lib/             # Navigation config, equations presets, and helpers
│   │   ├── pages/           # Page views for each numerical method
│   │   ├── App.tsx          # Client-side routing and MathJax context
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Node.js dependencies and scripts
│   └── vite.config.ts       # Vite configuration
└── README.md
```

---

## ⚡ Installation & Setup Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher) & npm
- **Python** (v3.10 or higher) & pip

---

### 2. Backend Setup (FastAPI + Supabase)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the environment variables in `backend/.env`:
   ```env
   # Use the Supabase IPv4 Session Pooler connection string:
   SUPABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   > **Note:** If using Supabase on local networks that do not route IPv6, use the **Session Pooler** host (`aws-0-<region>.pooler.supabase.com:5432`) instead of direct connection (`db.<project-ref>.supabase.co`). Ensure your password does not contain bracket placeholders `[...]`.

5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).
   Interactive Swagger API documentation is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Health check |
| `GET` | `/test-db` | Test Supabase database connectivity |
| `GET` | `/api/bisection` | Fetch all stored bisection problems |
| `GET` | `/api/bisection/random` | Randomly retrieve one problem from `bisection_problems` table |
| `POST` | `/api/bisection` | Save a new bisection problem to the database |

---

## 🧪 Build & Type Check Verification

To verify that the frontend has no TypeScript errors and builds cleanly for production:

```bash
cd frontend
npx tsc --noEmit
npm run build
```

---

## 📄 License
This project is developed for educational purposes under the KMUTNB curriculum.


from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Float, text
from sqlalchemy.orm import Session
from database import engine, Base, get_db

# Model mapping to the bisection_problems table in Supabase
class BisectionProblem(Base):
    __tablename__ = "bisection_problems"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    equation = Column(String, nullable=False)
    xl = Column(Float, nullable=False)
    xr = Column(Float, nullable=False)

try:
    Base.metadata.create_all(bind=engine)
    print("Database tables verified/created successfully.")
except Exception as e:
    print(f"Warning: Failed to connect to database at startup: {e}")

app = FastAPI(title="Numerical Methods API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running!"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Supabase connected successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Get all bisection problems
@app.get("/api/bisection")
def get_all_bisection(db: Session = Depends(get_db)):
    try:
        try:
            rows = db.execute(text("SELECT equation, xl, xr FROM bisection_problems")).mappings().all()
        except Exception:
            rows = db.execute(text("SELECT equation, xl, xr FROM bisection")).mappings().all()

        return [
            {
                "equation": str(row["equation"]),
                "xl": float(row["xl"]),
                "xr": float(row["xr"])
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

# Randomly fetch one bisection problem
@app.get("/api/bisection/random")
def get_random_bisection(db: Session = Depends(get_db)):
    try:
        row = None
        try:
            row = db.execute(text("SELECT equation, xl, xr FROM bisection_problems ORDER BY RANDOM() LIMIT 1")).mappings().first()
        except Exception:
            row = db.execute(text("SELECT equation, xl, xr FROM bisection ORDER BY RANDOM() LIMIT 1")).mappings().first()

        if not row:
            raise HTTPException(status_code=404, detail="No problems found in bisection table")
        return {
            "equation": str(row["equation"]),
            "xl": float(row["xl"]),
            "xr": float(row["xr"])
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

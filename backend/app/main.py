from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import uvicorn

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_initial_data

from app.routes import auth, scan, url, image, report, feedback, dashboard, education

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database Tables & Seed Data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    except Exception as e:
        print(f"Seed data notice: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Scam Detection and Real-Time Protection Platform API",
    lifespan=lifespan
)

# Enable CORS for local Vite dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(scan.router, prefix=settings.API_V1_STR)
app.include_router(url.router, prefix=settings.API_V1_STR)
app.include_router(image.router, prefix=settings.API_V1_STR)
app.include_router(report.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(education.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

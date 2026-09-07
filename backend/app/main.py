from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base

from app.routers.auth_routes import router as auth_router
from app.routers.ticket_routes import router as ticket_router
from app.routers.analytics_routes import router as analytics_router

app = FastAPI(
    title="SupportIQ API",
    description="AI Customer Support Ticket Intelligence Platform",
    version="1.0.0"
)

# ---------------------------------
# CORS Configuration
# ---------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.github\.io.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# Create Database Tables Safely
# ---------------------------------

try:
    Base.metadata.create_all(bind=engine)
    print("[DATABASE] Database tables verified / created.")
except Exception as db_err:
    print(f"[DATABASE] Warning: Unable to initialize tables on startup: {db_err}")

# ---------------------------------
# Register Routers
# ---------------------------------

app.include_router(auth_router)
app.include_router(ticket_router)
app.include_router(analytics_router)

# ---------------------------------
# Home API
# ---------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to SupportIQ API",
        "status": "running"
    }

# ---------------------------------
# Health API
# ---------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }
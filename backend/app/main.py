from fastapi import FastAPI

from app.database import engine
from app.models import Base

from app.auth import router as auth_router
from app.routers.ticket_routes import router as ticket_router
from .routers.analytics_routes import (
    router as analytics_router
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SupportIQ API",
    description="AI Customer Support Ticket Intelligence Platform",
    version="1.0.0"
)

# Register Routers
app.include_router(auth_router)
app.include_router(ticket_router)
app.include_router(
    analytics_router
)

@app.get("/")
def home():
    return {
        "message": "Welcome to SupportIQ API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "connected"
    }
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base


# ============================================================
# Load Environment Variables
# ============================================================

load_dotenv()


# ============================================================
# Database Configuration
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./supportiq.db"
    print("[DATABASE] No DATABASE_URL found. Defaulting to local SQLite: supportiq.db")

# ============================================================
# SQLAlchemy Engine
# ============================================================

engine_args = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    engine_args["pool_recycle"] = 1800

engine = create_engine(DATABASE_URL, **engine_args)


# ============================================================
# Database Session
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ============================================================
# Base Model
# ============================================================

Base = declarative_base()


# ============================================================
# Database Dependency
# ============================================================

def get_db():
    """
    Create a database session for each request
    and close it after the request finishes.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# Database Health Check
# ============================================================

def check_database_connection() -> bool:
    """
    Check whether PostgreSQL is reachable.
    """

    try:

        with engine.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        return True

    except Exception:

        return False
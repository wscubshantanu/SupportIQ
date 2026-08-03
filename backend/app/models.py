# Import SQLAlchemy column types
from sqlalchemy import Column, Integer, String, Text, DateTime

# Import datetime
from datetime import datetime

# Import Base
from app.database import Base


# =========================
# User Database Table
# =========================

class User(Base):

    __tablename__ = "users"


    # User ID
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # User name
    name = Column(
        String(100),
        nullable=False
    )


    # Email
    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )


    # Password
    password = Column(
        String(255),
        nullable=False
    )


    # User Role
    # customer / support_agent / admin

    role = Column(
        String(50),
        default="customer",
        nullable=False
    )



# =========================
# Ticket Database Table
# =========================

class Ticket(Base):

    __tablename__ = "tickets"


    # Ticket ID
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Ticket title
    title = Column(
        String(255),
        nullable=False
    )


    # Ticket description
    description = Column(
        Text,
        nullable=False
    )


    # AI category prediction
    category = Column(
        String(100)
    )


    # AI priority prediction
    priority = Column(
        String(50)
    )


    # AI sentiment prediction
    sentiment = Column(
        String(50)
    )


    # Ticket status
    status = Column(
        String(50),
        default="Open"
    )


    # User who created ticket
    created_by = Column(
        Integer
    )


    # Created time
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
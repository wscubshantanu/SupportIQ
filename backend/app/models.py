from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


# ============================================================
# User Model
# ============================================================

class User(Base):

    __tablename__ = "users"

    # --------------------------------------------------------
    # Primary Key
    # --------------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # --------------------------------------------------------
    # User Information
    # --------------------------------------------------------

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    # --------------------------------------------------------
    # Password
    # --------------------------------------------------------

    # Stores the bcrypt password hash.
    # Never store plain-text passwords.
    password = Column(
        String(255),
        nullable=False
    )

    # --------------------------------------------------------
    # User Role
    # --------------------------------------------------------

    # Supported roles:
    # customer
    # support_agent
    # admin
    role = Column(
        String(50),
        nullable=False,
        default="customer"
    )

    # --------------------------------------------------------
    # Relationships
    # --------------------------------------------------------

    tickets = relationship(
        "Ticket",
        back_populates="user",
        foreign_keys="Ticket.created_by"
    )


# ============================================================
# Ticket Model
# ============================================================

class Ticket(Base):

    __tablename__ = "tickets"

    # --------------------------------------------------------
    # Primary Key
    # --------------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # --------------------------------------------------------
    # Ticket Information
    # --------------------------------------------------------

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    # --------------------------------------------------------
    # AI Fields
    # --------------------------------------------------------

    # AI predicted category
    category = Column(
        String(100),
        nullable=True
    )

    # AI predicted priority
    priority = Column(
        String(50),
        nullable=True
    )

    # AI predicted sentiment
    sentiment = Column(
        String(50),
        nullable=True
    )

    # --------------------------------------------------------
    # Ticket Status
    # --------------------------------------------------------

    status = Column(
        String(50),
        nullable=False,
        default="Open"
    )

    # --------------------------------------------------------
    # Ticket Owner
    # --------------------------------------------------------

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    user = relationship(
        "User",
        back_populates="tickets",
        foreign_keys=[created_by]
    )

    # --------------------------------------------------------
    # Created Timestamp
    # --------------------------------------------------------

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )
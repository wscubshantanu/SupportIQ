# ==========================================
# SupportIQ - Pydantic Schemas
# ==========================================

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


# ==========================================
# USER SCHEMAS
# ==========================================

class UserCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: str = Field(
        ...,
        min_length=5,
        max_length=150
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=72
    )

    role: str = "customer"


class UserResponse(BaseModel):

    id: int
    name: str
    email: str
    role: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# LOGIN
# ==========================================

class LoginRequest(BaseModel):

    email: str
    password: str


class TokenResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"


# ==========================================
# TICKET CREATE
# ==========================================
#
# IMPORTANT:
# Frontend only sends:
#   title
#   description
#
# AI automatically predicts:
#   category
#   priority
#   sentiment
#
# Status is also automatically set to "Open"
# by the backend.
# ==========================================

class TicketCreate(BaseModel):

    title: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    description: str = Field(
        ...,
        min_length=1
    )


# ==========================================
# TICKET RESPONSE
# ==========================================

class TicketResponse(BaseModel):

    id: int

    title: str

    description: str

    status: str

    priority: str

    category: Optional[str] = None

    sentiment: Optional[str] = None

    created_by: Optional[int] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# STATUS UPDATE
# ==========================================

class TicketStatusUpdate(BaseModel):

    status: str = Field(
        ...,
        min_length=1
    )


# ==========================================
# GENERIC MESSAGE
# ==========================================

class MessageResponse(BaseModel):

    message: str
from pydantic import BaseModel


# Data required during registration
class UserCreate(BaseModel):

    name: str
    email: str
    password: str
    role: str = "customer"


# Data returned to the frontend
class UserResponse(BaseModel):

    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):

    email: str
    password: str

class TicketCreate(BaseModel):

    title: str
    description: str


class TicketResponse(BaseModel):

    id: int
    title: str
    description: str
    category: str | None
    priority: str | None
    sentiment: str | None
    status: str

    class Config:
        from_attributes = True
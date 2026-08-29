# ==========================================
# SupportIQ - Authentication Router
# ==========================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

from app.schemas import (
    UserCreate,
    UserResponse,
    LoginRequest
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REGISTER
# ==========================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    # --------------------------------------
    # Check existing user
    # --------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # --------------------------------------
    # Hash password
    # --------------------------------------

    hashed_password = hash_password(
        user_data.password
    )

    # --------------------------------------
    # Create user
    # --------------------------------------

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role="customer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    print("\n==========================================")
    print("🔥 LOGIN REQUEST")
    print("EMAIL:", login_data.email)
    print("==========================================")

    # --------------------------------------
    # Find user
    # --------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == login_data.email
        )
        .first()
    )

    if user is None:

        print("❌ USER NOT FOUND")

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    print("User found:", user.email)

    # --------------------------------------
    # Verify password
    # --------------------------------------

    password_valid = verify_password(
        login_data.password,
        user.password
    )

    print(
        "Password valid:",
        password_valid
    )

    if not password_valid:

        print("❌ PASSWORD INVALID")

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    print("LOGIN SUCCESS")
    print("User ID:", user.id)
    print("User Role:", user.role)

    # --------------------------------------
    # CREATE JWT
    # --------------------------------------

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role
    }

    access_token = create_access_token(
        token_data
    )

    print("✅ ACCESS TOKEN CREATED")
    print("TOKEN LENGTH:", len(access_token))
    print("TOKEN USER ID:", user.id)
    print("TOKEN ROLE:", user.role)

    # --------------------------------------
    # RETURN LOGIN RESPONSE
    # --------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",

        # IMPORTANT:
        # Login.jsx uses data.role
        "role": user.role,

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
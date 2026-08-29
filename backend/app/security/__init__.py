# ============================================================
# SupportIQ - Security & Authentication
# ============================================================

import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from jose import JWTError, jwt
from passlib.context import CryptContext

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "supportiq-development-secret-key-change-this"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

# Default = 8 hours
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "480"
    )
)

print("==========================================")
print("🔐 SUPPORTIQ JWT CONFIGURATION")
print("==========================================")
print("Algorithm:", ALGORITHM)
print(
    "Token expiry:",
    ACCESS_TOKEN_EXPIRE_MINUTES,
    "minutes"
)
print("==========================================")


# ============================================================
# PASSWORD SECURITY
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """
    Hash plain-text password using bcrypt.
    """

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    try:

        return pwd_context.verify(
            plain_password,
            hashed_password
        )

    except Exception as error:

        print(
            "❌ PASSWORD VERIFICATION ERROR:",
            error
        )

        return False


# ============================================================
# HTTP BEARER AUTHENTICATION
# ============================================================

security = HTTPBearer(
    auto_error=False
)


# ============================================================
# CREATE JWT ACCESS TOKEN
# ============================================================

def create_access_token(data: dict) -> str:

    to_encode = data.copy()

    now = datetime.now(timezone.utc)

    expire = (
        now
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update({
        "iat": now,
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    print("")
    print("==========================================")
    print("✅ ACCESS TOKEN CREATED")
    print("==========================================")
    print("Token length:", len(encoded_jwt))
    print("Token data:", data)
    print("Issued at:", now.isoformat())
    print("Expires at:", expire.isoformat())
    print(
        "Valid for:",
        ACCESS_TOKEN_EXPIRE_MINUTES,
        "minutes"
    )
    print("==========================================")

    return encoded_jwt


# ============================================================
# GET CURRENT LOGGED-IN USER
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db)
) -> User:

    print("")
    print("==========================================")
    print("🔥 USER AUTHENTICATION")
    print("==========================================")

    # --------------------------------------------------------
    # CHECK AUTHORIZATION HEADER
    # --------------------------------------------------------

    if credentials is None:

        print(
            "❌ NO AUTHORIZATION HEADER"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization credentials required",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    token = credentials.credentials

    print(
        "Authorization scheme:",
        credentials.scheme
    )

    print(
        "Token exists:",
        bool(token)
    )

    print(
        "Token length:",
        len(token)
    )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    # --------------------------------------------------------
    # DECODE JWT
    # --------------------------------------------------------

    try:

        print(
            "🔥 DECODING JWT..."
        )

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print(
            "✅ JWT DECODED"
        )

        print(
            "JWT payload:",
            payload
        )

        # ----------------------------------------------------
        # USER ID
        # ----------------------------------------------------

        user_id = payload.get("sub")

        print(
            "User ID from JWT:",
            user_id
        )

        if user_id is None:

            print(
                "❌ JWT SUB IS MISSING"
            )

            raise credentials_exception

        try:

            user_id = int(user_id)

        except (
            ValueError,
            TypeError
        ):

            print(
                "❌ INVALID USER ID IN JWT"
            )

            raise credentials_exception

    except JWTError as error:

        print("")
        print("==========================================")
        print("❌ JWT DECODE ERROR")
        print("==========================================")
        print(
            "Error type:",
            type(error).__name__
        )
        print(
            "Error:",
            error
        )
        print("==========================================")

        raise credentials_exception

    # --------------------------------------------------------
    # FIND USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user is None:

        print(
            "❌ USER NOT FOUND:",
            user_id
        )

        raise credentials_exception

    # --------------------------------------------------------
    # SUCCESS
    # --------------------------------------------------------

    print("")
    print("==========================================")
    print("✅ AUTHENTICATION SUCCESS")
    print("==========================================")
    print(
        "Authenticated user:",
        user.email
    )
    print(
        "User ID:",
        user.id
    )
    print(
        "Database role:",
        user.role
    )
    print("==========================================")

    return user


# ============================================================
# REQUIRE ADMIN
# ============================================================

def require_admin(
    current_user: User = Depends(
        get_current_user
    )
) -> User:

    print("")
    print("==========================================")
    print("👑 ADMIN AUTHORIZATION CHECK")
    print("==========================================")
    print(
        "User:",
        current_user.email
    )
    print(
        "Role:",
        current_user.role
    )

    if current_user.role != "admin":

        print(
            "❌ ADMIN ACCESS DENIED"
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    print(
        "✅ ADMIN ACCESS GRANTED"
    )

    return current_user


# ============================================================
# REQUIRE SUPPORT AGENT
# ============================================================

def require_support_agent(
    current_user: User = Depends(
        get_current_user
    )
) -> User:

    print("")
    print("==========================================")
    print("🎧 SUPPORT AGENT AUTHORIZATION CHECK")
    print("==========================================")
    print(
        "User:",
        current_user.email
    )
    print(
        "Role:",
        current_user.role
    )

    if current_user.role not in [
        "support_agent",
        "admin"
    ]:

        print(
            "❌ SUPPORT ACCESS DENIED"
        )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Support agent access required"
        )

    print(
        "✅ SUPPORT ACCESS GRANTED"
    )

    return current_user
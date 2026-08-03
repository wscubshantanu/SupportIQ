# Import password hashing tool
from passlib.context import CryptContext


# Create password hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Convert normal password into secure hash
def hash_password(password: str):

    return pwd_context.hash(password)


# Verify entered password
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
)
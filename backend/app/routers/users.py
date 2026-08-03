from fastapi import APIRouter, Depends

from app.security.permissions import check_admin


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)



# Temporary logged-in user
# Later replace with JWT authentication

class FakeUser:

    def __init__(self):

        self.role = "admin"



def get_current_user():

    return FakeUser()



# ==========================
# Admin Only API
# ==========================

@router.delete("/{user_id}")
def delete_user(

    user_id:int,

    current_user = Depends(get_current_user)

):


    # Check admin permission

    check_admin(current_user)



    return {

        "message":
        f"User {user_id} deleted successfully"

    }
from fastapi import HTTPException


# Check Admin Role
def check_admin(user):

    if user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return user



# Check Support Agent Role
def check_support_agent(user):

    if user.role not in ["support_agent", "admin"]:

        raise HTTPException(
            status_code=403,
            detail="Support agent access required"
        )

    return user



# Check Customer Role
def check_customer(user):

    if user.role != "customer":

        raise HTTPException(
            status_code=403,
            detail="Customer access required"
        )

    return user
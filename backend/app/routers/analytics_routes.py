from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import Ticket


router = APIRouter(

    prefix="/analytics",

    tags=["Analytics"]

)


@router.get("/overview")
def analytics(

    db: Session = Depends(get_db)

):


    # Count all tickets
    total = db.query(
        Ticket
    ).count()


    # Count open tickets
    open_tickets = db.query(
        Ticket
    ).filter(

        Ticket.status == "Open"

    ).count()


    # Count high-priority tickets
    high_priority = db.query(
        Ticket
    ).filter(

        Ticket.priority == "High"

    ).count()


    return {

        "total_tickets": total,

        "open_tickets": open_tickets,

        "high_priority_tickets":
            high_priority

    }
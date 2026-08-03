from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket
from app.schemas import TicketCreate, TicketResponse
from app.services.ml_service import predict_ticket
# Create Router
router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)

@router.post(
    "/",
    response_model=TicketResponse
)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    # Combine title and description
    text = (
        ticket.title
        + " "
        + ticket.description
    )


    # Get AI predictions
    prediction = predict_ticket(text)


    # Create ticket with AI predictions
    new_ticket = Ticket(

        title=ticket.title,

        description=ticket.description,

        category=prediction["category"],

        priority=prediction["priority"],

        sentiment=prediction["sentiment"]

    )


    db.add(new_ticket)

    db.commit()

    db.refresh(new_ticket)

    return new_ticket

# ==========================================
# Get Ticket By ID
# ==========================================
@router.get(
    "/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    # Find ticket
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    # Check ticket exists
    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


# ==========================================
# Update Ticket Status
# ==========================================
@router.put("/{ticket_id}/status")
def update_status(
    ticket_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    # Find ticket
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    # Check ticket exists
    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    # Update status
    ticket.status = status

    # Save changes
    db.commit()
    db.refresh(ticket)

    return {
        "message": "Ticket status updated successfully",
        "ticket": ticket
    }


# ==========================================
# Delete Ticket
# ==========================================
@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    # Find ticket
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id
    ).first()

    # Check ticket exists
    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    # Delete ticket
    db.delete(ticket)

    # Save changes
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }


# ==========================================
# Get All Tickets
# ==========================================
@router.get("/", response_model=list[TicketResponse])
def get_all_tickets(
    db: Session = Depends(get_db)
):

    tickets = db.query(Ticket).all()

    return tickets

@router.get("/search/")
def search_tickets(

    keyword: str,

    db: Session = Depends(get_db)

):


    tickets = db.query(

        Ticket

    ).filter(

        Ticket.title.ilike(
            f"%{keyword}%"
        )

    ).all()


    return tickets
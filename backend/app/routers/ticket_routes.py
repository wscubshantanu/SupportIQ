# ==========================================
# SupportIQ - Ticket Router
# ==========================================

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket, User

from app.schemas import (
    TicketCreate,
    TicketResponse,
    TicketStatusUpdate
)

from app.security import (
    get_current_user,
    require_support_agent
)

from app.services.ml_service import predict_ticket


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)


# ==========================================
# CREATE TICKET
# ==========================================

@router.post(
    "/",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED
)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("")
    print("==========================================")
    print("🔥 CREATE TICKET")
    print("==========================================")

    print("User:", current_user.email)
    print("User ID:", current_user.id)
    print("User role:", current_user.role)
    print("Title:", ticket_data.title)
    print("Description:", ticket_data.description)

    print("==========================================")


    # ==========================================
    # AI PREDICTION
    # ==========================================

    try:

        prediction = predict_ticket(
            ticket_data.title,
            ticket_data.description
        )

        print("AI Prediction:", prediction)

    except Exception as error:

        print(
            "❌ AI PREDICTION ERROR:",
            error
        )

        prediction = {
            "priority": "Medium",
            "category": "General",
            "sentiment": "Neutral"
        }


    # ==========================================
    # AI VALUES
    # ==========================================

    priority = prediction.get(
        "priority",
        "Medium"
    )

    category = prediction.get(
        "category",
        "General"
    )

    sentiment = prediction.get(
        "sentiment",
        "Neutral"
    )


    print("Final Priority:", priority)
    print("AI Category:", category)
    print("AI Sentiment:", sentiment)


    # ==========================================
    # CREATE DATABASE TICKET
    # ==========================================

    new_ticket = Ticket(

        title=ticket_data.title,

        description=ticket_data.description,

        priority=priority,

        category=category,

        sentiment=sentiment,

        status="Open",

        created_by=current_user.id
    )


    # ==========================================
    # SAVE
    # ==========================================

    try:

        db.add(new_ticket)

        db.commit()

        db.refresh(new_ticket)

    except Exception as error:

        db.rollback()

        print(
            "❌ DATABASE ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create ticket"
        )


    # ==========================================
    # SUCCESS
    # ==========================================

    print("")
    print("==========================================")
    print("✅ TICKET CREATED")
    print("==========================================")

    print("Ticket ID:", new_ticket.id)
    print("Title:", new_ticket.title)
    print("Status:", new_ticket.status)
    print("Priority:", new_ticket.priority)
    print("Category:", new_ticket.category)
    print("Sentiment:", new_ticket.sentiment)
    print("Created By:", new_ticket.created_by)

    print("==========================================")


    return new_ticket


# ==========================================
# GET ALL TICKETS
# ==========================================

@router.get(
    "/",
    response_model=list[TicketResponse]
)
def get_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("")
    print("==========================================")
    print("🔥 GET TICKETS")
    print("==========================================")

    print("User:", current_user.email)
    print("Role:", current_user.role)

    print("==========================================")


    # ==========================================
    # ADMIN / SUPPORT AGENT
    # ==========================================

    if current_user.role in [
        "admin",
        "support_agent"
    ]:

        tickets = (
            db.query(Ticket)
            .order_by(
                Ticket.id.desc()
            )
            .all()
        )


    # ==========================================
    # CUSTOMER
    # ==========================================

    else:

        tickets = (
            db.query(Ticket)
            .filter(
                Ticket.created_by == current_user.id
            )
            .order_by(
                Ticket.id.desc()
            )
            .all()
        )


    print(
        "Tickets returned:",
        len(tickets)
    )


    return tickets


# ==========================================
# AI TICKET INSIGHTS
# ==========================================

@router.get(
    "/{ticket_id}/insights"
)
def get_ticket_insights(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("")
    print("==========================================")
    print("🔥 AI TICKET INSIGHTS")
    print("==========================================")

    print("Ticket ID:", ticket_id)
    print("User:", current_user.email)
    print("Role:", current_user.role)

    print("==========================================")


    # ==========================================
    # FIND TICKET
    # ==========================================

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )


    if ticket is None:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    # ==========================================
    # CUSTOMER ACCESS CONTROL
    # ==========================================

    if (
        current_user.role not in [
            "admin",
            "support_agent"
        ]
        and ticket.created_by != current_user.id
    ):

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this ticket"
        )


    # ==========================================
    # PRIORITY RECOMMENDATION
    # ==========================================

    if ticket.priority == "Critical":

        recommendation = (
            "Immediate attention required. "
            "Assign this ticket to a support agent "
            "as soon as possible."
        )

    elif ticket.priority == "High":

        recommendation = (
            "Prioritize this ticket for quick "
            "resolution."
        )

    elif ticket.priority == "Medium":

        recommendation = (
            "Handle this ticket within the "
            "normal support workflow."
        )

    else:

        recommendation = (
            "This ticket can be handled during "
            "the normal support queue."
        )


    # ==========================================
    # SENTIMENT RECOMMENDATION
    # ==========================================

    if ticket.sentiment == "Negative":

        sentiment_action = (
            "Customer sentiment is negative. "
            "Use empathetic communication and "
            "provide a clear resolution."
        )

    elif ticket.sentiment == "Positive":

        sentiment_action = (
            "Customer sentiment is positive. "
            "Maintain the current communication quality."
        )

    else:

        sentiment_action = (
            "Customer sentiment is neutral. "
            "Provide a clear and professional response."
        )


    # ==========================================
    # CATEGORY RECOMMENDATION
    # ==========================================

    category = ticket.category or "General"

    category_actions = {

        "Technical": (
            "Investigate the technical issue, "
            "check logs and reproduce the problem "
            "if possible."
        ),

        "Account": (
            "Verify the customer's account details "
            "and authentication information."
        ),

        "Billing": (
            "Check billing records, transactions "
            "and payment information."
        ),

        "General": (
            "Review the customer's request and "
            "provide the appropriate support."
        )
    }


    category_action = category_actions.get(
        category,
        (
            "Review the ticket details and "
            "provide the appropriate support."
        )
    )


    # ==========================================
    # AI SUMMARY
    # ==========================================

    summary = (
        f"This is a {ticket.priority or 'Medium'} "
        f"priority {category} support ticket "
        f"with {ticket.sentiment or 'Neutral'} "
        f"customer sentiment."
    )


    # ==========================================
    # RESULT
    # ==========================================

    insights = {

        "ticket_id": ticket.id,

        "title": ticket.title,

        "category": category,

        "priority": ticket.priority,

        "sentiment": ticket.sentiment,

        "status": ticket.status,

        "summary": summary,

        "recommendation": recommendation,

        "sentiment_action": sentiment_action,

        "category_action": category_action
    }


    print("")
    print("==========================================")
    print("✅ AI INSIGHTS GENERATED")
    print("==========================================")

    print("Ticket:", ticket.id)
    print("Category:", category)
    print("Priority:", ticket.priority)
    print("Sentiment:", ticket.sentiment)
    print("Status:", ticket.status)

    print("==========================================")


    return insights


# ==========================================
# GET SINGLE TICKET
# ==========================================

@router.get(
    "/{ticket_id}",
    response_model=TicketResponse
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )


    if ticket is None:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    # ==========================================
    # CUSTOMER ACCESS CONTROL
    # ==========================================

    if (
        current_user.role not in [
            "admin",
            "support_agent"
        ]
        and ticket.created_by != current_user.id
    ):

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this ticket"
        )


    return ticket


# ==========================================
# UPDATE TICKET STATUS
# ==========================================

@router.put(
    "/{ticket_id}/status",
    response_model=TicketResponse
)
def update_ticket_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_support_agent
    )
):

    print("")
    print("==========================================")
    print("🔥 UPDATE TICKET STATUS")
    print("==========================================")

    print("Ticket ID:", ticket_id)

    print(
        "Requested status:",
        status_data.status
    )

    print(
        "User:",
        current_user.email
    )

    print(
        "Role:",
        current_user.role
    )

    print("==========================================")


    # ==========================================
    # VALID STATUSES
    # ==========================================

    allowed_statuses = [
        "Open",
        "In Progress",
        "Resolved",
        "Closed"
    ]


    if status_data.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Allowed values: "
                "Open, In Progress, Resolved, Closed"
            )
        )


    # ==========================================
    # FIND TICKET
    # ==========================================

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )


    if ticket is None:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    # ==========================================
    # UPDATE STATUS
    # ==========================================

    ticket.status = status_data.status


    try:

        db.commit()

        db.refresh(ticket)

    except Exception as error:

        db.rollback()

        print(
            "❌ STATUS UPDATE DATABASE ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update ticket status"
        )


    # ==========================================
    # SUCCESS
    # ==========================================

    print("")
    print("==========================================")
    print("✅ STATUS UPDATED SUCCESSFULLY")
    print("==========================================")

    print("Ticket ID:", ticket.id)
    print("New status:", ticket.status)

    print("==========================================")


    return ticket


# ==========================================
# DELETE TICKET
# ==========================================

@router.delete(
    "/{ticket_id}"
)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_support_agent
    )
):

    print("")
    print("==========================================")
    print("🔥 DELETE TICKET")
    print("==========================================")

    print("Ticket ID:", ticket_id)
    print("User:", current_user.email)
    print("Role:", current_user.role)

    print("==========================================")


    # ==========================================
    # FIND TICKET
    # ==========================================

    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id
        )
        .first()
    )


    if ticket is None:

        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )


    # ==========================================
    # DELETE
    # ==========================================

    try:

        db.delete(ticket)

        db.commit()

    except Exception as error:

        db.rollback()

        print(
            "❌ DELETE ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete ticket"
        )


    print(
        f"✅ Ticket {ticket_id} deleted"
    )


    return {
        "message": "Ticket deleted successfully",
        "ticket_id": ticket_id
    }
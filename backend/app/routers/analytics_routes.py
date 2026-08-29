# ==========================================
# SupportIQ - Analytics Router
# ==========================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Ticket, User
from app.security import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ==========================================
# Analytics Overview
# ==========================================

@router.get("/overview")
def analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("\n==========================================")
    print("🔥 ANALYTICS ENDPOINT")
    print("Authenticated user:", current_user.email)
    print("Role:", current_user.role)
    print("==========================================")

    # ==========================================
    # TOTAL TICKETS
    # ==========================================

    total_tickets = (
        db.query(Ticket)
        .count()
    )

    # ==========================================
    # STATUS
    # ==========================================

    open_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.status == "Open"
        )
        .count()
    )

    in_progress_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.status == "In Progress"
        )
        .count()
    )

    resolved_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.status == "Resolved"
        )
        .count()
    )

    closed_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.status == "Closed"
        )
        .count()
    )

    # ==========================================
    # PRIORITY
    # ==========================================

    critical_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.priority == "Critical"
        )
        .count()
    )

    high_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.priority == "High"
        )
        .count()
    )

    medium_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.priority == "Medium"
        )
        .count()
    )

    low_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.priority == "Low"
        )
        .count()
    )

    # ==========================================
    # CATEGORY
    # ==========================================

    category_rows = (
        db.query(
            Ticket.category,
            func.count(Ticket.id)
        )
        .group_by(Ticket.category)
        .all()
    )

    category_data = {}

    for category, count in category_rows:

        category_name = (
            category
            if category
            else "Unknown"
        )

        category_data[category_name] = count

    # ==========================================
    # SENTIMENT
    # ==========================================

    sentiment_rows = (
        db.query(
            Ticket.sentiment,
            func.count(Ticket.id)
        )
        .group_by(Ticket.sentiment)
        .all()
    )

    sentiment_data = {}

    for sentiment, count in sentiment_rows:

        sentiment_name = (
            sentiment
            if sentiment
            else "Unknown"
        )

        sentiment_data[sentiment_name] = count

    # ==========================================
    # RESULT
    # ==========================================

    result = {

        "total_tickets": total_tickets,

        "status": {

            "open": open_tickets,

            "in_progress": in_progress_tickets,

            "resolved": resolved_tickets,

            "closed": closed_tickets

        },

        "priority": {

            "critical": critical_tickets,

            "high": high_tickets,

            "medium": medium_tickets,

            "low": low_tickets

        },

        "category": category_data,

        "sentiment": sentiment_data

    }

    # ==========================================
    # DEBUG
    # ==========================================

    print("Analytics:", result)

    print("==========================================")
    print("🔥 ANALYTICS SUCCESS")
    print("==========================================\n")

    return result
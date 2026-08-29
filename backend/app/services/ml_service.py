# ==========================================
# SupportIQ - ML Service
# ==========================================

import joblib
from pathlib import Path


# ==========================================
# PROJECT PATHS
# ==========================================

# ml_service.py:
# backend/app/services/ml_service.py
#
# parents[0] = services
# parents[1] = app
# parents[2] = backend
# parents[3] = SupportIQ

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_DIR = BASE_DIR / "ml" / "models"


# ==========================================
# MODEL PATHS
# ==========================================

CATEGORY_MODEL_PATH = MODEL_DIR / "category_model.pkl"
PRIORITY_MODEL_PATH = MODEL_DIR / "priority_model.pkl"
SENTIMENT_MODEL_PATH = MODEL_DIR / "sentiment_model.pkl"


# ==========================================
# VERIFY MODEL FILES
# ==========================================

if not CATEGORY_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Category model not found: {CATEGORY_MODEL_PATH}"
    )

if not PRIORITY_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Priority model not found: {PRIORITY_MODEL_PATH}"
    )

if not SENTIMENT_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Sentiment model not found: {SENTIMENT_MODEL_PATH}"
    )


# ==========================================
# LOAD MODELS
# ==========================================

category_model = joblib.load(
    CATEGORY_MODEL_PATH
)

priority_model = joblib.load(
    PRIORITY_MODEL_PATH
)

sentiment_model = joblib.load(
    SENTIMENT_MODEL_PATH
)


# ==========================================
# PREDICT TICKET
# ==========================================

def predict_ticket(title, description):

    # Combine title and description
    text = f"{title}. {description}"

    # AI predictions
    category = category_model.predict(
        [text]
    )[0]

    priority = priority_model.predict(
        [text]
    )[0]

    sentiment = sentiment_model.predict(
        [text]
    )[0]

    return {
        "category": str(category),
        "priority": str(priority),
        "sentiment": str(sentiment)
    }
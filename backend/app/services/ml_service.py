# ==========================================
# SupportIQ - ML Service
# ==========================================

import os
from pathlib import Path
import joblib

# ==========================================
# MODEL DIRECTORY RESOLUTION
# ==========================================

def find_model_dir() -> Path:
    env_path = os.getenv("ML_MODELS_DIR")
    if env_path and Path(env_path).exists():
        return Path(env_path)

    current_file = Path(__file__).resolve()
    candidates = [
        current_file.parents[3] / "ml" / "models" if len(current_file.parents) > 3 else None,
        current_file.parents[2] / "ml" / "models" if len(current_file.parents) > 2 else None,
        current_file.parents[1] / "ml" / "models" if len(current_file.parents) > 1 else None,
        Path.cwd() / "ml" / "models",
        Path.cwd().parent / "ml" / "models",
    ]

    for candidate in candidates:
        if candidate and candidate.exists():
            return candidate

    # Default fallback path
    return current_file.parents[3] / "ml" / "models" if len(current_file.parents) > 3 else Path.cwd() / "ml" / "models"

MODEL_DIR = find_model_dir()

CATEGORY_MODEL_PATH = MODEL_DIR / "category_model.pkl"
PRIORITY_MODEL_PATH = MODEL_DIR / "priority_model.pkl"
SENTIMENT_MODEL_PATH = MODEL_DIR / "sentiment_model.pkl"

# Load models safely
category_model = None
priority_model = None
sentiment_model = None

try:
    if CATEGORY_MODEL_PATH.exists():
        category_model = joblib.load(CATEGORY_MODEL_PATH)
    if PRIORITY_MODEL_PATH.exists():
        priority_model = joblib.load(PRIORITY_MODEL_PATH)
    if SENTIMENT_MODEL_PATH.exists():
        sentiment_model = joblib.load(SENTIMENT_MODEL_PATH)
    print(f"[ML Service] Models loaded successfully from {MODEL_DIR}")
except Exception as err:
    print(f"[ML Service] Warning: Failed to load trained models from {MODEL_DIR}: {err}. Using intelligent heuristic fallback.")


# ==========================================
# PREDICT TICKET
# ==========================================

def _heuristic_predict(text: str):
    lower = text.lower()

    # Category heuristic
    if any(w in lower for w in ["login", "password", "account", "profile", "signup", "auth", "otp"]):
        category = "Account"
    elif any(w in lower for w in ["bill", "charge", "payment", "refund", "invoice", "credit", "subscription", "price", "cost"]):
        category = "Billing"
    elif any(w in lower for w in ["bug", "error", "crash", "500", "404", "api", "failed", "broken", "glitch", "timeout", "slow"]):
        category = "Technical"
    else:
        category = "General"

    # Priority heuristic
    if any(w in lower for w in ["urgent", "immediately", "asap", "critical", "emergency", "production down", "outage", "security"]):
        priority = "Critical"
    elif any(w in lower for w in ["cannot", "not working", "blocked", "failed", "error", "high", "broken"]):
        priority = "High"
    elif any(w in lower for w in ["help", "question", "slow", "issue", "problem"]):
        priority = "Medium"
    else:
        priority = "Low"

    # Sentiment heuristic
    if any(w in lower for w in ["angry", "terrible", "worst", "unacceptable", "furious", "hate", "frustrated", "horrible", "cannot login"]):
        sentiment = "Negative"
    elif any(w in lower for w in ["thank", "great", "awesome", "love", "good", "appreciate", "helpful", "resolved"]):
        sentiment = "Positive"
    else:
        sentiment = "Neutral"

    return {"category": category, "priority": priority, "sentiment": sentiment}


def predict_ticket(title: str, description: str) -> dict:
    text = f"{title}. {description}"

    try:
        if category_model and priority_model and sentiment_model:
            category = str(category_model.predict([text])[0])
            priority = str(priority_model.predict([text])[0])
            sentiment = str(sentiment_model.predict([text])[0])
            return {
                "category": category,
                "priority": priority,
                "sentiment": sentiment
            }
    except Exception as error:
        print(f"[ML Service] Model inference error: {error}. Falling back to heuristics.")

    return _heuristic_predict(text)

from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "ml" / "models"

category_model = joblib.load(MODEL_DIR / "category_model.pkl")
priority_model = joblib.load(MODEL_DIR / "priority_model.pkl")
sentiment_model = joblib.load(MODEL_DIR / "sentiment_model.pkl")

text = "I cannot login to my account and need help urgently"

print("Category:", category_model.predict([text])[0])
print("Priority:", priority_model.predict([text])[0])
print("Sentiment:", sentiment_model.predict([text])[0])
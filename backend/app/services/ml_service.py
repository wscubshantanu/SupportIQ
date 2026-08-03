import joblib


# Load category model
category_model = joblib.load(
    "ml/models/category_model.pkl"
)


# Load priority model
priority_model = joblib.load(
    "ml/models/priority_model.pkl"
)


# Load sentiment model
sentiment_model = joblib.load(
    "ml/models/sentiment_model.pkl"
)


# Predict ticket information
def predict_ticket(text):

    # Predict category
    category = category_model.predict(
        [text]
    )[0]

    # Predict priority
    priority = priority_model.predict(
        [text]
    )[0]

    # Predict sentiment
    sentiment = sentiment_model.predict(
        [text]
    )[0]

    return {

        "category": category,

        "priority": priority,

        "sentiment": sentiment

    }
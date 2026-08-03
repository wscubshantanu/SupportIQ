import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.pipeline import Pipeline


# Load data
df = pd.read_csv(
    "dataset/tickets.csv"
)


# Input
X = df["text"]


# Sentiment target
y = df["sentiment"]


# Create pipeline
model = Pipeline([

    (
        "tfidf",
        TfidfVectorizer(
            stop_words="english"
        )
    ),

    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )

])


# Train model
model.fit(
    X,
    y
)


# Save model
joblib.dump(
    model,
    "models/sentiment_model.pkl"
)


print(
    "Sentiment model trained successfully"
)
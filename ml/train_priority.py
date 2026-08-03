import pandas as pd
import joblib

from sklearn.model_selection import train_test_split

from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.linear_model import LogisticRegression

from sklearn.pipeline import Pipeline


# Load dataset
df = pd.read_csv(
    "dataset/tickets.csv"
)


# Input
X = df["text"]


# Priority target
y = df["priority"]


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


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


# Train
model.fit(
    X_train,
    y_train
)


# Save
joblib.dump(
    model,
    "models/priority_model.pkl"
)


print(
    "Priority model trained successfully"
)
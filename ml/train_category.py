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


# Input text
X = df["text"]


# Target category
y = df["category"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create ML pipeline
model = Pipeline([

    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
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
    X_train,
    y_train
)


# Test model
accuracy = model.score(
    X_test,
    y_test
)


print(
    f"Model Accuracy: {accuracy}"
)


# Save model
joblib.dump(
    model,
    "models/category_model.pkl"
)
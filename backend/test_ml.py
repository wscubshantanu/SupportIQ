import joblib

category_model = joblib.load(
    r"C:\Users\shantanu\OneDrive\Desktop\SupportIQ\ml\models\category_model.pkl"
)

priority_model = joblib.load(
    r"C:\Users\shantanu\OneDrive\Desktop\SupportIQ\ml\models\priority_model.pkl"
)

sentiment_model = joblib.load(
    r"C:\Users\shantanu\OneDrive\Desktop\SupportIQ\ml\models\sentiment_model.pkl"
)

text = "I cannot login to my account and need help urgently"

print("Category:", category_model.predict([text])[0])
print("Priority:", priority_model.predict([text])[0])
print("Sentiment:", sentiment_model.predict([text])[0])
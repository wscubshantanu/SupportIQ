# SupportIQ

AI-Powered Customer Support Ticket Intelligence Platform.

## Features

- User authentication
- JWT security
- Role-based access control
- Customer support tickets
- AI ticket classification
- Priority prediction
- Sentiment analysis
- Similar ticket search
- Suggested responses
- Analytics dashboard

## Technology Stack

- React
- FastAPI
- PostgreSQL
- Scikit-learn
- NLP
- Docker

## AI Pipeline

Customer Ticket
↓
Text Preprocessing
↓
TF-IDF Vectorization
↓
Machine Learning Model
↓
Category + Priority + Sentiment

## How to Run

### Backend

```bash
cd backend
uvicorn app.main:app --reload
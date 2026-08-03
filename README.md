# SupportIQ

## AI-Powered Customer Support Ticket Intelligence Platform

SupportIQ is a full-stack AI-powered customer support ticket management system. It helps organizations manage customer support tickets efficiently using Artificial Intelligence.

## Features

- User Authentication (JWT)
- Role-Based Access Control (Customer, Support Agent, Admin)
- Ticket Management
- AI Ticket Classification
- Priority Prediction
- Sentiment Analysis
- Analytics Dashboard
- Docker Support

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL

### AI/ML
- Python
- Scikit-learn
- NLP

## Project Structure

```text
SupportIQ/
│
├── backend/
├── frontend/
├── ml/
├── docker-compose.yml
└── README.md
```

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Author

Shantanu Kalhapure
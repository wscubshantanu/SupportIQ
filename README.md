# 🚀 SupportIQ – AI-Powered Customer Support Ticket Intelligence Platform

SupportIQ is a full-stack AI-powered customer support ticket management platform designed to help organizations manage, analyze, prioritize, and resolve customer support requests efficiently.

The platform combines a modern web application with a FastAPI backend, PostgreSQL database, JWT authentication, and Machine Learning models to automatically analyze support tickets.

---

## ✨ Features

### 🔐 User Authentication

* User registration and login
* JWT-based authentication
* Protected application routes
* Role-based access control
* Secure API access

### 🎫 Ticket Management

* Create customer support tickets
* View all tickets
* View detailed ticket information
* Update ticket status
* Delete tickets
* Search tickets
* Filter tickets by status
* Filter tickets by priority

### 🤖 AI-Powered Ticket Intelligence

SupportIQ uses Machine Learning to automatically analyze customer support tickets.

The AI system predicts:

* **Ticket Category**
* **Ticket Priority**
* **Customer Sentiment**

Example:

> Customer message: "I cannot login to my account and need help urgently."

AI analysis:

* Category: Account
* Priority: High
* Sentiment: Negative

### 📊 Analytics Dashboard

The dashboard provides insights into:

* Total tickets
* Open tickets
* Tickets in progress
* Resolved tickets
* Closed tickets
* Ticket categories
* Priority distribution
* Customer sentiment

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS / Tailwind-based UI styling

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Uvicorn

### Database

* PostgreSQL

### Machine Learning

* Scikit-learn
* TF-IDF Vectorization
* Logistic Regression
* Joblib

---

## 🏗️ Project Architecture

```text
SupportIQ/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth_routes.py
│   │   │   ├── ticket_routes.py
│   │   │   └── analytics_routes.py
│   │   │
│   │   ├── services/
│   │   │   └── ml_service.py
│   │   │
│   │   ├── security/
│   │   │
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── test_ml.py
│
├── frontend-ui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   └── models/
│       ├── category_model.pkl
│       ├── priority_model.pkl
│       └── sentiment_model.pkl
│
└── README.md
```

---

## ⚙️ Installation and Setup

### 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SupportIQ
```

---

## 🐍 Backend Setup

### Create and Activate Virtual Environment

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Use `.env.example` as a reference:

```bash
copy .env.example .env
```

Update the database URL and JWT secret.

Example:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/supportiq
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Start the Backend

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend-ui
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

---

## 🤖 Machine Learning Models

SupportIQ uses trained Machine Learning models stored in:

```text
ml/models/
```

The backend loads the following models:

* `category_model.pkl`
* `priority_model.pkl`
* `sentiment_model.pkl`

The models analyze ticket text and generate predictions used by the ticket intelligence system.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register a new user         |
| POST   | `/auth/login`    | Login and receive JWT token |

### Tickets

| Method | Endpoint                      | Description          |
| ------ | ----------------------------- | -------------------- |
| GET    | `/tickets/`                   | Get tickets          |
| POST   | `/tickets/`                   | Create a ticket      |
| GET    | `/tickets/{ticket_id}`        | Get ticket details   |
| PUT    | `/tickets/{ticket_id}/status` | Update ticket status |
| DELETE | `/tickets/{ticket_id}`        | Delete ticket        |

### Analytics

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/analytics/overview` | Get ticket analytics |

---

## 🔒 Security

SupportIQ implements:

* JWT authentication
* Protected frontend routes
* Authorization headers
* Environment variables for secrets
* `.env` excluded from GitHub

---

## 📸 Screenshots

Add screenshots of the following pages here:

* Login Page
* Dashboard
* Ticket Management
* Create Ticket
* Ticket Details
* Analytics Dashboard

Example:

```text
screenshots/
├── login.png
├── dashboard.png
├── tickets.png
├── ticket-details.png
└── analytics.png
```

---

## 🚀 Future Improvements

* Email notifications
* Real-time ticket updates
* AI chatbot integration
* Admin user management
* Advanced analytics and charts
* Docker containerization
* Cloud deployment
* Automated CI/CD pipeline

---

## 👨‍💻 Author

**Shantanu Kalhapure**

AI & Data Science Engineering Student

---

## ⭐ Project Purpose

SupportIQ was developed as an AI and Data Science engineering project to demonstrate practical implementation of:

* Full-stack web development
* REST API development
* Database integration
* Authentication and authorization
* Machine Learning integration
* AI-powered automation
* Production-ready project architecture

If you found this project useful, consider giving the repository a ⭐.

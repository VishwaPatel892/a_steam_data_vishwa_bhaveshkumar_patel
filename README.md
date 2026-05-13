


<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,100:1f6feb&height=120&section=header&text=SteamSphere&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>
</p>

</div>



SteamSphere is a scalable backend system built using Node.js, Express.js, and MongoDB that provides powerful APIs for analyzing and managing Steam gaming data.

The project follows industry-standard backend architecture and demonstrates:
- RESTful API Development
- MongoDB Data Modeling
- JWT Authentication
- Aggregation Pipelines
- Scalable MVC Architecture
- Advanced Querying
- Middleware Systems
- Production-Level Backend Practices

---

# 📌 Project Goals

- Build a scalable backend architecture
- Process and manage Steam dataset efficiently
- Implement optimized MongoDB queries
- Provide advanced filtering & search APIs
- Create secure authentication system
- Follow clean coding and modular architecture principles

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Backend Runtime |
| Express.js | Web Framework |
| MongoDB | NoSQL Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |
| morgan | Request Logging |
| Postman | API Testing |

---

# 📂 Folder Structure

```bash
SteamSphere/
│
├── src/
│   │
│   ├── config/            # Database & environment configurations
│   ├── controllers/       # Handles request & response logic
│   ├── services/          # Business logic layer
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── utils/             # Reusable utility functions
│   ├── validations/       # Request validation logic
│   ├── seed/              # Database seeding scripts
│   ├── docs/              # API documentation
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Core Features

## ✅ Backend Features

- RESTful API Architecture
- MVC Pattern Implementation
- MongoDB Integration
- JWT Authentication
- CRUD Operations
- Aggregation Pipelines
- Middleware Chaining
- Environment-based Configuration
- Error Handling System
- Logging System
- Modular Scalable Structure

---

# 🔐 Authentication System

Features:
- User Registration
- User Login
- Password Hashing
- JWT Token Generation
- Protected Routes
- Token Verification Middleware
- Secure Authentication Flow

---

# 📊 Steam Dataset Features

The backend is designed to manage Steam-related data including:

- Games
- Genres
- Publishers
- Developers
- Reviews
- Ratings
- Pricing
- Tags
- Platforms
- Release Information

---

# 🧱 MongoDB Features

## Database Concepts Implemented

- Collections & Documents
- Embedding vs Referencing
- Schema Validation
- Indexing
- Aggregation Framework
- Query Optimization

---

# 🔍 Advanced Query Features

Implemented advanced MongoDB querying techniques:

## Features
- Pagination
- Sorting
- Filtering
- Regex Search
- Projection
- Dynamic Query Building

## Example Query

```bash
/api/v1/games?page=1&limit=10&sort=price
```

---

# 📈 Aggregation Pipelines

SteamSphere uses MongoDB Aggregation Framework for analytics.

## Aggregation Features
- `$match`
- `$group`
- `$project`
- `$sort`
- `$lookup`
- Multi-stage pipelines

## Example Use Cases
- Most popular games
- Highest-rated publishers
- Genre analytics
- Revenue statistics
- Platform distribution

---

# 🛡️ Middleware System

Custom middleware implemented:

- Authentication Middleware
- Authorization Middleware
- Error Handler Middleware
- Logging Middleware
- Validation Middleware

---

# ⚡ Performance Optimization

Optimizations included:

- Indexed fields
- Efficient queries
- Scalable schema design
- Optimized aggregation pipelines
- Lightweight response handling

---

# 🌐 REST API Structure

## Base URL

```bash
/api/v1
```

---

# 📌 Authentication Routes

```bash
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/profile
```

---

# 🎮 Game Routes

```bash
GET    /api/v1/games
GET    /api/v1/games/:id
POST   /api/v1/games
PUT    /api/v1/games/:id
DELETE /api/v1/games/:id
```

---

# 📊 Analytics Routes

```bash
GET    /api/v1/analytics/top-games
GET    /api/v1/analytics/top-genres
GET    /api/v1/analytics/platform-stats
GET    /api/v1/analytics/revenue
```

---

# 📦 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
```

---

## 2️⃣ Move into Project Directory

```bash
cd SteamSphere
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## 5️⃣ Run Development Server

```bash
npm run dev
```

---

# 🧪 API Testing

API testing performed using Postman.

Includes:
- Authentication Testing
- CRUD API Testing
- Aggregation Testing
- Query Parameter Testing
- Protected Route Testing

---

# 📚 System Design Concepts

SteamSphere demonstrates understanding of:

## Monolithic Architecture
- Single backend service
- Centralized application structure

## Scaling Concepts
- Vertical Scaling
- Horizontal Scaling
- Load Balancing Basics
- Replication & Sharding Awareness
- Caching Fundamentals

---

# 🧹 Code Quality Practices

- Clean folder structure
- Separation of concerns
- Reusable utilities
- Service layer pattern
- Consistent API responses
- Async error handling

---

# ⭐ Good-to-Have Features Implemented

- API Response Standardization
- Request Logging
- Password Hashing
- Reusable Pagination Utility
- Dynamic Filter Builder
- Environment-based Configs
- Health Check API
- Regex Search
- Database Seeding
- JWT Expiry Handling

---

# 🚀 Future Improvements

Planned enhancements:

- Redis Caching
- Docker Support
- CI/CD Pipeline
- Unit Testing
- Swagger Documentation
- WebSockets Integration
- Microservices Migration
- Cloud Deployment

---

# 👨‍💻 Developer

## Vishwa Patel

Backend Developer | Full Stack Developer

---

# 📅 Development Timeline

## Backend Phase
**13 May 2026 – 28 May 2026**

### Goals
- Complete all APIs
- Finalize schema design
- Implement authentication
- Add aggregation pipelines
- Complete Postman documentation
- Optimize backend performance

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

<div align="center">

## ⭐ SteamSphere — Scalable Steam Data Analytics Backend ⭐

</div>

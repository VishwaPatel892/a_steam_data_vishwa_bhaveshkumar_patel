<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B1120,100:2563EB&height=220&section=header&text=SteamSphere&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=600&size=24&pause=1000&color=58A6FF&center=true&vCenter=true&width=900&lines=Enterprise+Steam+Gaming+Backend;Production+Ready+REST+API;Node.js+%7C+Express.js+%7C+MongoDB;JWT+Authentication+%7C+MongoDB+Aggregation;Scalable+MVC+Architecture"/>
</p>



<p align="center">
A Production-Ready Backend for Steam Game Management & Analytics
</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)

</p>

---

# 📖 About

SteamSphere is a modern backend application built using **Node.js**, **Express.js**, and **MongoDB**.

It provides secure REST APIs for managing Steam game data, user authentication, reviews, publishers, developers, analytics, and advanced search operations.

The project follows a clean **MVC Architecture** and demonstrates how enterprise backend systems are built using modular code, reusable business logic, secure authentication, and optimized database queries.

SteamSphere is ideal for:

- Backend Learning
- Portfolio Projects
- Gaming Platforms
- REST API Development
- MongoDB Practice
- Enterprise Backend Architecture

---

# 🎯 Project Goals

- Build a scalable backend architecture.
- Manage Steam gaming data efficiently.
- Create secure authentication APIs.
- Implement advanced MongoDB queries.
- Provide clean REST APIs.
- Follow industry-standard backend practices.

---

# ❗ Problem Statement

Modern gaming platforms generate huge amounts of data every day.

This includes:

- Games
- Users
- Reviews
- Ratings
- Publishers
- Developers
- Genres
- Platforms
- Pricing
- Analytics

Managing this information becomes difficult when applications need:

- Fast search
- Filtering
- Sorting
- Pagination
- Analytics
- Secure authentication
- High performance

Traditional CRUD applications become difficult to maintain as the application grows.

---

# 💡 Solution

SteamSphere solves these challenges by providing a scalable backend built with modern technologies.

The project uses a clean MVC architecture where every layer has its own responsibility.

SteamSphere provides:

- REST APIs
- JWT Authentication
- MongoDB Aggregation
- Modular Code Structure
- Secure Middleware
- Advanced Search
- Pagination
- Filtering
- Error Handling
- Logging

This makes the project easy to maintain, secure, and scalable.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- Password Hashing
- JWT Authentication
- Protected Routes
- Authentication Middleware

---

## 🎮 Game Management

- Add Games
- Update Games
- Delete Games
- View Games
- Search Games
- Filter Games
- Sort Games
- Pagination

---

## ⭐ Reviews

- Add Reviews
- Ratings
- Average Rating
- Top Rated Games
- Review Analytics

---

## 📊 Analytics

- Top Games
- Revenue Analytics
- Platform Statistics
- Genre Analytics
- Rating Analytics
- Review Statistics

---

## 🔍 Search Features

- Search by Name
- Filter by Genre
- Filter by Platform
- Filter by Rating
- Filter by Price
- Dynamic Queries

---

## 🛡 Security

- JWT Authentication
- Password Encryption
- Validation
- Protected APIs
- Environment Variables
- Secure Middleware

---

## ⚡ Performance

- Optimized MongoDB Queries
- Aggregation Pipelines
- Fast REST APIs
- Modular Architecture
- Clean Code

---

# 🛠️ Technology Stack

<p align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,git,github,vscode,postman,npm&theme=dark"/>

</p>

| Technology | Purpose |
|------------|---------|
| Node.js | Backend Runtime |
| Express.js | REST API Framework |
| MongoDB | NoSQL Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Joi | Request Validation |
| Postman | API Testing |
| Git | Version Control |
| GitHub | Repository Hosting |

---

# 📦 Packages Used

## Security

- jsonwebtoken
- bcryptjs
- helmet
- express-rate-limit
- cookie-parser

## Database

- mongoose

## Validation

- joi

## Performance

- compression
- cors

## Utilities

- dotenv
- morgan

---

# 🏗️ System Architecture

```text
                Client
                   │
                   ▼
              API Request
                   │
                   ▼
              Express App
                   │
                   ▼
                Routes
                   │
                   ▼
        Authentication Middleware
                   │
                   ▼
        Validation Middleware
                   │
                   ▼
             Controllers
                   │
                   ▼
               Services
          (Business Logic)
                   │
                   ▼
                Models
                   │
                   ▼
               MongoDB
                   │
                   ▼
            JSON Response
```

---

# 🔄 Request Flow

```text
Client
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Model
   │
   ▼
MongoDB
   │
   ▼
Response
```

---

# 📂 Folder Structure

```bash
SteamSphere
│
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── validations
│   ├── utils
│   ├── docs
│   ├── seed
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# 📁 Folder Description

| Folder | Description |
|----------|-------------|
| config | Database configuration |
| controllers | Request and response logic |
| services | Business logic |
| models | MongoDB schemas |
| routes | API endpoints |
| middlewares | Authentication and custom middleware |
| validations | Request validation |
| utils | Helper functions |
| docs | API documentation |
| seed | Seed data |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/SteamSphere.git
```

---

## Open Project

```bash
cd SteamSphere
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment File

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

## Run Development Server

```bash
npm run dev
```

---

# 🔑 Environment Variables

| Variable | Description |
|-----------|-------------|
| PORT | Server Port |
| MONGO_URI | MongoDB Connection URL |
| JWT_SECRET | JWT Secret Key |
| NODE_ENV | Environment |

---

# 📜 Available Scripts

| Command | Description |
|----------|-------------|
| npm install | Install packages |
| npm run dev | Start development server |
| npm start | Start production server |

---

# 🚀 Development Workflow

```text
Create Route
      │
      ▼
Add Middleware
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Model
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- Helmet Security
- API Rate Limiting
- Request Validation
- Protected Routes

---

# ⚡ Performance Features

- Fast REST APIs
- Optimized MongoDB Queries
- Aggregation Pipelines
- Pagination
- Search
- Filtering
- Sorting
- Compression
- Modular Architecture

---

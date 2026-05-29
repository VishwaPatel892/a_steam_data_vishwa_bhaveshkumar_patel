# Antigravity (Steam Data) Backend 🚀

A production-grade, highly scalable backend architecture built to serve and manage a comprehensive database of Steam games. It features robust JWT authentication, dynamic MongoDB querying, centralized error handling, and role-based access control.

## 🌟 Features

- **Advanced Authentication:** Secure JWT-based auth flow with bcryptjs password hashing.
- **Role-Based Access Control:** Protect routes and enforce `admin` or `user` privileges.
- **Dynamic Query Builder:** Powerful Mongoose integration allowing for pagination, field projection, multi-sort, and dynamic operators (`$gt`, `$lte`, `$in`, `$regex`) directly from URL parameters.
- **Global Error Handling:** Unified `ApiResponse` wrapper ensuring all errors and successes share identical JSON structures. Catches Mongoose and JWT errors automatically.
- **Security Middlewares:** Built-in protection via Helmet, CORS, and Express Rate Limiter.
- **Scalable Architecture:** Clean MVC (Model-View-Controller) structure utilizing ES6 Modules and separated service layers.

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Security:** Helmet, CORS, express-rate-limit, jsonwebtoken, bcryptjs
- **Validation:** Joi

## 📂 Folder Structure

```text
backend/
├── src/
│   ├── config/          # Environment variables and DB connection
│   ├── constants/       # Global constants (e.g., ROLES)
│   ├── controllers/     # Route logic handlers (req, res)
│   ├── database/        # Database initialization scripts
│   ├── middlewares/     # Auth, error handling, rate limiting, logging
│   ├── models/          # Mongoose schemas (Game, User, Developer, etc)
│   ├── routes/          # Express route definitions
│   ├── services/        # Core business logic and database interactions
│   ├── utils/           # Helpers (asyncHandler, QueryBuilder, apiResponse)
│   ├── validators/      # Joi validation schemas
│   ├── app.js           # Express app configuration & middleware pipeline
│   └── server.js        # Server bootstrap and entry point
├── docs/                # API and Postman Documentation
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## ⚙️ Installation & Setup

1. **Clone the repository**
2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Environment Variables:**
   Copy the example environment file and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
5. **Start the server (Development):**
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

Required variables in `.env`:
- `PORT` - Server port (e.g., 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - `development` or `production`
- `JWT_SECRET` - Secret key for signing tokens
- `JWT_EXPIRES_IN` - Token expiration duration (e.g., `30d`)
- `BCRYPT_SALT_ROUNDS` - Hashing intensity (e.g., `12`)

## 🔐 Authentication Flow

1. **Register/Login:** The client hits `/api/v1/auth/login` with credentials.
2. **Token Generation:** The server validates credentials, hashes passwords (for registration), and returns a signed JWT.
3. **Protected Requests:** The client attaches the JWT to the `Authorization` header (`Bearer <token>`).
4. **Middleware Verification:** The `protect` middleware verifies the token signature and expiration. If valid, it attaches the `User` object to `req.user` and calls `next()`.

## 🛡 Error Handling Structure

The architecture utilizes a centralized error handling strategy:
1. **`asyncHandler`:** Wraps all controllers, automatically catching rejected Promises and passing them to `next(err)`.
2. **`error.middleware.js`:** The global sink at the bottom of `app.js`. It intercepts Mongoose validation errors, duplicate key conflicts, and JWT errors, formatting them cleanly using the `ApiResponse` class before sending them to the client.

## 🗄 Database Schema Explanation

The database schemas are highly optimized for a storefront application:
- **`User` Schema:** Handles authentication details.
- **`Game` Schema:** The central entity. It uses **Referencing** for relationships (like `Developer`, `Publisher`, and `Genre`) via `ObjectId` to prevent massive data duplication. It uses **Embedding** for the `history` audit trail, since the history is strictly bounded and tied directly to the game.
- **Indexing:** The Game schema utilizes Compound Indexes and Full-Text Indexes (`name`, `tags`) to ensure lightning-fast read operations when queried by the dynamic `QueryBuilder`.

## 🚀 Deployment Steps

1. Provision a MongoDB Atlas cluster and acquire the connection URI.
2. Ensure `NODE_ENV=production` is set on your hosting provider (e.g., Heroku, Render, AWS).
3. Populate all `.env` variables in your provider's dashboard.
4. Run the production start script:
   ```bash
   npm start
   ```

---
*For detailed API Endpoints and Postman instructions, please refer to `/docs/API_DOCUMENTATION.md`*

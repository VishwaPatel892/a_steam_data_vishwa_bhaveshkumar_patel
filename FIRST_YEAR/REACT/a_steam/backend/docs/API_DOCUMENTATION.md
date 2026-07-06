# API Documentation & Postman Usage

This document outlines the available REST API endpoints for the Antigravity backend and provides formatting guidelines for creating a Postman Collection.

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/auth/register` | Register a new user account | Public |
| `POST` | `/auth/login` | Login and receive a JWT | Public |
| `GET` | `/auth/me` | Get the currently authenticated user's profile | Private |
| `PATCH` | `/auth/me` | Update profile information (name, bio, avatar) | Private |
| `PATCH` | `/auth/change-password` | Change user password | Private |
| `POST` | `/auth/logout` | Logout the current user | Private |
| `GET` | `/auth/users` | Get a list of all users | Private (Admin) |
| `PATCH` | `/auth/users/:id/status`| Toggle a user's active/inactive status | Private (Admin) |

### Game Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/games` | Get all games (Supports filtering, sorting, pagination) | Public |
| `GET` | `/games/search` | Search games by name or tag (`?q=keyword`) | Public |
| `GET` | `/games/random` | Fetch a random game | Public |
| `GET` | `/games/:appid` | Get a single game by its Steam App ID | Public |
| `GET` | `/games/:appid/summary` | Get a summarized view and revenue estimate | Public |
| `GET` | `/games/:appid/history` | Get the audit history of a game | Private (Admin) |
| `POST` | `/games` | Create a new game | Private (Admin) |
| `PUT/PATCH` | `/games/:appid` | Update game details | Private (Admin) |
| `DELETE` | `/games/:appid` | Delete a game permanently | Private (Admin) |
| `PATCH` | `/games/:appid/archive` | Soft delete / archive a game | Private (Admin) |
| `PATCH` | `/games/:appid/restore` | Restore an archived game | Private (Admin) |


---

## 🚀 Postman Collection Usage

To test these APIs effectively in Postman, follow these structural guidelines to set up your collection.

### 1. Collection Variables
Set up a collection in Postman named `Antigravity API` and define the following variables in the `Variables` tab:
- `baseUrl`: `http://localhost:5000/api/v1`
- `token`: (Leave blank initially, this will hold your JWT)

### 2. Global Authorization
In your Postman Collection's `Authorization` tab:
- **Type:** Bearer Token
- **Token:** `{{token}}`
*This ensures every request automatically attaches the JWT if it exists.*

### 3. Automated Token Extraction
To avoid copying and pasting your JWT every time you login, add the following script to the **Tests** tab of your `Login` request:

```javascript
if (pm.response.code === 200) {
    const responseData = pm.response.json();
    if (responseData.data && responseData.data.token) {
        pm.collectionVariables.set("token", responseData.data.token);
        console.log("Token automatically saved to collection variables!");
    }
}
```

### 4. Advanced Query Examples
When testing the `GET /games` endpoint, try using Postman's `Params` tab to experiment with the dynamic Query Builder:

- **Key:** `price[lte]` | **Value:** `50` (Find games $50 or less)
- **Key:** `sort` | **Value:** `-averageRating,price` (Sort by highest rating, then lowest price)
- **Key:** `fields` | **Value:** `name,price,developer` (Limit payload size)
- **Key:** `page` | **Value:** `2`
- **Key:** `limit` | **Value:** `10`

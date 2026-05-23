# Steam Games Dataset — Complete Analysis & Backend Architecture

> **Analysed by:** Antigravity AI  
> **Date:** 2026-05-23  
> **Dataset:** `src/seeds/steamData.json` (~25.7 MB · ~65,000–70,000 records)  
> **DB:** MongoDB Atlas — `steamsphere`

---

## 1. Raw JSON Structure

The dataset is a **flat JSON array** — every element is one Steam game object.  
There are **no nested arrays or nested objects** in the raw data; all multi-value
fields are packed as **semicolon-delimited strings**.

| Property | Value |
|---|---|
| File size | ~25.7 MB |
| Total records | ~65,000–70,000 games |
| Top-level type | `Array<Object>` |
| Fields per record | **10 (all present, all strings)** |

### Canonical Raw Record

```json
{
  "appid":           "3057270",
  "name":            "Seafarer's Gambit",
  "release_year":    "2024",
  "release_date":    "Jul 5, 2024",
  "genres":          "Action;Adventure;Indie;RPG;Strategy",
  "categories":      "Single-player;Family Sharing",
  "price":           "3.99",
  "recommendations": "0",
  "developer":       "Bouncy Rocket Studios",
  "publisher":       "Bouncy Rocket Studios"
}
```

---

## 2. Field-by-Field Analysis

| Field | Raw Type | Cardinality | Notes / Edge Cases |
|---|---|---|---|
| `appid` | String (numeric) | ~65 k unique | Cast to `Number`. Primary identifier. |
| `name` | String | ~65 k unique | May contain Unicode (CJK, accented chars, `&amp;`). |
| `release_year` | String (4-digit) | ~15 distinct | Redundant with `release_date`. Useful for fast year-group queries. |
| `release_date` | String | Many patterns | **4 formats**: `"Jul 5, 2024"`, `"Q4 2025"`, `"2025"`, `"To be announced"`. Must handle `null` / `Invalid Date`. |
| `genres` | `;`-delimited string | ~20 distinct tokens | Multi-value. Includes pseudo-genres: `Free To Play`, `Early Access`, `Massively Multiplayer`. |
| `categories` | `;`-delimited string | ~60+ distinct tokens | Multi-value. Steam feature flags (controller support, cloud saves, VR, etc.). |
| `price` | String (float) | Continuous | `"0.0"` = free. Range: `0.0` – `199.99`. Cast to `Number`. |
| `recommendations` | String (integer) | 0 – ~100 k+ | Proxy for Steam positive-review count. |
| `developer` | `;`-delimited string | ~50 k unique | Multi-value (e.g., `"Mado;Team malViolence"`). |
| `publisher` | `;`-delimited string | ~30 k unique | Multi-value (e.g., `"EXNOA LLC;Spike Chunsoft Co., Ltd."`). |

### Key Patterns Observed

- **Self-published games** — `developer === publisher` (majority of indie titles)
- **Free-to-play** — `price = "0.0"` AND `genres` contains `"Free To Play"`
- **Early Access** — embedded as a genre token, not a separate boolean field
- **VR games** — `categories` contains `"VR Only"` or `"Tracked Controller Support"`
- **Fuzzy dates** — `"Q4 2025"`, `"2025"` year-only; store raw string alongside parsed `Date`

---

## 3. Entity Identification

Six distinct entities are implied by the dataset and application layer:

| Entity | Source | Type |
|---|---|---|
| **Game** | Each JSON object | Core entity |
| **Genre** | `genres` field tokens | Lookup / taxonomy |
| **Developer** | `developer` field tokens | Lookup / organisation |
| **Publisher** | `publisher` field tokens | Lookup / organisation |
| **User** | Application layer | Auth / profile entity |
| **Review** | Application layer | User-generated content |

> `categories` → stored as embedded `tags: [String]` inside Game — **not** a separate collection.

---

## 4. Embedding vs. Referencing Decisions

| Candidate | Decision | Reason |
|---|---|---|
| `genres` | **Reference** (ObjectId array) | ~20 distinct values reused across 65 k games. Reverse lookup for genre-filter queries requires referencing. Enables `$lookup` in aggregations. |
| `developer` | **Reference** (ObjectId array) | ~50 k unique. Enrichable (country, website, teamSize). Multi-developer support. |
| `publisher` | **Reference** (ObjectId array) | ~30 k unique. Enrichable. Publisher stats aggregation uses `$lookup`. |
| `categories` / tags | **Embed** (string array) | ~60 flat feature-flag strings, never queried as standalone entities. Always co-read with the Game document. |
| `platforms` | **Embed** (sub-document) | Exactly 3 boolean fields, always co-read with Game. |
| `history` | **Embed** (array) | Admin-only append-only audit log. Never queried independently. |
| `Review` | **Separate collection** | User-authored, unbounded in size. Needs pagination, ownership checks, and cross-game sentiment aggregations — cannot embed. |
| `User` | **Separate collection** | Independent lifecycle: auth, roles, sessions. |

---

## 5. MongoDB Collection Architecture

### Collection 1 — `games`

```js
{
  _id:              ObjectId,
  steamAppId:       Number,            // unique, sparse — from appid
  name:             String,            // required, trimmed
  description:      String,            // enrichable
  shortDescription: String,            // max 500 chars
  headerImage:      String,            // URL
  releaseDate:      Date | null,       // parsed from release_date
  releaseDateRaw:   String,            // raw string fallback ("Q4 2025")
  releaseYear:      Number,            // integer — fast year-group queries
  developer:        [ObjectId],        // ref: Developer
  publisher:        [ObjectId],        // ref: Publisher
  genre:            [ObjectId],        // ref: Genre
  tags:             [String],          // from categories field
  platforms: {
    windows:        Boolean,
    mac:            Boolean,
    linux:          Boolean
  },
  price:            Number,            // float, min 0
  isFree:           Boolean,           // price === 0
  averageRating:    Number,            // 0–5, recomputed from Reviews
  reviewCount:      Number,            // seeded from recommendations; live-updated
  metacriticScore:  Number,            // 0–100, enrichable
  website:          String,
  isArchived:       Boolean,
  history: [{
    action:         String,            // UPDATE | ARCHIVE | RESTORE
    timestamp:      Date,
    details:        String
  }],
  createdAt:        Date,
  updatedAt:        Date
}
```

---

### Collection 2 — `genres`

```js
{
  _id:         ObjectId,
  name:        String,    // required, unique (e.g., "Action", "Free To Play")
  slug:        String,    // unique, lowercase, auto-generated (e.g., "free-to-play")
  description: String,
  createdAt:   Date,
  updatedAt:   Date
}
```

**~20 distinct genre tokens found in dataset:**  
`Action`, `Adventure`, `Casual`, `Free To Play`, `Indie`, `Massively Multiplayer`,
`Racing`, `RPG`, `Simulation`, `Sports`, `Strategy`, `Early Access`, and others.

---

### Collection 3 — `developers`

```js
{
  _id:         ObjectId,
  name:        String,    // required, unique
  country:     String,
  website:     String,
  foundedYear: Number,
  logoUrl:     String,
  teamSize:    String,    // enum: indie | small | mid | large | aaa
  createdAt:   Date,
  updatedAt:   Date
}
```

---

### Collection 4 — `publishers`

```js
{
  _id:         ObjectId,
  name:        String,    // required, unique
  country:     String,
  website:     String,
  foundedYear: Number,
  logoUrl:     String,
  createdAt:   Date,
  updatedAt:   Date
}
```

---

### Collection 5 — `reviews`

```js
{
  _id:              ObjectId,
  user:             ObjectId,   // ref: User, required
  game:             ObjectId,   // ref: Game, required
  rating:           Number,     // 1–5, required
  content:          String,     // 10–2000 chars, required
  recommended:      Boolean,
  helpfulVotes:     Number,
  playtimeAtReview: Number,     // hours
  createdAt:        Date,
  updatedAt:        Date
}
// Compound unique index: { user: 1, game: 1 } — one review per user per game
```

---

### Collection 6 — `users`

```js
{
  _id:      ObjectId,
  name:     String,    // max 60 chars
  email:    String,    // unique, lowercase
  password: String,    // bcrypt hashed, select: false
  role:     String,    // enum: user | admin
  avatar:   String,
  bio:      String,    // max 300 chars
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. Relationship Mapping

```
Game ──── [ObjectId] ──→ Genre        (Many-to-Many)
Game ──── [ObjectId] ──→ Developer    (Many-to-Many)
Game ──── [ObjectId] ──→ Publisher    (Many-to-Many)

User ──── writes ──→ Review ──── belongs to ──→ Game
         (One-to-Many)              (Many-to-One)
```

| Relationship | Cardinality | Join Strategy |
|---|---|---|
| Game ↔ Genre | Many-to-Many | `.populate()` / `$lookup` |
| Game ↔ Developer | Many-to-Many | `.populate()` / `$lookup` |
| Game ↔ Publisher | Many-to-Many | `.populate()` / `$lookup` |
| Game → Review | One-to-Many | `Review.find({ game })` |
| User → Review | One-to-Many | `Review.find({ user })` |

---

## 7. Index Strategy

### `games` collection

| Index | Fields | Type | Purpose |
|---|---|---|---|
| PK | `_id` | Default | MongoDB default |
| Unique | `steamAppId` | Unique, Sparse | Primary lookup by Steam App ID |
| Single | `name` | Ascending | Name sort, regex fallback |
| **Text** | `name`, `tags` | Full-text (weighted) | `$text` search, weighted: name×10, tags×5 |
| Single | `genre` | Multikey | Filter by genre ObjectId |
| Single | `developer` | Multikey | Filter by developer ObjectId |
| Single | `publisher` | Multikey | Filter by publisher ObjectId |
| Single | `price` | Single | Range queries (`$gte`/`$lte`) |
| Single | `isFree` | Single | Boolean filter |
| Single | `averageRating` | Descending | Top-rated sort |
| Single | `reviewCount` | Descending | Popularity sort |
| Single | `releaseDate` | Single | Date-range, newest sort |
| Single | `releaseYear` | Single | Fast year-group aggregations |
| Single | `isArchived` | Single | Exclude archived by default |
| **Compound** | `{ isArchived, releaseDate }` | Compound | "Latest active games" |
| **Compound** | `{ isArchived, price }` | Compound | Price-filter on active games |
| **Compound** | `{ genre, averageRating }` | Compound | Genre + sorted by rating |

### `reviews` collection

| Index | Fields | Type | Purpose |
|---|---|---|---|
| **Compound Unique** | `{ user, game }` | Unique | One review per user per game |
| Single | `game` | Single | All reviews for a game |
| Single | `user` | Single | All reviews by a user |
| Single | `rating` | Single | Sentiment analytics |
| Single | `recommended` | Single | Positive/negative split |

### `genres` / `developers` / `publishers` — `name` unique index on each.

---

## 8. Search Optimization Plan

### Current Implementation
```js
// Full-text index
gameSchema.index({ name: "text", tags: "text" });

// Regex fallback in searchGames()
{ $or: [{ name: { $regex: q, $options: "i" } }, { tags: { $in: [RegExp] } }] }
```

### Recommended Improvements

| # | Improvement | Impact |
|---|---|---|
| 1 | Add **weights** to text index — `name×10, tags×5` | Name matches rank above tag matches |
| 2 | Include `description` in text index — `description×1` | Broader search coverage |
| 3 | Use `$text: { $search: q }` as primary path; fall back to regex only for prefix-match | Consistency + index utilisation |
| 4 | Limit regex to anchored `^query` (leading-wildcard kills index) | Prevents full collection scans |

### Recommended Text Index Definition
```js
gameSchema.index(
  { name: "text", tags: "text", description: "text" },
  { weights: { name: 10, tags: 5, description: 1 }, name: "game_text_search" }
);
```

---

## 9. Aggregation Pipeline Catalog

| # | Name | Route | Collections Used |
|---|---|---|---|
| 1 | Top Rated Games | `GET /analytics/top-rated` | `games` |
| 2 | Genre Distribution | `GET /analytics/genre-distribution` | `games` + `$lookup genres` |
| 3 | Review Sentiment | `GET /analytics/review-sentiment` | `reviews` + `$lookup games` |
| 4 | Releases Per Year | `GET /analytics/releases-per-year` | `games` |
| 5 | Publisher Performance | `GET /analytics/publisher-stats` | `games` + `$lookup publishers` |
| 6 | Price Distribution Buckets | `GET /analytics/price-buckets` *(planned)* | `games` |
| 7 | Developer Portfolio | `GET /analytics/developer-stats` *(planned)* | `games` + `$lookup developers` |
| 8 | Revenue Estimate by Genre | `GET /analytics/genre-revenue` *(planned)* | `games` + `$lookup genres` |

### Pipeline Patterns

```js
// 1 — Top Rated
Game → $match(averageRating > 0, isArchived ≠ true)
     → $sort(averageRating: -1) → $limit(N)
     → $project(name, averageRating, reviewCount, headerImage, releaseDate)

// 2 — Genre Distribution
Game → $unwind($genre)
     → $group(_id: $genre, count: $sum(1))
     → $lookup(genres) → $unwind → $project(genreName, count) → $sort(count: -1)

// 3 — Review Sentiment
Review → $group(_id: $game, totalReviews, positive, negative, avgRating)
       → $lookup(games) → $unwind
       → $project(gameName, positiveRatio, avgRating) → $sort → $limit(50)

// 4 — Releases Per Year
Game → $match(releaseDate exists)
     → $group(_id: $year($releaseDate), count: $sum(1))
     → $sort(_id: 1) → $project(year, count)

// 5 — Publisher Stats
Game → $unwind($publisher)
     → $group(_id: $publisher, totalGames, avgRating, totalReviews)
     → $lookup(publishers) → $sort(totalGames: -1) → $limit(20)

// 6 — Price Buckets (planned)
Game → $match(isArchived ≠ true)
     → $bucket(groupBy: $price, boundaries: [0,1,5,10,20,30,60,200])

// 7 — Developer Portfolio (planned)
Game → $unwind($developer)
     → $group(_id: $developer, totalGames, avgRating, games: $push)
     → $lookup(developers) → $sort(totalGames: -1)

// 8 — Revenue Estimate by Genre (planned)
Game → $unwind($genre)
     → $group(_id: $genre, revenue: $sum($price × $reviewCount × 30))
     → $lookup(genres) → $sort(revenue: -1)
```

---

## 10. Final Backend Architecture

```
CLIENT
  │
  ▼
Express (app.js)
  ├── helmet · cors · rate-limit · cookieParser · morgan
  ├── auth.middleware (JWT protect + RBAC authorize)
  ├── validate.middleware (Joi schema validation)
  │
  ├── /api/v1/games         → game.routes    → game.controller    → game.service
  ├── /api/v1/analytics     → analytics.routes → analytics.controller → analytics.service
  ├── /api/v1/reviews       → review.routes  → review.controller  → review.service
  ├── /api/v1/auth          → auth.routes    → auth.controller    → auth.service
  └── /api/v1/users         → user.routes    → user.controller    → user.service
                                                        │
                                                        ▼
                                              Mongoose Models
                                  (Game · Genre · Developer · Publisher · Review · User)
                                                        │
                                                        ▼
                                              MongoDB Atlas
                                          (steamsphere — 6 collections)
```

### Collections Summary

| Collection | Est. Docs | Key Indexes |
|---|---|---|
| `games` | ~65 k | steamAppId(unique), name(text+single), genre, price, rating, releaseDate |
| `genres` | ~20 | name(unique), slug(unique) |
| `developers` | ~50 k | name(unique) |
| `publishers` | ~30 k | name(unique) |
| `reviews` | Dynamic | {user,game}(unique), game, rating |
| `users` | Dynamic | email(unique) |

---

## 11. Identified Gaps & Recommendations

| # | Gap | Current State | Recommendation |
|---|---|---|---|
| 1 | `releaseYear` not stored | Computed at query time via `$year($releaseDate)` | Add `releaseYear: Number` to Game schema; populate from seed |
| 2 | Fuzzy dates silently become `null` | `"Q4 2025"` → `null` in DB | Store `releaseDateRaw: String` alongside `releaseDate: Date` |
| 3 | Compound indexes missing | Only single-field indexes defined | Add `{ isArchived, releaseDate }`, `{ genre, averageRating }` |
| 4 | Text search has no weights | `{ name, tags }` equal weight | Add `weights: { name: 10, tags: 5 }` |
| 5 | `src/aggregations/` is empty | All pipelines inline in `analytics.service.js` | Extract each pipeline to `src/aggregations/*.js` |
| 6 | `reviewCount` not auto-synced | Only seeded; never updated on new Reviews | Add `post('save')` hook on Review to `$inc reviewCount` on Game |
| 7 | `averageRating` not auto-synced | Stored on Game but no recalculation trigger | Add aggregation-based recalc on Review create/update/delete |
| 8 | Empty route files | `analytics.routes.js`, `review.routes.js`, `user.routes.js` are 0 bytes | Implement all three route files |
| 9 | Duplicate validator directories | Both `src/validators/` and `src/validations/` exist | Consolidate into single `src/validators/` directory |
| 10 | `Early Access` as genre | Treated identically to `Action`, `RPG`, etc. | Consider dedicated `isEarlyAccess: Boolean` field for cleaner filtering |

---

## 12. Data Flow — Seed → API

```
steamData.json (raw flat array)
      │
      ▼
seedGames.js — batch size: 1000
      │
      ├─→ getOrCreateDocs(Genre)      → genres collection
      ├─→ getOrCreateDocs(Developer)  → developers collection
      ├─→ getOrCreateDocs(Publisher)  → publishers collection
      │
      └─→ Game.insertMany([{
            steamAppId, name, releaseDate,
            developer:  [ObjectId],
            publisher:  [ObjectId],
            genre:      [ObjectId],
            tags:       [String],     ← split from categories
            price, isFree, reviewCount
          }])  →  games collection

REST API
      ├─→ GET /games              → Game.find().populate(genre, developer, publisher)
      ├─→ GET /games/:id          → Game.findOne({ steamAppId }).populate(...)
      ├─→ GET /games/search       → Game.find({ $text: { $search: q } })
      ├─→ GET /analytics/*        → Game.aggregate([...]) / Review.aggregate([...])
      └─→ POST /reviews           → Review.create() + Game.updateOne({ $inc: { reviewCount: 1 } })
```

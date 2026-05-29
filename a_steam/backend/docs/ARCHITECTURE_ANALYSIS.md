# Steam Store Backend Architecture & Data Analysis

This document provides a senior-level architectural analysis of a robust Steam Games platform backend, detailing how to map a vast, deeply nested gaming dataset into highly performant MongoDB structures.

---

## 1. Entity & Collection Structure

Based on the structure of Steam data, the backend requires the following distinct MongoDB collections to prevent unbounded document growth while ensuring fast queries:

1. **`Users`**: Player accounts, roles, balances, and security.
2. **`Games`**: Core storefront entity.
3. **`Reviews`**: User reviews and ratings.
4. **`DLCs`**: Downloadable content tied to base games.
5. **`Achievements`**: Global unlockable items.
6. **`News`**: Updates, patch notes, and events.
7. **`Notifications`**: System and community alerts.
8. **`Taxonomies`** (Optional/Normalized): `Developers`, `Publishers`, `Genres`, `Tags`.

---

## 2. Embedding vs. Referencing Strategy (Relationships)

MongoDB allows flexible schema design. For a Steam clone, we must carefully balance read performance (embedding) vs. write performance and unbounded arrays (referencing).

| Entity Relationship | Strategy | Justification |
|---------------------|----------|---------------|
| **Game → Developers/Genres** | **Referencing** (`ObjectId`) | A single developer/genre applies to thousands of games. Updating a genre name should only happen in one place to avoid massive multi-document updates. |
| **Game → Pricing/System Reqs** | **Embedding** | System requirements and prices are strictly bounded and always queried alongside the game. They belong exclusively to that document. |
| **Game → Reviews** | **Referencing** | A game can have millions of reviews. Embedding them would breach the 16MB MongoDB document limit. Reviews must be a separate collection referencing the `GameId`. |
| **Game → DLC** | **Referencing** | A game can have hundreds of DLCs (e.g., Train Simulator). These are distinct products that can be bought separately, requiring their own collection. |
| **User → Notifications** | **Referencing** | Notifications grow infinitely over a user's lifespan. |
| **User → Achievements** | **Subset Pattern (Hybrid)** | Embed the `last 5 recent achievements` on the User document for fast profile loading, but reference the rest in an `UserAchievements` collection. |

---

## 3. Schema Recommendations

### `Game` Schema Example
- **Basic Info:** `steamAppId`, `name`, `releaseDate`, `description`
- **Embedded Nested Data:** 
  - `priceDetails`: `{ initial: Number, final: Number, discountPercent: Number }`
  - `systemReqs`: `{ min: String, recommended: String }`
  - `media`: `{ screenshots: [String], video: String }`
- **Calculated (Pre-computed) Data:** `reviewCount`, `positiveReviewPercent`
- **Soft Delete:** `isArchived: { type: Boolean, default: false }`

### `Review` Schema Example
- **Relationships:** `gameId` (Ref: Game), `userId` (Ref: User)
- **Content:** `rating` (Boolean: Thumb Up/Down), `text`, `playtimeAtReview`
- **Engagement:** `helpfulVotes`, `funnyVotes`

---

## 4. Indexing & Search Strategy

To serve the storefront rapidly to millions of users, the following indexing strategies must be applied:

- **Text Search:** Create a Compound Text Index on the `Game` collection: `gameSchema.index({ name: 'text', tags: 'text', description: 'text' })`.
- **Search Strategy:** For production, **MongoDB Atlas Search (Lucene)** is highly recommended over standard `$text` indexes for typo tolerance, fuzzy matching, and autocomplete on the search bar.
- **Filtering Indexes:** Compound indexes based on common user filters:
  - `gameSchema.index({ "priceDetails.final": 1, releaseDate: -1 })` (For "Cheap New Games")
  - `gameSchema.index({ tags: 1, positiveReviewPercent: -1 })` (For "Top Rated in Genre")

---

## 5. Pagination Strategy

1. **Offset Pagination (`skip`/`limit`):** Used for Admin Dashboards where exact page numbers matter. (e.g., `?page=4&limit=20`). *Warning: Slows down exponentially on massive collections.*
2. **Cursor-Based Pagination (`$gt` / `$lt`):** Crucial for the public Steam Storefront infinite scrolling. We query based on the last seen `_id` or `releaseDate` (e.g., `?lastSeenDate=2024-05-10`). This guarantees `O(1)` query times regardless of database size.

---

## 6. Aggregation Opportunities & Analytics

Mongoose Aggregation Pipelines (`$match`, `$group`, `$lookup`) will power the analytics engine:

1. **Top Selling by Genre:** Match games by genre, group by revenue, and sort.
2. **Developer Analytics:** `$lookup` all games for a specific developer, `$group` them to sum up total `reviewCount` and average `positiveReviewPercent`.
3. **Daily Active Reviews:** Time-series aggregation grouping reviews by `$dayOfYear` to track community engagement spikes after a patch.

**Analytics Optimization:** Complex aggregations shouldn't run on every user request. Use a cron job (e.g., `node-cron`) to run the aggregation nightly and save the result into a `PrecomputedAnalytics` collection.

---

## 7. Performance Recommendations

1. **Lean Queries:** Always use `.lean()` on storefront `GET` routes to return raw JSON. This saves significant memory by bypassing Mongoose document hydration.
2. **Field Projection:** Use the API Query Builder to return only required fields (e.g., `?fields=name,price,headerImage`) for catalog views.
3. **Caching Layer:** Place Redis in front of the MongoDB database for the `GET /api/v1/games/top-sellers` route. The top-sellers list only changes hourly, so hitting the DB thousands of times a second is an anti-pattern.
4. **Soft Deletion (`isArchived`):** Hard deleting a game breaks foreign keys across millions of reviews and user libraries. Always use an `isArchived: true` flag and exclude it via a pre-find hook: `gameSchema.pre('find', function() { this.where({ isArchived: { $ne: true } }); });`

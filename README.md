# Google Sheets i18n Server

HTTP service for serving translations stored in Google Sheets.

Designed as a lightweight alternative to traditional i18n backends with minimal infrastructure and fast setup.

---

## Problem

Typical approaches to managing translations:

* JSON files in the repository → require redeploy
* CMS solutions → introduce complexity and cost
* custom backends → require maintenance

This service uses Google Sheets as a single source of truth and exposes translations over HTTP.

---

## Solution

* store translations in Google Sheets
* fetch and cache them on the server
* serve them via a simple API

The system is stateless and requires no database.

---

## Key properties

* no persistent storage
* read-only access to Google Sheets
* in-memory cache
* deterministic transformation of tabular data into JSON

---

## Architecture

```text
                ┌────────────────────┐
                │   Google Sheets    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Sheets API client  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Cache layer      │
                │ (dedup + reuse)    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Transformation     │
                │ (rows → objects)   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │      HTTP API      │
                └────────────────────┘
```

---

## Data model

Each project corresponds to a Google Sheet.

### Table structure

| key        | en    | ru      |
| ---------- | ----- | ------- |
| home.title | Home  | Главная |
| home.cta   | Start | Начать  |

Rules:

* first column — translation key
* other columns — languages
* first row — headers

---

## Transformation

Input (rows):

```text
[
  ["key", "en", "ru"],
  ["home.title", "Home", "Главная"]
]
```

Output (structured):

```json
{
  "home": {
    "title": "Home"
  }
}
```

---

## Caching strategy

The service uses an in-memory cache with two goals:

1. avoid repeated requests to Google Sheets
2. deduplicate concurrent requests

### Behavior

* identical requests share the same in-flight Promise
* repeated requests within a short time window reuse cached data
* cache is key-based (request params)

### Trade-offs

* no persistence
* cache reset on restart
* potential stale data during TTL window

---

## API

### Get projects

```http
GET /projects
```

Returns list of configured projects.

---

### Create or update project

```http
POST /projects
Content-Type: application/json

{
  "name": "my_project",
  "value": "GOOGLE_SHEETS_ID"
}
```

---

### Get translations (flat)

```http
GET /v1/projects/:project/translations/:lang
```

Response:

```json
{
  "home.title": "Home"
}
```

---

### Get structured translations

```http
GET /langs/:lang/keys/:project?tag=master
```

Response:

```json
{
  "home": {
    "title": "Home"
  }
}
```

---

## Example usage

### Frontend (React)

```js
const loadTranslations = async () => {
  const res = await fetch('/langs/en/keys/my_project')
  return res.json()
}
```

---

### Backend (Node.js)

```js
const res = await fetch('http://localhost:7996/translate/my_project/en')
const translations = await res.json()
```

---

## Setup

### 1. Install

```bash
npm install
```

---

### 2. Configure environment

`.env`

```bash
AUTH_KEY=your_google_api_key
PORT=7996
```

---

### 3. Configure projects

`tables.txt`

```txt
my_project=GOOGLE_SHEETS_ID
```

---

### 4. Run

```bash
npm start
```

---

## Design decisions

### Why Google Sheets

* accessible for non-developers
* built-in versioning
* no need for UI development

---

### Why no database

* reduces operational complexity
* avoids data duplication
* keeps system stateless

---

### Why in-memory cache

* simplest possible solution
* sufficient for most read-heavy scenarios

---

## Limitations

* no write API
* no authentication
* cache is not distributed
* depends on Google Sheets availability

---

## Possible extensions

* Redis-based cache
* webhook-driven cache invalidation
* OpenAPI schema
* authentication layer
* CLI for syncing data

---

## Development

```bash
npm start
```

---

## License

MIT

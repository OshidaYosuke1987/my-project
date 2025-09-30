# API Documentation

This document describes the REST API endpoints available in the Kansai Dialect Accent Dictionary application.

## Base URL

```
http://localhost:3000
```

## Authentication

The API uses session-based authentication. Admin-protected routes require a valid session cookie obtained through the login endpoint.

---

## Authentication Endpoints

### POST /api/login

Authenticate as an administrator.

**Request Body:**
```json
{
  "username": "admin",
  "password": "secret"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

**Response (Error - 400):**
```json
{
  "error": "Username and password are required"
}
```

---

### POST /api/logout

Log out the current admin session.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Response (Error - 500):**
```json
{
  "error": "Could not log out"
}
```

---

### GET /api/auth/status

Check the current authentication status.

**Response (200):**
```json
{
  "isAuthenticated": true,
  "username": "admin"
}
```

or

```json
{
  "isAuthenticated": false,
  "username": null
}
```

---

## Word Management Endpoints

### GET /api/words

Retrieve all words from the dictionary.

**Authentication:** Not required

**Response (Success - 200):**
```json
[
  {
    "id": 1,
    "word": "こんにちは",
    "accent": "こん↗に↘ちは",
    "pronunciation": "こんにちわ",
    "example": "こんにちは、元気？",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "word": "ありがとう",
    "accent": "あり↗がと↘う",
    "pronunciation": "おおきに",
    "example": "ありがとう、助かったわ。",
    "created_at": "2024-01-15T10:31:00.000Z"
  }
]
```

**Response (Error - 500):**
```json
{
  "error": "Error message"
}
```

---

### GET /api/words/:word

Retrieve a specific word by its text.

**Authentication:** Not required

**URL Parameters:**
- `word` (string) - The word to search for

**Example Request:**
```
GET /api/words/こんにちは
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "word": "こんにちは",
  "accent": "こん↗に↘ちは",
  "pronunciation": "こんにちわ",
  "example": "こんにちは、元気？",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Word not found"
}
```

**Response (Error - 500):**
```json
{
  "error": "Error message"
}
```

---

### POST /api/words

Add a new word to the dictionary.

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "word": "おはよう",
  "accent": "お↗は↘よう",
  "pronunciation": "おはよう",
  "example": "おはよう、今日もええ天気やね。"
}
```

**Response (Success - 200):**
```json
{
  "id": 3,
  "word": "おはよう",
  "accent": "お↗は↘よう",
  "pronunciation": "おはよう",
  "example": "おはよう、今日もええ天気やね。"
}
```

**Response (Bad Request - 400):**
```json
{
  "error": "All fields are required"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Authentication required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Error message"
}
```

---

### PUT /api/words/:id

Update an existing word.

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (integer) - The ID of the word to update

**Request Body:**
```json
{
  "word": "こんにちは",
  "accent": "こん↗に↘ちは",
  "pronunciation": "こんにちわ",
  "example": "こんにちは、元気にしてた？"
}
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "word": "こんにちは",
  "accent": "こん↗に↘ちは",
  "pronunciation": "こんにちわ",
  "example": "こんにちは、元気にしてた？"
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Word not found"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Authentication required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Error message"
}
```

---

### DELETE /api/words/:id

Delete a word from the dictionary.

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (integer) - The ID of the word to delete

**Response (Success - 200):**
```json
{
  "message": "Word deleted successfully"
}
```

**Response (Not Found - 404):**
```json
{
  "error": "Word not found"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Authentication required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Error message"
}
```

---

## Error Handling

All endpoints follow consistent error response formats:

- **400 Bad Request**: Invalid input or missing required fields
- **401 Unauthorized**: Authentication required or invalid credentials
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

Error responses include an `error` field with a descriptive message.

---

## Session Management

- Sessions are managed using `express-session`
- Session cookie name: `connect.sid`
- Session duration: 24 hours
- Sessions are stored in memory (consider using a persistent store in production)

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production environments.

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production deployments.

---

## Example Usage with curl

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret"}' \
  -c cookies.txt
```

### Get all words
```bash
curl http://localhost:3000/api/words
```

### Add a new word (requires authentication)
```bash
curl -X POST http://localhost:3000/api/words \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "word": "おはよう",
    "accent": "お↗は↘よう",
    "pronunciation": "おはよう",
    "example": "おはよう、今日もええ天気やね。"
  }'
```

### Update a word (requires authentication)
```bash
curl -X PUT http://localhost:3000/api/words/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "word": "こんにちは",
    "accent": "こん↗に↘ちは",
    "pronunciation": "こんにちわ",
    "example": "こんにちは、元気にしてた？"
  }'
```

### Delete a word (requires authentication)
```bash
curl -X DELETE http://localhost:3000/api/words/1 \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt
```
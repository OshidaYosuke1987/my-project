# Technical Specifications

This document provides detailed technical specifications for the Kansai Dialect Accent Dictionary application.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Design](#database-design)
4. [API Specifications](#api-specifications)
5. [Frontend Architecture](#frontend-architecture)
6. [Security](#security)
7. [Performance](#performance)
8. [Infrastructure](#infrastructure)

---

## System Overview

### Purpose

A web-based dictionary application for learning and managing Kansai dialect accent patterns with administrative capabilities.

### Key Features

- Word search and display
- Accent pattern visualization
- Admin authentication
- CRUD operations for words
- Word list management with filtering

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ≥18.0.0 |
| Web Framework | Express.js | ^4.18.2 |
| Database | SQLite3 | ^5.1.6 |
| Authentication | bcryptjs | ^3.0.2 |
| Session Management | express-session | ^1.18.2 |
| Frontend | Vanilla JavaScript | ES6+ |
| Styling | CSS3 | - |

---

## Architecture

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        Client Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  index.html  │  │  script.js   │  │  style.css   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ REST API
┌────────────────────────▼─────────────────────────────────┐
│                     Application Layer                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Express.js Server                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │ │
│  │  │  Routes  │  │Middleware│  │  Authentication │  │ │
│  │  └──────────┘  └──────────┘  └─────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────┘
                         │ SQL Queries
┌────────────────────────▼─────────────────────────────────┐
│                      Data Layer                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              SQLite Database                         │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │            words table                        │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

**Search Flow:**
```
User Input → Frontend JS → GET /api/words → SQLite Query →
JSON Response → Display Result
```

**Admin Registration Flow:**
```
Admin Input → POST /api/login → Session Created →
POST /api/words → SQLite Insert → Response → Update UI
```

---

## Database Design

### Schema

**words Table:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| word | TEXT | UNIQUE, NOT NULL | The Japanese word |
| accent | TEXT | NOT NULL | Accent pattern with markers |
| pronunciation | TEXT | NOT NULL | Kansai dialect pronunciation |
| example | TEXT | NOT NULL | Example usage sentence |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**SQL Definition:**
```sql
CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL,
    accent TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    example TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Indexes

**Current:**
- Primary key index on `id` (automatic)
- Unique index on `word` (automatic)

**Recommended for Scaling:**
```sql
CREATE INDEX idx_word ON words(word);
CREATE INDEX idx_created_at ON words(created_at DESC);
```

### Data Migration

The application automatically migrates data from `dictionary.json` to SQLite on first run:

**Migration Logic:**
1. Check if words table has data
2. If empty, read `dictionary.json`
3. Insert all entries into SQLite
4. Log success/failures

---

## API Specifications

### Authentication

**Method:** Session-based with cookies

**Session Configuration:**
```javascript
{
    secret: 'kansai-dict-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,    // Set to true in production with HTTPS
        maxAge: 86400000  // 24 hours
    }
}
```

**Authentication Middleware:**
```javascript
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}
```

### Endpoint Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | /api/login | No | Authenticate admin |
| POST | /api/logout | No | End admin session |
| GET | /api/auth/status | No | Check auth status |
| GET | /api/words | No | Get all words |
| GET | /api/words/:word | No | Get specific word |
| POST | /api/words | Yes | Add new word |
| PUT | /api/words/:id | Yes | Update word |
| DELETE | /api/words/:id | Yes | Delete word |

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## Frontend Architecture

### Technology

- **Framework:** None (Vanilla JavaScript)
- **JavaScript Version:** ES6+
- **Module System:** None (single file)
- **Build Tools:** None

### State Management

**Global State Variables:**
```javascript
let dictionary = {};        // In-memory word cache
let currentWordId = null;   // Currently displayed word ID
let isAuthenticated = false; // Auth status
let allWords = [];          // Full word list for admin
```

### Key Functions

**Dictionary Management:**
- `loadDictionary()` - Fetch words from API
- `searchWord()` - Search functionality
- `displayResult()` - Display search results
- `displayNoResult()` - Show not found message

**Authentication:**
- `checkAuthStatus()` - Verify session
- `updateUIBasedOnAuth()` - Update UI for auth state
- `loginUser()` - Handle login
- `logoutUser()` - Handle logout

**Word Management:**
- `registerWord()` - Add new word
- `deleteWord()` - Remove word
- `openEditModal()` - Open edit dialog
- `saveEditedWord()` - Save changes

**Word List:**
- `loadWordList()` - Fetch and display all words
- `displayWordList()` - Render word table
- `filterWordList()` - Filter by search term
- `editWordFromList()` - Edit from list
- `deleteWordFromList()` - Delete from list

### Event Handling

**Pattern:** Event delegation and direct listeners

```javascript
// Direct listener
searchBtn.addEventListener('click', searchWord);

// Delegated listeners for dynamic content
document.querySelectorAll('.edit-word-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const wordId = this.getAttribute('data-id');
        editWordFromList(wordId);
    });
});
```

### UI Updates

**Tab System:**
- Three main tabs: Search, Registration, Admin
- State managed via CSS classes and display properties
- Tab switching clears results and updates visibility

**Modal System:**
- Edit modal for word modifications
- Click outside or close button to dismiss
- Form validation before submission

---

## Security

### Authentication Security

**Password Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10
- Hash stored in server code (should be env variable in production)

**Session Security:**
- Secret key for signing sessions
- HTTPOnly cookies (prevents XSS access)
- 24-hour session expiration
- Session cleared on logout

### SQL Injection Prevention

**Method:** Parameterized queries

**Example:**
```javascript
// ✅ Safe
db.run("INSERT INTO words (word, accent) VALUES (?, ?)",
    [word, accent], callback);

// ❌ Unsafe (never do this)
db.run(`INSERT INTO words (word, accent) VALUES ('${word}', '${accent}')`,
    callback);
```

### XSS Prevention

**Current Measures:**
- Input sanitization at database level
- HTML escaping in display (browser default)

**Recommended Additions:**
- Content Security Policy headers
- Input validation library
- Output encoding library

### CSRF Protection

**Status:** Not currently implemented

**Recommendation:** Add `csurf` middleware for production

---

## Performance

### Current Performance Characteristics

**Database:**
- SQLite: Fast for read operations
- In-process database (no network latency)
- Full table scans acceptable for small datasets

**Frontend:**
- Vanilla JS: No framework overhead
- Single-page app: No page reloads
- CSS animations: Hardware-accelerated

**API:**
- Synchronous database queries
- No caching layer
- Session stored in memory

### Performance Metrics

**Target Response Times:**
- Search: < 100ms
- Word registration: < 200ms
- Login: < 150ms
- Word list load: < 500ms (for 1000 words)

### Scalability Considerations

**Current Limits:**
- SQLite: Handles thousands of words efficiently
- Memory sessions: Limited to single server
- No horizontal scaling

**For Scaling:**
1. Add database indexes
2. Implement caching (Redis)
3. Use persistent session store
4. Add pagination for word list
5. Consider PostgreSQL for > 100k words

---

## Infrastructure

### Development Environment

```
OS: Any (macOS, Linux, Windows)
Node.js: v18+
Port: 3000
Database: SQLite file (dictionary.db)
```

### Production Recommendations

**Server Requirements:**
- CPU: 1 vCPU minimum
- RAM: 512MB minimum (1GB recommended)
- Storage: 1GB minimum
- OS: Linux (Ubuntu/Debian recommended)

**Process Management:**
```bash
# Using PM2
pm2 start server.js --name kansai-dict
pm2 startup
pm2 save
```

**Reverse Proxy (nginx):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Environment Variables:**
```bash
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-random-secret
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

### Monitoring

**Recommended Tools:**
- **PM2 Monitoring:** Built-in process monitoring
- **Logs:** Use PM2 or Winston for logging
- **Uptime:** UptimeRobot or similar
- **Analytics:** Google Analytics (optional)

---

## File Specifications

### server.js

- **Lines:** ~260
- **Size:** ~8KB
- **Dependencies:** 6 npm packages
- **Endpoints:** 8 REST API routes

### script.js

- **Lines:** ~620
- **Size:** ~20KB
- **Functions:** 25+ functions
- **Event Listeners:** 15+ listeners

### style.css

- **Lines:** ~870
- **Size:** ~17KB
- **Responsive:** Yes (mobile-first)
- **Animations:** CSS transitions and keyframes

### index.html

- **Lines:** ~185
- **Size:** ~7KB
- **Components:** 3 main tabs + modal
- **Forms:** 3 forms (search, register, login)

---

## Browser Compatibility

**Supported Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions

**Required Features:**
- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API
- Local Storage (for future features)

---

## Version Information

**Current Version:** 1.0.0

**Node.js Version:** ≥18.0.0

**Database Version:** SQLite 3

---

## Future Enhancements

### Planned Features
1. Bulk import/export
2. Word categories/tags
3. Audio pronunciation support
4. Search history
5. Favorites/bookmarks

### Technical Improvements
1. TypeScript migration
2. Automated testing suite
3. CI/CD pipeline
4. Database migrations system
5. API versioning
6. GraphQL endpoint option
7. PWA capabilities

---

## References

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Document Version:** 1.0
**Last Updated:** 2025-09-30
**Maintained By:** OshidaYosuke1987
# Development Guide

This guide is for developers who want to contribute to or modify the Kansai Dialect Accent Dictionary project.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Architecture](#project-architecture)
3. [Code Structure](#code-structure)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Contributing Guidelines](#contributing-guidelines)

---

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/OshidaYosuke1987/my-project.git
cd my-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Verify installation:**
```bash
node --version  # Should be >= 18.0.0
npm --version
```

### Development Dependencies

```json
{
  "nodemon": "^3.0.1"  // Auto-reload server during development
}
```

### Production Dependencies

```json
{
  "bcryptjs": "^3.0.2",           // Password hashing
  "cors": "^2.8.5",               // Cross-origin resource sharing
  "express": "^4.18.2",           // Web framework
  "express-session": "^1.18.2",   // Session management
  "sqlite3": "^5.1.6"             // Database
}
```

---

## Project Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │ (Frontend: HTML/CSS/JS)
└──────┬──────┘
       │ HTTP/REST API
┌──────▼──────┐
│   Express   │ (Backend: Node.js)
│   Server    │
└──────┬──────┘
       │
┌──────▼──────┐
│   SQLite    │ (Database)
│  Database   │
└─────────────┘
```

### Technology Stack

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with modern features (Grid, Flexbox, Gradients)

**Backend:**
- Node.js runtime
- Express.js web framework
- SQLite3 database
- Session-based authentication

**Security:**
- bcryptjs for password hashing
- express-session for session management
- CSRF protection (to be implemented)

---

## Code Structure

### File Organization

```
my-project/
├── server.js              # Express server & API routes
├── index.html             # Main HTML page
├── script.js              # Frontend JavaScript
├── style.css              # Styling
├── dictionary.json        # Legacy dictionary data
├── dictionary.db          # SQLite database (auto-generated)
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── README.md              # Project overview
└── docs/                  # Documentation
    ├── API_DOCUMENTATION.md
    ├── USER_GUIDE.md
    ├── DEVELOPMENT.md
    ├── TECHNICAL_SPECS.md
    └── CHANGELOG.md
```

### Backend Structure (server.js)

```javascript
// 1. Dependencies and initialization
// 2. Configuration (port, admin credentials)
// 3. Authentication middleware
// 4. Express middleware setup
// 5. Database initialization
// 6. Authentication routes
// 7. Word management routes
// 8. Static file serving
// 9. Server startup
// 10. Graceful shutdown handler
```

### Frontend Structure (script.js)

```javascript
// 1. Global state variables
// 2. Dictionary loading functions
// 3. Authentication functions
// 4. UI update functions
// 5. Search functionality
// 6. Word registration functionality
// 7. Word editing functionality
// 8. Word list management functionality
// 9. Event listeners setup
// 10. DOMContentLoaded initialization
```

---

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` which automatically restarts the server when files change.

### Running in Production Mode

```bash
npm start
```

Standard Node.js server without auto-reload.

### Making Changes

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Test locally:**
```bash
npm run dev
# Test in browser at http://localhost:3000
```

4. **Commit your changes:**
```bash
git add .
git commit -m "Description of changes"
```

5. **Push and create pull request:**
```bash
git push origin feature/your-feature-name
```

---

## Database Management

### Database Schema

**Words Table:**
```sql
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL,
    accent TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    example TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Accessing the Database

**Using SQLite CLI:**
```bash
sqlite3 dictionary.db
```

**Common queries:**
```sql
-- View all words
SELECT * FROM words;

-- Search for a word
SELECT * FROM words WHERE word = 'こんにちは';

-- Count total words
SELECT COUNT(*) FROM words;

-- View recent additions
SELECT * FROM words ORDER BY created_at DESC LIMIT 10;
```

### Database Migration

The application automatically migrates data from `dictionary.json` to SQLite on first run:

```javascript
function migrateDictionaryData() {
    // Checks if data exists
    // Reads dictionary.json
    // Inserts data into SQLite
}
```

To re-run migration:
1. Delete `dictionary.db`
2. Restart the server
3. Data will be migrated from `dictionary.json`

---

## Testing

### Manual Testing Checklist

**Search Functionality:**
- [ ] Search returns correct results
- [ ] Search handles non-existent words
- [ ] Clear button works
- [ ] Enter key triggers search

**Authentication:**
- [ ] Login with correct credentials succeeds
- [ ] Login with incorrect credentials fails
- [ ] Quick login button works
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

**Word Registration (Admin):**
- [ ] Can add new words
- [ ] Validation rejects empty fields
- [ ] Duplicate words are handled
- [ ] Clear form button works

**Word Editing (Admin):**
- [ ] Can edit from search results
- [ ] Can edit from word list
- [ ] Changes are saved correctly
- [ ] Modal can be closed without saving

**Word Deletion (Admin):**
- [ ] Can delete from search results
- [ ] Can delete from word list
- [ ] Confirmation dialog appears
- [ ] Word is removed from database

**Word List (Admin):**
- [ ] List displays all words
- [ ] Filter/search works
- [ ] Edit buttons work
- [ ] Delete buttons work

### API Testing with curl

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for curl examples.

### Future: Automated Testing

Consider implementing:
- **Unit tests**: Mocha, Jest, or similar
- **Integration tests**: Supertest for API testing
- **E2E tests**: Playwright or Cypress

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Add route in server.js:**
```javascript
app.get('/api/your-endpoint', requireAuth, (req, res) => {
    // Your logic here
});
```

2. **Add frontend function in script.js:**
```javascript
async function yourFunction() {
    const response = await fetch('/api/your-endpoint');
    const data = await response.json();
    // Handle response
}
```

3. **Update API documentation**

### Adding a New UI Component

1. **Add HTML structure in index.html**
2. **Add styling in style.css**
3. **Add functionality in script.js**
4. **Test responsiveness on mobile**

### Modifying the Database Schema

1. **Update schema in server.js**
2. **Create migration script if needed**
3. **Test with fresh database**
4. **Update documentation**

### Changing Admin Credentials

1. **Generate new password hash:**
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-new-password', 10);
console.log(hash);
```

2. **Update in server.js:**
```javascript
const ADMIN_PASSWORD_HASH = 'your-generated-hash';
```

---

## Deployment

### Production Considerations

1. **Environment Variables:**
```javascript
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'kansai-dict-secret-key-2024';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '...';
```

2. **Session Store:**
   - Current: In-memory (development only)
   - Production: Use connect-redis or connect-mongo

3. **HTTPS:**
   - Enable `secure: true` in session cookie options
   - Use reverse proxy (nginx) or SSL termination

4. **Database:**
   - SQLite is fine for small to medium deployments
   - Consider PostgreSQL/MySQL for larger deployments

5. **Process Management:**
   - Use PM2 or similar for production
   ```bash
   npm install -g pm2
   pm2 start server.js --name kansai-dict
   ```

### Deployment Platforms

**Option 1: Traditional Server (VPS)**
```bash
# On server
git clone <repository>
cd my-project
npm install --production
npm start
```

**Option 2: Heroku**
- Add `Procfile`: `web: node server.js`
- Set environment variables in Heroku dashboard
- Deploy via Git push

**Option 3: Docker**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Debugging

### Server-Side Debugging

1. **Add logging:**
```javascript
console.log('Debug:', variable);
```

2. **Use Node.js debugger:**
```bash
node --inspect server.js
# Open chrome://inspect in Chrome
```

### Client-Side Debugging

1. **Browser DevTools:**
   - Console: View logs and errors
   - Network: Inspect API calls
   - Application: View session cookies

2. **Add debugging statements:**
```javascript
console.log('Debug:', data);
console.error('Error:', error);
```

---

## Contributing Guidelines

### Code Style

**JavaScript:**
- Use `const` and `let`, avoid `var`
- Use async/await instead of callbacks
- Use meaningful variable names
- Add comments for complex logic

**CSS:**
- Use BEM-like naming conventions
- Group related styles
- Mobile-first responsive design

**Commit Messages:**
- Use present tense: "Add feature" not "Added feature"
- Reference issues: "Fix login bug (closes #123)"
- Keep first line under 50 characters
- Add detailed description if needed

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly
4. Update documentation if needed
5. Create pull request with description
6. Wait for review and address feedback

### Issue Reporting

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/Node.js version
- Error messages/screenshots

---

## Performance Optimization

### Current Performance

- Lightweight vanilla JavaScript (no framework overhead)
- Single-page application (no page reloads)
- SQLite for fast local queries
- CSS animations for smooth UI

### Future Optimizations

- Add caching for frequently accessed words
- Implement lazy loading for large word lists
- Minify/bundle JavaScript and CSS
- Add service worker for offline support
- Implement pagination for word list

---

## Security Best Practices

### Current Security Measures

- Password hashing with bcryptjs
- Session-based authentication
- Protected admin routes
- SQL injection prevention (parameterized queries)

### Recommended Additions

- CSRF protection
- Rate limiting
- Input sanitization
- XSS prevention headers
- Security headers (helmet.js)

---

## Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Code editor

---

## Getting Help

- Check existing issues on GitHub
- Read the documentation
- Ask in discussions
- Contact: OshidaYosuke1987

---

**Happy coding!**
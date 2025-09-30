# Changelog

All notable changes to the Kansai Dialect Accent Dictionary project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Audio pronunciation support
- Word categories and tags
- Bulk import/export functionality
- Search history
- User favorites/bookmarks
- TypeScript migration
- Automated testing suite

---

## [1.0.0] - 2025-09-30

### Added - Word List Management Feature
- **Word List Display**: Admin panel now includes comprehensive word list view (Issue #3)
  - Table format showing all registered words
  - Columns: word, accent, pronunciation, example, actions
  - "一覧を表示" button to load the list
  - "一覧を更新" to refresh after initial load
- **Filter/Search Capability**: Real-time filtering of word list by word text
- **Inline Edit/Delete**: Direct action buttons in each table row
  - Edit button opens modal with pre-filled data
  - Delete button with confirmation dialog
  - Auto-refresh after operations
- **Responsive Design**: Word list table adapts to mobile screens
  - Truncated examples with ellipsis
  - Scrollable table container
  - Touch-friendly buttons

### Added - Word Editing Feature
- **Edit Modal**: Modal dialog for editing existing words (Issue #2)
  - Pre-filled form fields with current values
  - All fields editable except ID
  - Save and cancel options
  - Click outside or close button to dismiss
- **Edit Access Points**:
  - From search results (when logged in as admin)
  - From word list table
- **Validation**: All fields required before saving
- **Auto-refresh**: Dictionary and word list update after successful edit

### Added - Admin Authentication System
- **Login System**: Secure admin authentication (Issue #7)
  - Username and password fields
  - bcrypt password hashing (10 salt rounds)
  - Session-based authentication with express-session
  - 24-hour session duration
- **Quick Login**: One-click login with test credentials
- **Admin Panel**: Post-login interface showing:
  - Welcome message with username
  - Status indicators
  - Logout button
  - Admin-only features
- **Session Persistence**: Auth state persists across page refreshes
- **Auth Status Endpoint**: `/api/auth/status` to check current session

### Added - Word Registration System
- **Registration Form**: Interface for adding new words (Issue #1)
  - Fields: word, accent, pronunciation, example
  - Form validation (all fields required)
  - Clear button to reset form
  - Success/error feedback
- **API Integration**: POST `/api/words` endpoint
  - Protected by authentication middleware
  - Validates all fields
  - Returns created word with ID
- **Tab Access Control**: Registration tab requires admin login

### Added - Database System
- **SQLite Migration**: Converted from JSON to SQLite database (Issue #4)
  - Automatic migration on first run
  - Preserves existing data from dictionary.json
  - Created_at timestamp for all entries
- **Database Schema**:
  - id (PRIMARY KEY, AUTOINCREMENT)
  - word (TEXT UNIQUE NOT NULL)
  - accent (TEXT NOT NULL)
  - pronunciation (TEXT NOT NULL)
  - example (TEXT NOT NULL)
  - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
- **API Endpoints**:
  - GET `/api/words` - Retrieve all words
  - GET `/api/words/:word` - Get specific word
  - POST `/api/words` - Add new word (admin)
  - PUT `/api/words/:id` - Update word (admin)
  - DELETE `/api/words/:id` - Delete word (admin)

### Added - Delete Functionality
- **Delete Button**: Remove words from database (Issue #9)
  - Visible only when admin is logged in
  - Confirmation dialog before deletion
  - Success/error feedback
- **Delete API**: DELETE `/api/words/:id` endpoint
  - Protected by authentication
  - Returns 404 if word not found
  - Returns success message on deletion

### Added - Clear Button
- **Clear Functionality**: Reset search interface (Issue #5)
  - Clears search input
  - Hides results
  - Resets UI state
  - Focus returns to input

### Added - Deployment Configuration
- **Configuration Files**: Added deployment setup
  - Production-ready server configuration
  - Environment variable support
  - Process management scripts

### Fixed
- **Admin Password Hash**: Corrected bcrypt hash for login functionality
  - Fixed hash generation
  - Verified authentication flow
  - Updated documentation

---

## [0.2.0] - Initial Development

### Added - Core Functionality
- **Search Interface**: Basic word search functionality
  - Input field for word entry
  - Search button
  - Enter key support
  - Result display with accent patterns
- **Accent Display**: Visual representation of Kansai accent
  - ↗ (red) for rising pitch
  - ↘ (blue) for falling pitch
  - Animated accent markers
- **UI Design**: Modern, responsive interface
  - Gradient color scheme
  - Tab-based navigation (Search, Register, Admin)
  - Mobile-responsive design
  - CSS animations and transitions

### Added - Data Management
- **Dictionary JSON**: Initial data storage
  - External dictionary.json file
  - Word-to-data mapping
  - Sample Kansai dialect words

---

## [0.1.0] - Project Initialization

### Added
- **Project Structure**: Initial project setup
  - index.html - Main HTML file
  - script.js - Frontend JavaScript
  - style.css - Styling
  - server.js - Express backend
  - package.json - Dependencies
- **Basic Dependencies**:
  - Express.js v4.18.2
  - Node.js requirement: ≥18.0.0
- **Version Control**: Git repository initialized
  - Initial commit
  - GitHub repository created

---

## Version History Summary

| Version | Date | Key Feature |
|---------|------|-------------|
| 1.0.0 | 2025-09-30 | Word list management, full CRUD operations |
| 0.2.0 | 2024-XX-XX | Core search and display functionality |
| 0.1.0 | 2024-XX-XX | Project initialization |

---

## Issue References

- Issue #1: Word registration interface
- Issue #2: Word editing functionality
- Issue #3: Word list display (admin)
- Issue #4: JSON to SQLite migration
- Issue #5: Clear button functionality
- Issue #7: Admin login system
- Issue #9: Delete button implementation
- Issue #10: Word editing window (duplicate of #2)

---

## Contributors

- **OshidaYosuke1987** - Project creator and maintainer
- **Claude (Anthropic)** - Development assistance and documentation

---

## Notes

### Breaking Changes
None in current version.

### Deprecations
- **dictionary.json**: Still supported but SQLite is now primary data source
  - Used for initial data migration only
  - Will remain for backward compatibility

### Security Updates
- bcrypt password hashing implemented
- Session-based authentication added
- Parameterized SQL queries prevent injection

### Performance Improvements
- SQLite offers faster queries than JSON parsing
- In-memory dictionary caching on frontend
- Single-page application design (no page reloads)

---

## Migration Guide

### From JSON-only to SQLite (v0.2.0 → v1.0.0)

No action required! The application automatically migrates data on first run:

1. Upgrade to v1.0.0
2. Start the server
3. Data automatically migrated from dictionary.json
4. SQLite database created at `dictionary.db`

### Updating from Pre-Auth to Auth System

If you have custom deployments:

1. Update `server.js` with new auth routes
2. Update `script.js` with auth functions
3. Update `index.html` with login form
4. Set admin credentials (username: admin, password: secret)
5. Consider changing default password for production

---

## Support

For issues, questions, or contributions:
- **GitHub Issues**: https://github.com/OshidaYosuke1987/my-project/issues
- **Documentation**: See `/docs` folder
- **Contact**: OshidaYosuke1987

---

**Changelog Maintained By:** OshidaYosuke1987
**Format:** [Keep a Changelog](https://keepachangelog.com/)
**Versioning:** [Semantic Versioning](https://semver.org/)
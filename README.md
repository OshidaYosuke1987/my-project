# 関西弁アクセント辞書 (Kansai Dialect Accent Dictionary)

A web-based dictionary application for learning and managing Kansai dialect accent patterns. This application allows users to search for words and view their Kansai dialect pronunciation, and provides administrative features for managing the word database.

## Features

### User Features
- **Word Search**: Search for words and view their Kansai dialect accent patterns
- **Accent Display**: Visual representation of accent patterns with up (↗) and down (↘) markers
- **Pronunciation Guide**: Shows how words are pronounced in Kansai dialect
- **Usage Examples**: Provides example sentences for each word

### Admin Features
- **Secure Login**: Admin authentication system with bcrypt password hashing
- **Word Registration**: Add new words with accent patterns, pronunciation, and examples
- **Word Editing**: Modify existing word entries
- **Word Deletion**: Remove words from the database
- **Word List Management**: View all registered words in a table format with search/filter capability

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Authentication**: Express-session with bcryptjs
- **Styling**: Custom CSS with gradient designs and responsive layout

## Prerequisites

- Node.js >= 18.0.0
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/OshidaYosuke1987/my-project.git
cd my-project
```

2. Install dependencies:
```bash
npm install
```

3. The database will be automatically created and migrated on first run.

## Usage

### Starting the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Admin Login

Default admin credentials:
- **Username**: `admin`
- **Password**: `secret`

**Important**: Change these credentials in production by updating the `ADMIN_PASSWORD_HASH` in `server.js`.

## Project Structure

```
my-project/
├── server.js           # Express server and API endpoints
├── index.html          # Main HTML file
├── script.js           # Frontend JavaScript
├── style.css           # Styling
├── dictionary.json     # Initial dictionary data (legacy)
├── dictionary.db       # SQLite database
├── package.json        # Project dependencies
└── docs/              # Documentation
```

## API Endpoints

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for detailed API documentation.

## Development

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for development guidelines and setup instructions.

## User Guide

See [USER_GUIDE.md](./docs/USER_GUIDE.md) for detailed usage instructions.

## Technical Specifications

See [TECHNICAL_SPECS.md](./docs/TECHNICAL_SPECS.md) for system architecture and technical details.

## Changelog

See [CHANGELOG.md](./docs/CHANGELOG.md) for version history and changes.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Author

OshidaYosuke1987
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials (in production, store these securely)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password: secret

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Session middleware
app.use(session({
    secret: 'kansai-dict-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Database setup
const DB_PATH = './dictionary.db';

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables and migrate data from JSON
function initializeDatabase() {
    // Create words table
    db.run(`
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT UNIQUE NOT NULL,
            accent TEXT NOT NULL,
            pronunciation TEXT NOT NULL,
            example TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Words table ready');
            migrateDictionaryData();
        }
    });
}

// Migrate data from dictionary.json to SQLite
function migrateDictionaryData() {
    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM words", (err, row) => {
        if (err) {
            console.error('Error checking data:', err);
            return;
        }
        
        if (row.count > 0) {
            console.log('Database already has data, skipping migration');
            return;
        }

        // Read dictionary.json and insert data
        if (fs.existsSync('./dictionary.json')) {
            const dictionaryData = JSON.parse(fs.readFileSync('./dictionary.json', 'utf8'));
            
            const stmt = db.prepare("INSERT INTO words (word, accent, pronunciation, example) VALUES (?, ?, ?, ?)");
            
            Object.entries(dictionaryData).forEach(([word, data]) => {
                stmt.run(word, data.accent, data.pronunciation, data.example, (err) => {
                    if (err) {
                        console.error('Error inserting word:', word, err);
                    }
                });
            });
            
            stmt.finalize((err) => {
                if (err) {
                    console.error('Error finalizing statement:', err);
                } else {
                    console.log('Dictionary data migrated successfully');
                }
            });
        }
    });
}

// Authentication Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === ADMIN_USERNAME) {
        const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (isValidPassword) {
            req.session.isAuthenticated = true;
            req.session.username = username;
            return res.json({ success: true, message: 'Login successful' });
        }
    }

    res.status(401).json({ error: 'Invalid credentials' });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ success: true, message: 'Logout successful' });
    });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    res.json({
        isAuthenticated: !!req.session.isAuthenticated,
        username: req.session.username || null
    });
});

// API Routes

// Get all words
app.get('/api/words', (req, res) => {
    db.all("SELECT * FROM words ORDER BY word", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific word
app.get('/api/words/:word', (req, res) => {
    const word = req.params.word;
    db.get("SELECT * FROM words WHERE word = ?", [word], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Word not found' });
        }
    });
});

// Add a new word (protected route)
app.post('/api/words', requireAuth, (req, res) => {
    const { word, accent, pronunciation, example } = req.body;
    
    if (!word || !accent || !pronunciation || !example) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.run(
        "INSERT INTO words (word, accent, pronunciation, example) VALUES (?, ?, ?, ?)",
        [word, accent, pronunciation, example],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, word, accent, pronunciation, example });
            }
        }
    );
});

// Update a word (protected route)
app.put('/api/words/:id', requireAuth, (req, res) => {
    const { word, accent, pronunciation, example } = req.body;
    const id = req.params.id;
    
    db.run(
        "UPDATE words SET word = ?, accent = ?, pronunciation = ?, example = ? WHERE id = ?",
        [word, accent, pronunciation, example, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Word not found' });
            } else {
                res.json({ id, word, accent, pronunciation, example });
            }
        }
    );
});

// Delete a word (protected route)
app.delete('/api/words/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    
    db.run("DELETE FROM words WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Word not found' });
        } else {
            res.json({ message: 'Word deleted successfully' });
        }
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
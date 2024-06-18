const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database connection
const db = new sqlite3.Database('./database.db');

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/festival_info', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'festival_info.html'));
});

app.get('/lineup', (req, res) => {
    const stages = [];
    db.serialize(() => {
        db.all(`SELECT * FROM stages`, [], (err, stageRows) => {
            if (err) {
                throw err;
            }
            let stageCount = 0;
            stageRows.forEach((stageRow) => {
                db.all(`SELECT * FROM lineup WHERE stage_id = ?`, [stageRow.id], (err, lineupRows) => {
                    if (err) {
                        throw err;
                    }
                    stages.push({
                        stage: stageRow.name,
                        lineup: lineupRows
                    });
                    stageCount++;
                    if (stageCount === stageRows.length) {
                        res.render('lineup', { stages: stages });
                    }
                });
            });
        });
    });
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

app.get('/stages', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stages.html'));
});

app.get('/submit-response', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit-response.html'));
});

app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    db.run(`INSERT INTO contact (name, email, message) VALUES (?, ?, ?)`, [name, email, message], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.redirect('/submit-response');
    });
});

// Memory game route
app.get('/memory-game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'memory-game.html'));
});

// Handle search request
app.get('/search', (req, res) => {
    const artistQuery = req.query.artist;
    db.serialize(() => {
        db.all(`SELECT stages.name as stage, lineup.artist, lineup.time 
                FROM lineup 
                JOIN stages ON lineup.stage_id = stages.id 
                WHERE lineup.artist LIKE ?`, [`%${artistQuery}%`], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json(rows);
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

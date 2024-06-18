const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS stages");
    db.run("DROP TABLE IF EXISTS lineup");
    db.run("DROP TABLE IF EXISTS contact");

    db.run(`
        CREATE TABLE stages (
            id INTEGER PRIMARY KEY,
            name TEXT
        )
    `);

    db.run(`
        CREATE TABLE lineup (
            id INTEGER PRIMARY KEY,
            stage_id INTEGER,
            artist TEXT,
            time TEXT,
            FOREIGN KEY (stage_id) REFERENCES stages(id)
        )
    `);

    db.run(`
        CREATE TABLE contact (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            message TEXT
        )
    `);

    const stages = [
        { id: 1, name: 'Main Stage' },
        { id: 2, name: 'Jazz Stage' },
        { id: 3, name: 'Blues Stage' }
    ];

    const lineup = [
        { stage_id: 1, artist: 'The Swinging Notes', time: '12:00 PM' },
        { stage_id: 1, artist: 'Miles High Quartet', time: '01:00 PM' },
        { stage_id: 1, artist: 'Blue Note Trio', time: '02:00 PM' },
        { stage_id: 1, artist: 'The Blue Note Architects', time: '03:00 PM' },
        { stage_id: 2, artist: 'The Ellington Legacy', time: '12:00 PM' },
        { stage_id: 2, artist: 'The Midnight Standards', time: '01:00 PM' },
        { stage_id: 2, artist: 'The Nu-tet', time: '02:00 PM' },
        { stage_id: 2, artist: 'Improv Syndicate', time: '03:00 PM' },
        { stage_id: 3, artist: 'The Next Collective', time: '12:00 PM' },
        { stage_id: 3, artist: 'Whispering Pines', time: '01:00 PM' },
        { stage_id: 3, artist: 'The Sunset Trio', time: '02:00 PM' },
        { stage_id: 3, artist: 'Bossa Nova Breeze', time: '03:00 PM' },
        { stage_id: 3, artist: 'Harmony Vibes', time: '04:00 PM' }
    ];

    const insertStage = db.prepare("INSERT INTO stages (id, name) VALUES (?, ?)");
    for (const stage of stages) {
        insertStage.run(stage.id, stage.name);
    }
    insertStage.finalize();

    const insertLineup = db.prepare("INSERT INTO lineup (stage_id, artist, time) VALUES (?, ?, ?)");
    for (const artist of lineup) {
        insertLineup.run(artist.stage_id, artist.artist, artist.time);
    }
    insertLineup.finalize();
});

db.close();

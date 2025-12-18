// dbConnec.js

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
dotenv.config();

let db = null;

const initDatabase = async () => {
    try {
        const SQL = await initSqlJs({
            // Optional: You can specify the path to the SQL.js wasm file
            // locateFile: file => `./node_modules/sql.js/dist/${file}`
        });
        
        const dbPath = path.join(__dirname, 'focus_learn.db');
        
        // Try to load existing database or create new one
        let filebuffer;
        try {
            filebuffer = fs.readFileSync(dbPath);
        } catch (err) {
            // Database doesn't exist, create new one
            filebuffer = null;
        }
        
        db = new SQL.Database(filebuffer);
        
        // Create tables if they don't exist
        createTables();
        
        // Save database
        saveDatabase();
        
        return db;
    } catch (error) {
        logger.error(`Database initialization failed: ${error.message}`);
        throw error;
    }
};

const createTables = () => {
    const tables = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS journeys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            is_public BOOLEAN NOT NULL DEFAULT TRUE,
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS chapters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            video_link VARCHAR(255) NOT NULL,
            external_link VARCHAR(255),
            is_completed BOOLEAN NOT NULL DEFAULT FALSE,
            chapter_no INTEGER NOT NULL,
            journey_id INTEGER,
            FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS forked_journeys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            original_journey_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (original_journey_id) REFERENCES journeys(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            chapter_id INTEGER NOT NULL,
            journey_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
            FOREIGN KEY (journey_id) REFERENCES journeys(id) ON DELETE CASCADE
        );
    `;
    
    db.exec(tables);
};

const saveDatabase = () => {
    const dbPath = path.join(__dirname, 'focus_learn.db');
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
};

// Wrapper to make it work like mysql2 promise interface
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        try {
            if (!db) {
                reject(new Error('Database not initialized'));
                return;
            }

            // console.log('Executing SQL:', sql, 'with params:', params); // Removed for production

            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                const stmt = db.prepare(sql);
                const result = [];
                
                // Bind parameters and execute
                stmt.bind(params);
                while (stmt.step()) {
                    result.push(stmt.getAsObject());
                }
                stmt.free();
                // console.log('Query result:', result); // Removed for production
                resolve([result, null]);
            } else {
                const stmt = db.prepare(sql);
                stmt.bind(params);
                stmt.step();
                
                // Get the last insert row ID and affected rows
                const changes = db.getRowsModified();
                const lastInsertRowid = db.exec("SELECT last_insert_rowid() as id")[0]?.values?.[0]?.[0] || 0;
                
                stmt.free();
                saveDatabase(); // Save after write operations
                // console.log('Insert/Update result:', { lastInsertRowid, changes }); // Removed for production
                resolve([{ insertId: lastInsertRowid, affectedRows: changes }, null]);
            }
        } catch (error) {
            logger.error(`Database query failed: ${error.message}`);
            reject(error);
        }
    });
};

const execute = query; // Alias for compatibility

module.exports = {
    query,
    execute,
    init: initDatabase
};


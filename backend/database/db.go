package database

import (
	"database/sql"
	"log"

	"accounting-backend/config"

	_ "github.com/mattn/go-sqlite3"
)

func Init(cfg *config.DatabaseConfig) *sql.DB {
	db, err := sql.Open("sqlite3", "./accounting.db")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	return db
}

func CreateTables(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS expenses (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		description TEXT NOT NULL,
		amount REAL NOT NULL,
		category TEXT NOT NULL,
		date DATETIME NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS schedules (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		day_of_week INTEGER NOT NULL, -- 0=Mon, 1=Tue, ..., 4=Fri (or 0-6)
		title TEXT NOT NULL,
		note TEXT,
		start_hour INTEGER NOT NULL,
		end_hour INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_date ON expenses(date);
	CREATE INDEX IF NOT EXISTS idx_category ON expenses(category);
	`

	_, err := db.Exec(query)
	return err
}

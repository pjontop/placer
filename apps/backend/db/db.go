package db

import (
	"database/sql"
	_ "embed"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var schemaSQL string

// Establish Connection with the Database
func Connect(connectionString string) (*sql.DB, error) {
	db, err := sql.Open("pgx", connectionString)

	if err != nil {
		return nil, err
	}

	// Testing the Connection
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Connected to the database successfully") // yay!

	// init schema
	log.Println("db schema init...")
	if _, err := db.Exec(schemaSQL); err != nil {
		log.Printf("failed to initialize schema with: %v", err)
	} else {
		log.Println("db schema initialized")
	}

	return db, nil
}

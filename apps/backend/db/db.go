package db

import (
	"database/sql"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

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
	return db, nil
}

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/pjontop/placer/backend/auth"
	"github.com/pjontop/placer/backend/db"
	"github.com/pjontop/placer/backend/handlers"
	"github.com/pjontop/placer/backend/middleware"
	"github.com/pjontop/placer/backend/models"
)

// loadEnv loads environment variables from .env file
func loadEnv() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Check required variables
	requiredVars := []string{"DATABASE_URL", "JWT_SECRET", "FRONTEND_URL"}
	for _, v := range requiredVars {
		if os.Getenv(v) == "" {
			log.Fatalf("Required environment variable %s is not set", v)
		}
	}
}

func main() {
	log.Println("starting backend")

	// Load environment variables
	loadEnv()
	log.Println("vars loaded")

	// Connect to the database
	log.Println("connecting to db")
	database, err := db.Connect(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("failed db connection with: %v", err)
	}
	log.Println("db connected")

	r := mux.NewRouter()

	frontendURL := os.Getenv("FRONTEND_URL")
	log.Printf("configuring cors for: %s", frontendURL)
	r.Use(middleware.CORSMiddleware(frontendURL))

	log.Println("creating repo's")
	userRepo := models.NewUserRepository(database)
	refreshTokenRepo := models.NewRefreshTokenRepository(database)

	log.Println("starting services")
	authService := auth.NewAuthService(userRepo, refreshTokenRepo, os.Getenv("JWT_SECRET"), 15*time.Minute)

	log.Println("starting handlers")
	authHandler := handlers.NewAuthHandler(authService)
	userHandler := handlers.NewUserHandler(userRepo)

	log.Println("configuring public routes")
	r.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST", "OPTIONS")
	log.Println("  - POST /api/auth/register")
	r.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST", "OPTIONS")
	log.Println("  - POST /api/auth/login")
	r.HandleFunc("/api/auth/refresh", authHandler.RefreshToken).Methods("POST", "OPTIONS")
	log.Println("  - POST /api/auth/refresh")
	r.HandleFunc("/api/auth/logout", authHandler.Logout).Methods("POST", "OPTIONS")
	log.Println("  - POST /api/auth/logout")

	log.Println("configuring private routes")
	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware(authService))

	protected.HandleFunc("/profile", userHandler.Profile).Methods("GET")
	log.Println("  - GET /api/profile")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("")
	log.Printf("server ready and on http://localhost:%s", port)
	log.Println("")
	log.Fatal(http.ListenAndServe(":"+port, r))
}

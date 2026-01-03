package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/pjontop/placer/backend/middleware"
	"github.com/pjontop/placer/backend/models"
)

// UserHandler contains HTTP handlers for user-related endpoints
type UserHandler struct {
	userRepo *models.UserRepository
}

// NewUserHandler creates a new user handler
func NewUserHandler(userRepo *models.UserRepository) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
	}
}

// UserResponse represents the user data returned to clients
type UserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// Profile returns the authenticated user's profile
func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request) {
	log.Println("profile request received")

	// Get user ID from request context (set by auth middleware)
	userID, ok := middleware.GetUserID(r)
	if !ok {
		log.Println("no userid in context")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	log.Printf("fetching profile for: %s", userID)

	// Get user from database
	user, err := h.userRepo.GetUserByID(userID)
	if err != nil {
		log.Printf("user not found: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	log.Printf("profile fetched for: %s", user.Email)

	// Return user profile (excluding sensitive data)
	response := UserResponse{
		ID:    user.ID.String(),
		Email: user.Email,
		Name:  user.Name,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

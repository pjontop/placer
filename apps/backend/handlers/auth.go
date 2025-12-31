package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/pjontop/placer/backend/auth"
)

// AuthHandler contains HTTP handlers for authentication
type AuthHandler struct {
	authService *auth.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *auth.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// RegisterRequest represents the registration payload
type RegisterRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterResponse contains the user data after successful registration
type RegisterResponse struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	// Validate input
	if req.Email == "" || req.Username == "" || req.Password == "" {
		http.Error(w, "Email, username, and password are required", http.StatusBadRequest)
		return
	}
	// Call the auth service to register the user
	user, err := h.authService.Register(req.Email, req.Username, req.Password)
	if err != nil {
		if errors.Is(err, auth.ErrEmailInUse) {
			http.Error(w, "Email already in use", http.StatusConflict)
			return
		}
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}
	// Return the created user (without sensitive data)
	response := RegisterResponse{
		ID:       user.ID.String(),
		Email:    user.Email,
		Username: user.Username,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// LoginRequest represents the login payload
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse contains the JWT token after successful login
type LoginResponse struct {
	Token string `json:"token"`
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	// Attempt to login
	token, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidCredentials) {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}
	// Return the token
	response := LoginResponse{Token: token}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handlers/auth.go (existing methods)

// RefreshRequest represents the refresh token payload
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

// RefreshResponse contains the new access token
type RefreshResponse struct {
	Token string `json:"token"`
}

// RefreshToken handles access token refresh
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var req RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Attempt to refresh the token
	token, err := h.authService.RefreshAccessToken(req.RefreshToken)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidToken) || errors.Is(err, auth.ErrExpiredToken) {
			http.Error(w, "Invalid or expired refresh token", http.StatusUnauthorized)
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	// Return the new access token
	response := RefreshResponse{Token: token}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

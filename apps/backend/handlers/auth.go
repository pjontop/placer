package handlers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

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
	Name     string `json:"name"`
	Password string `json:"password"`
}

// RegisterResponse contains the user data after successful registration
type RegisterResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	log.Println("register recieved")

	// Parse the request body
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("register invalides payload with: %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("register user attempt: %s", req.Email)

	// Validate input
	if req.Email == "" || req.Name == "" || req.Password == "" {
		log.Println("registration missing fields")
		http.Error(w, "Email, name, and password are required", http.StatusBadRequest)
		return
	}
	// Call the auth service to register the user
	user, err := h.authService.Register(req.Email, req.Name, req.Password)
	if err != nil {
		if errors.Is(err, auth.ErrEmailInUse) {
			log.Printf("email already in use with: %s", req.Email)
			http.Error(w, "Email already in use", http.StatusConflict)
			return
		}
		log.Printf("error creating user with: %v", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}
	log.Printf("user creation succesfull with: %s (ID: %s)", user.Email, user.ID)

	// Return the created user (without sensitive data)
	response := RegisterResponse{
		ID:    user.ID.String(),
		Email: user.Email,
		Name:  user.Name,
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
	log.Println("login request received")

	// Parse the request body
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("login invalid request payload: %v", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	log.Printf("attempting login for user: %s", req.Email)

	// Get refresh TTL from env or default to 7 days
	refreshTTLStr := os.Getenv("REFRESH_TOKEN_EXPIRES_IN")
	if refreshTTLStr == "" {
		refreshTTLStr = "168h"
	}
	refreshTTL, err := time.ParseDuration(refreshTTLStr)
	if err != nil {
		http.Error(w, "Invalid refresh token TTL configuration", http.StatusInternalServerError)
		return
	}

	// Attempt to login and create refresh token
	accessToken, refreshToken, err := h.authService.LoginWithRefresh(req.Email, req.Password, refreshTTL)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidCredentials) {
			log.Printf("invaled creds for: %s", req.Email)
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			log.Printf("error doing login with: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	log.Printf("user logged in: %s", req.Email)

	// Cookie settings from env
	cookieSecure := true
	if os.Getenv("COOKIE_SECURE") == "false" {
		cookieSecure = false
	}
	cookieSameSite := http.SameSiteNoneMode
	switch os.Getenv("COOKIE_SAMESITE") {
	case "Lax":
		cookieSameSite = http.SameSiteLaxMode
	case "Strict":
		cookieSameSite = http.SameSiteStrictMode
	}

	cookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   cookieSecure,
		SameSite: cookieSameSite,
		Path:     "/",
		Expires:  time.Now().Add(refreshTTL),
	}
	if domain := os.Getenv("COOKIE_DOMAIN"); domain != "" {
		cookie.Domain = domain
	}

	http.SetCookie(w, cookie)

	// Return access token in response body
	response := LoginResponse{Token: accessToken}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// RefreshResponse contains the new access token
type RefreshResponse struct {
	Token string `json:"token"`
}

// RefreshToken handles access token refresh
func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	log.Println("refresh token request recieved")

	// Read refresh token from cookie
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		log.Println("no fresh token cookie found")
		http.Error(w, "Refresh token required", http.StatusUnauthorized)
		return
	}

	// Attempt to refresh the token using the cookie
	token, err := h.authService.RefreshAccessToken(cookie.Value)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidToken) || errors.Is(err, auth.ErrExpiredToken) {
			log.Println("bad request token")
			http.Error(w, "Invalid or expired refresh token", http.StatusUnauthorized)
		} else {
			log.Printf("error requesting token with: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	log.Println("access token refreshed!")

	// Return the new access token
	response := RefreshResponse{Token: token}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Logout handles sign out by revoking the refresh token and clearing the cookie
func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	log.Println("logout request recieved")

	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		log.Println("revoking refresh token")
		// best-effort revoke
		_ = h.authService.RevokeRefreshToken(cookie.Value)
	} else {
		log.Println("no refresh token cookie found")
	}

	log.Println("user logged out")

	clear := &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   os.Getenv("COOKIE_SECURE") != "false",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteNoneMode,
	}
	if domain := os.Getenv("COOKIE_DOMAIN"); domain != "" {
		clear.Domain = domain
	}
	http.SetCookie(w, clear)
	w.WriteHeader(http.StatusOK)
}

package routes

import (
	"net/http"

	"github.com/charmbracelet/log"
)

// withLogging reports incoming requests
func withLogging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info(r.Method, "@", r.URL.Path)
		next.ServeHTTP(w, r)
	}
}

// ifAdmin confirms that a registered user has admin priviledges
func ifAdmin(next http.HandlerFunc) http.HandlerFunc {
	return ifLoggedIn(func(w http.ResponseWriter, r *http.Request) {
		log.Info("is admin")
		next.ServeHTTP(w, r)
	})
}

// ifLoggedIn confirms that a user is logged in
func ifLoggedIn(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Info("logged in")
		next.ServeHTTP(w, r)
	}
}

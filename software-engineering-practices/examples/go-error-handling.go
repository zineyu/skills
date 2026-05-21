package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// ✅ Good: Structured error wrapping
type NotFoundError struct {
	Resource string
	ID       string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found: %s", e.Resource, e.ID)
}

// ✅ Good: Repository pattern with interface
type UserRepository interface {
	GetByID(ctx context.Context, id string) (*User, error)
	Create(ctx context.Context, user *User) error
}

type User struct {
	ID   string
	Name string
}

// ✅ Good: Service layer with dependency injection
type UserService struct {
	repo UserRepository
	log  *log.Logger
}

func NewUserService(repo UserRepository, log *log.Logger) *UserService {
	return &UserService{repo: repo, log: log}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("get user %s: %w", id, err)
	}
	return user, nil
}

// ✅ Good: Graceful shutdown with context
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle shutdown signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Start server
	srv := &http.Server{
		Addr:    ":8080",
		Handler: nil,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Wait for shutdown signal
	<-sigChan
	log.Println("shutting down...")

	// Graceful shutdown with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("shutdown error: %v", err)
	}

	cancel() // Cancel application context
	log.Println("server stopped")
}

// ❌ Bad: Ignoring errors
func badExample() {
	file, _ := os.Open("config.json") // ❌ Never ignore errors!
	defer file.Close()
}

// ❌ Bad: Panic for normal errors
func badPanicExample(id string) *User {
	if id == "" {
		panic("id cannot be empty") // ❌ Use panic only for unrecoverable errors
	}
	return nil
}
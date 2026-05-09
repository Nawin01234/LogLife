package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"accounting-backend/config"
	"accounting-backend/database"
	"accounting-backend/handlers"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()
	log.Printf("Starting server on port %s", cfg.Port)

	// Initialize database
	db := database.Init(&cfg.Database)
	defer db.Close()

	// Create tables
	if err := database.CreateTables(db); err != nil {
		log.Fatalf("Failed to create tables: %v", err)
	}

	// Initialize Gin router
	router := gin.Default()

	// Add CORS middleware
	router.Use(corsMiddleware())

	// Initialize handlers
	expenseHandler := handlers.NewExpenseHandler(db)
	scheduleHandler := handlers.NewScheduleHandler(db)

	// Routes
	api := router.Group("/api")
	{
		expenses := api.Group("/expenses")
		{
			expenses.POST("", expenseHandler.CreateExpense)
			expenses.GET("", expenseHandler.GetExpenses)
			expenses.GET("/summary", expenseHandler.GetSummary)
			expenses.DELETE("/:id", expenseHandler.DeleteExpense)
		}

		schedules := api.Group("/schedules")
		{
			schedules.POST("", scheduleHandler.CreateSchedule)
			schedules.GET("", scheduleHandler.GetSchedules)
			schedules.PUT("/:id", scheduleHandler.UpdateSchedule)
			schedules.DELETE("/:id", scheduleHandler.DeleteSchedule)
		}
	}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Run server
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

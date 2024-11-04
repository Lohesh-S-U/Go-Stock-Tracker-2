package main

import (
	"net/http"

	"github.com/Lohesh-S-U/go-stock/controllers"
	"github.com/Lohesh-S-U/go-stock/initializers"
	"github.com/Lohesh-S-U/go-stock/middleware"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware handles CORS-related headers and allows preflight requests
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Set to specific domain in production for security
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	// Apply CORS middleware
	r.Use(CORSMiddleware())

	// Define routes
	r.POST("/api/signup", controllers.Signup)
	r.POST("/api/login", controllers.Login)
	r.GET("/api/validate", middleware.RequireAuth, controllers.Validate)
	r.POST("/api/buy", middleware.RequireAuth, controllers.BuyStock)
	r.GET("/api/get", middleware.RequireAuth, controllers.GetStocks)
	r.POST("/api/sell", middleware.RequireAuth, controllers.SellStock)

	// Start server
	r.Run()
}

package main

import (
	"github.com/Lohesh-S-U/go-stock/controllers"
	"github.com/Lohesh-S-U/go-stock/initializers"
	"github.com/Lohesh-S-U/go-stock/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
	initializers.SyncDatabase()
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/api/signup", controllers.Signup)
	r.POST("/api/login", controllers.Login)
	r.GET("/api/validate", middleware.RequireAuth, controllers.Validate)
	r.POST("/api/buy", middleware.RequireAuth, controllers.BuyStock)
	r.GET("/api/get", middleware.RequireAuth, controllers.GetStocks)
	r.POST("/api/sell", middleware.RequireAuth, controllers.SellStock)

	// Start server
	r.Run()
}

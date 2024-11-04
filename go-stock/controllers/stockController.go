package controllers

import (
	"net/http"

	"github.com/Lohesh-S-U/go-stock/initializers"
	"github.com/Lohesh-S-U/go-stock/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func BuyStock(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}
	userModel := user.(models.User)

	var body struct {
		Company string `json:"company"`
		Amount  uint   `json:"amount"`
		Price   uint   `json:"price"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body", "details": err.Error()})
		return
	}

	var stock models.Stock
	result := initializers.DB.Where("user_id = ? AND company = ?", userModel.ID, body.Company).First(&stock)

	if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if result.RowsAffected > 0 {
		stock.Amount += body.Amount
		stock.Price = body.Price
		initializers.DB.Save(&stock)
		c.JSON(http.StatusOK, gin.H{"message": "Stock amount and price updated", "stock": stock})
	} else {
		stock = models.Stock{
			UserID:  userModel.ID,
			Company: body.Company,
			Amount:  body.Amount,
			Price:   body.Price,
		}
		initializers.DB.Create(&stock)
		c.JSON(http.StatusCreated, gin.H{"message": "New stock added", "stock": stock})
	}
}

func SellStock(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}
	userModel := user.(models.User)

	var body struct {
		Company string `json:"company"`
		Amount  uint   `json:"amount"`
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	var stock models.Stock
	result := initializers.DB.Where("user_id = ? AND company = ?", userModel.ID, body.Company).First(&stock)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Stock not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	if stock.Amount < body.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough stock to sell"})
		return
	}

	stock.Amount -= body.Amount

	if stock.Amount == 0 {
		initializers.DB.Delete(&stock)
		c.JSON(http.StatusOK, gin.H{"message": "Stock sold and removed from holdings"})
	} else {
		initializers.DB.Save(&stock)
		c.JSON(http.StatusOK, gin.H{"message": "Stock amount updated", "stock": stock})
	}
}

func GetStocks(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}
	userModel := user.(models.User)

	var stocks []models.Stock
	initializers.DB.Where("user_id = ?", userModel.ID).Find(&stocks)

	c.JSON(http.StatusOK, gin.H{"stocks": stocks})
}

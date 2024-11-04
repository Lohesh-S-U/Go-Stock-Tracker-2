package initializers

import (
	"fmt"

	"github.com/Lohesh-S-U/go-stock/models"
)

func SyncDatabase() {
	err := DB.AutoMigrate(&models.User{}, &models.Stock{})

	if err != nil {
		fmt.Println(err)
	}
}

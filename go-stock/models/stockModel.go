package models

import "gorm.io/gorm"

type Stock struct {
	gorm.Model
	UserID  uint
	Company string
	Amount  uint
	Price   uint
}

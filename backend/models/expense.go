package models

import "time"

type Expense struct {
	ID          int       `json:"id" db:"id"`
	Description string    `json:"description" db:"description"`
	Amount      float64   `json:"amount" db:"amount"`
	Category    string    `json:"category" db:"category"`
	Date        time.Time `json:"date" db:"date"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

type CreateExpenseRequest struct {
	Description string    `json:"description" binding:"required"`
	Amount      float64   `json:"amount" binding:"required,gt=0"`
	Category    string    `json:"category" binding:"required,oneof=food supplies other"`
	Date        time.Time `json:"date" binding:"required"`
}

type ExpenseResponse struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	Amount      float64   `json:"amount"`
	Category    string    `json:"category"`
	Date        time.Time `json:"date"`
}

type SummaryResponse struct {
	Period     string             `json:"period"` // day, month, year
	Total      float64            `json:"total"`
	Count      int                `json:"count"`
	ByCategory map[string]float64 `json:"by_category"`
	Expenses   []ExpenseResponse  `json:"expenses"`
}

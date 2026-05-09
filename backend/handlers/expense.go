package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"accounting-backend/models"

	"github.com/gin-gonic/gin"
)

type ExpenseHandler struct {
	db *sql.DB
}

func NewExpenseHandler(db *sql.DB) *ExpenseHandler {
	return &ExpenseHandler{db: db}
}

// CreateExpense creates a new expense
func (h *ExpenseHandler) CreateExpense(c *gin.Context) {
	var req models.CreateExpenseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `
	INSERT INTO expenses (description, amount, category, date)
	VALUES (?, ?, ?, ?)
	`

	result, err := h.db.Exec(query, req.Description, req.Amount, req.Category, req.Date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create expense"})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get inserted ID"})
		return
	}

	expense := models.ExpenseResponse{
		ID:          int(id),
		Description: req.Description,
		Amount:      req.Amount,
		Category:    req.Category,
		Date:        req.Date,
	}

	c.JSON(http.StatusCreated, expense)
}

// GetExpenses gets all expenses with optional filtering
func (h *ExpenseHandler) GetExpenses(c *gin.Context) {
	period := c.DefaultQuery("period", "day")
	dateStr := c.DefaultQuery("date", time.Now().Format("2006-01-02"))

	var rows *sql.Rows
	var err error

	if period == "all" {
		query := `
		SELECT id, description, amount, category, date
		FROM expenses
		ORDER BY date DESC
		`
		rows, err = h.db.Query(query)
	} else {
		date, errParse := time.Parse("2006-01-02", dateStr)
		if errParse != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
			return
		}

		query := ""
		switch period {
		case "day":
			query = `
			SELECT id, description, amount, category, date
			FROM expenses
			WHERE DATE(date) = DATE(?)
			ORDER BY date DESC
			`
		case "month":
			query = `
			SELECT id, description, amount, category, date
			FROM expenses
			WHERE STRFTIME('%Y-%m', date) = STRFTIME('%Y-%m', ?)
			ORDER BY date DESC
			`
		case "year":
			query = `
			SELECT id, description, amount, category, date
			FROM expenses
			WHERE STRFTIME('%Y', date) = STRFTIME('%Y', ?)
			ORDER BY date DESC
			`
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid period"})
			return
		}
		rows, err = h.db.Query(query, date)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch expenses"})
		return
	}
	defer rows.Close()

	var expenses []models.ExpenseResponse
	for rows.Next() {
		var exp models.ExpenseResponse
		if err := rows.Scan(&exp.ID, &exp.Description, &exp.Amount, &exp.Category, &exp.Date); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse expenses"})
			return
		}
		expenses = append(expenses, exp)
	}

	c.JSON(http.StatusOK, expenses)
}

// GetSummary gets summary for a period
func (h *ExpenseHandler) GetSummary(c *gin.Context) {
	period := c.DefaultQuery("period", "day")
	dateStr := c.DefaultQuery("date", time.Now().Format("2006-01-02"))

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	query := ""
	switch period {
	case "day":
		query = `
		SELECT id, description, amount, category, date
		FROM expenses
		WHERE DATE(date) = DATE(?)
		ORDER BY date DESC
		`
	case "month":
		query = `
		SELECT id, description, amount, category, date
		FROM expenses
		WHERE STRFTIME('%Y-%m', date) = STRFTIME('%Y-%m', ?)
		ORDER BY date DESC
		`
	case "year":
		query = `
		SELECT id, description, amount, category, date
		FROM expenses
		WHERE STRFTIME('%Y', date) = STRFTIME('%Y', ?)
		ORDER BY date DESC
		`
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid period"})
		return
	}

	rows, err := h.db.Query(query, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch expenses"})
		return
	}
	defer rows.Close()

	var expenses []models.ExpenseResponse
	total := 0.0
	byCategory := make(map[string]float64)

	for rows.Next() {
		var exp models.ExpenseResponse
		if err := rows.Scan(&exp.ID, &exp.Description, &exp.Amount, &exp.Category, &exp.Date); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse expenses"})
			return
		}
		expenses = append(expenses, exp)
		total += exp.Amount
		byCategory[exp.Category] += exp.Amount
	}

	summary := models.SummaryResponse{
		Period:     period,
		Total:      total,
		Count:      len(expenses),
		ByCategory: byCategory,
		Expenses:   expenses,
	}

	c.JSON(http.StatusOK, summary)
}

// DeleteExpense deletes an expense
func (h *ExpenseHandler) DeleteExpense(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	result, err := h.db.Exec("DELETE FROM expenses WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete expense"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Expense not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense deleted successfully"})
}

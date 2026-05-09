package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"accounting-backend/models"

	"github.com/gin-gonic/gin"
)

type ScheduleHandler struct {
	db *sql.DB
}

func NewScheduleHandler(db *sql.DB) *ScheduleHandler {
	return &ScheduleHandler{db: db}
}

func (h *ScheduleHandler) checkOverlap(day, start, end, excludeID int) (bool, error) {
	query := `
	SELECT COUNT(*) FROM schedules 
	WHERE day_of_week = ? AND id != ? AND (
		(start_hour < ? AND end_hour > ?)
	)
	`
	var count int
	err := h.db.QueryRow(query, day, excludeID, end, start).Scan(&count)
	return count > 0, err
}

func (h *ScheduleHandler) CreateSchedule(c *gin.Context) {
	var req models.CreateScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.StartHour >= req.EndHour {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start hour must be before end hour"})
		return
	}

	overlap, err := h.checkOverlap(req.DayOfWeek, req.StartHour, req.EndHour, -1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check overlap"})
		return
	}
	if overlap {
		c.JSON(http.StatusConflict, gin.H{"error": "Schedule overlaps with an existing activity"})
		return
	}

	query := `INSERT INTO schedules (day_of_week, title, note, start_hour, end_hour) VALUES (?, ?, ?, ?, ?)`
	result, err := h.db.Exec(query, req.DayOfWeek, req.Title, req.Note, req.StartHour, req.EndHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create schedule"})
		return
	}

	id, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, models.ScheduleResponse{
		ID:        int(id),
		DayOfWeek: req.DayOfWeek,
		Title:     req.Title,
		Note:      req.Note,
		StartHour: req.StartHour,
		EndHour:   req.EndHour,
	})
}

func (h *ScheduleHandler) GetSchedules(c *gin.Context) {
	rows, err := h.db.Query("SELECT id, day_of_week, title, note, start_hour, end_hour FROM schedules ORDER BY day_of_week ASC, start_hour ASC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch schedules"})
		return
	}
	defer rows.Close()

	var schedules []models.ScheduleResponse
	for rows.Next() {
		var s models.ScheduleResponse
		if err := rows.Scan(&s.ID, &s.DayOfWeek, &s.Title, &s.Note, &s.StartHour, &s.EndHour); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse schedules"})
			return
		}
		schedules = append(schedules, s)
	}
	c.JSON(http.StatusOK, schedules)
}

func (h *ScheduleHandler) UpdateSchedule(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req models.CreateScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.StartHour >= req.EndHour {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Start hour must be before end hour"})
		return
	}

	overlap, err := h.checkOverlap(req.DayOfWeek, req.StartHour, req.EndHour, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check overlap"})
		return
	}
	if overlap {
		c.JSON(http.StatusConflict, gin.H{"error": "Schedule overlaps with an existing activity"})
		return
	}

	query := `UPDATE schedules SET day_of_week = ?, title = ?, note = ?, start_hour = ?, end_hour = ? WHERE id = ?`
	_, err = h.db.Exec(query, req.DayOfWeek, req.Title, req.Note, req.StartHour, req.EndHour, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update schedule"})
		return
	}

	c.JSON(http.StatusOK, models.ScheduleResponse{
		ID:        id,
		DayOfWeek: req.DayOfWeek,
		Title:     req.Title,
		Note:      req.Note,
		StartHour: req.StartHour,
		EndHour:   req.EndHour,
	})
}

func (h *ScheduleHandler) DeleteSchedule(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	_, err := h.db.Exec("DELETE FROM schedules WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete schedule"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Schedule deleted"})
}

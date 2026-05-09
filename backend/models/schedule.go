package models

import "time"

type Schedule struct {
	ID        int       `json:"id" db:"id"`
	DayOfWeek int       `json:"day_of_week" db:"day_of_week"`
	Title     string    `json:"title" db:"title"`
	Note      string    `json:"note" db:"note"`
	StartHour int       `json:"start_hour" db:"start_hour"`
	EndHour   int       `json:"end_hour" db:"end_hour"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type CreateScheduleRequest struct {
	DayOfWeek int    `json:"day_of_week" binding:"min=0,max=6"`
	Title     string `json:"title" binding:"required"`
	Note      string `json:"note"`
	StartHour int    `json:"start_hour" binding:"min=0,max=23"`
	EndHour   int    `json:"end_hour" binding:"min=1,max=24"`
}

type ScheduleResponse struct {
	ID        int    `json:"id"`
	DayOfWeek int    `json:"day_of_week"`
	Title     string `json:"title"`
	Note      string `json:"note"`
	StartHour int    `json:"start_hour"`
	EndHour   int    `json:"end_hour"`
}

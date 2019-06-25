package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func ReadStops(db *gorm.DB) {
	stopSlice := []Stop{}
	db.Find(&stopSlice)

	for _, s := range stopSlice {
		stops[s.ID] = s
	}
}

func ReadLines(db *gorm.DB) {
	lineSlice := []Line{}
	db.Find(&lineSlice)

	for _, l := range lineSlice {
		db.Model(l).Order("seq").Association("Stops").Find(&l.Stops)
		lines[l.ID] = l
	}
}

func ReadTime(db *gorm.DB) {
	// this toy ORM can't return min(date) without breaking...
	var journey Journey

	db.Order("start_date").Limit(1).Find(&journey)
	start_time = journey.StartDate

	journey = Journey{}
	db.Order("start_date desc").Limit(1).Find(&journey)
	end_time = journey.StartDate
}

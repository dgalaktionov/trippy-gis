package main

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"time"
)

func ReadStops(db *sqlx.DB) {
	stopSlice := []Stop{}
	err := db.Select(&stopSlice, "SELECT ctr_id, name, lat, lon FROM stop WHERE ctr_id IS NOT NULL ORDER BY ctr_id")
	LogAndQuit(err)
	for _, s := range stopSlice {
		stops[s.Id] = s
	}
}


func ReadTime(db *sqlx.DB) {
	var strTime string

	err := db.Get(&strTime, "SELECT min(start_date) FROM journey")
	LogAndQuit(err)
	println(strTime)
	start_time, err = time.Parse(time.RFC3339[0:19], strTime)
	LogAndQuit(err)
	println(start_time.Format("2006-01-02"))

	err = db.Get(&strTime, "SELECT max(start_date) FROM journey")
	LogAndQuit(err)
	println(strTime)
	end_time, err = time.Parse(time.RFC3339[0:19], strTime)
	LogAndQuit(err)
	println(end_time.Format("2006-01-02"))
}


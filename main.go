package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var stops = map[string]Stop{}
var stop_id_to_ctr = map[string]uint32{}

func main() {
	var gtfsFlags ArrayFlags
	flag.Var(&gtfsFlags, "gtfs", "path to GTFS")
	flag.Parse()

	if len(gtfsFlags) > 0 {
		InitDB(gtfsFlags)
	}

	db := connectDB()
	defer db.Close()
	readStops(db)
	ReadStopId()
	LoadCTR()
	defer FreeCTR()
	router := gin.Default()
	router.Delims("{%", "%}")
	router.LoadHTMLGlob("view/*.html")
	router.StaticFile("/bundle.js", "view/bundle.js")
	router.StaticFile("/bundle.min.js", "view/bundle.min.js")
	router.Static("/images", "view/images")
	router.GET("/ping", Ping)
	router.GET("/stops", GetAllStops)
	router.GET("/stops/:id", GetStop)
	router.GET("/index", ShowIndex)
	router.GET("/", ShowIndex)
	router.GET("/start/:id", GetStart)
	err := router.Run()
	LogAndQuit(err)
}

func connectDB() *sqlx.DB {
	db, err := sqlx.Connect("sqlite3", "file:data/trippy.db?cache=shared&mode=ro")
	LogAndQuit(err)
	return db
}

func readStops(db *sqlx.DB) {
	stopSlice := []Stop{}
	err := db.Select(&stopSlice, "SELECT stop_id, stop_name, stop_lat, stop_lon FROM gtfs_stops ORDER BY stop_id")
	LogAndQuit(err)
	for _, s := range stopSlice {
		stops[s.Id] = s
	}
}

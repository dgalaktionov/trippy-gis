package main

// #cgo CXXFLAGS: -Ictr/libcds/includes/
// #cgo LDFLAGS: -Lctr -lwcsa -lsais -lcds -lrt -lzstd
// #include "cgo.hxx"
import "C"

import (
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var stops = map[string]Stop{}

func main() {
	var gtfsFlags ArrayFlags
	flag.Var(&gtfsFlags, "gtfs", "path to GTFS")
	flag.Parse()

	fmt.Println("Hi from Go, about to calculate distance in C++ ...")
	distance := C.distance_between(1.0, 1.0, 2.0, 2.0)
	fmt.Printf("Go has result, distance is: %v\n", distance)

	if len(gtfsFlags) > 0 {
		InitDB(gtfsFlags)
	}

	db := connectDB()
	defer db.Close()
	readStops(db)
	router := gin.Default()
	router.LoadHTMLGlob("view/*.html")
	router.StaticFile("/bundle.js", "view/bundle.js")
	router.StaticFile("/bundle.min.js", "view/bundle.min.js")
	router.Static("/images", "view/images")
	router.GET("/ping", Ping)
	router.GET("/stops", GetAllStops)
	router.GET("/stop/:id", GetStop)
	router.GET("/index", ShowIndex)
	router.GET("/", ShowIndex)
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

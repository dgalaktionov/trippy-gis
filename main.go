package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"time"
)

var stops = map[uint32]Stop{}
var lines = map[string]Line{}
var start_time = time.Now()
var end_time = time.Now()

func main() {
	var gtfsFlags ArrayFlags
	flag.Var(&gtfsFlags, "gtfs", "path to GTFS")
	flag.Parse()

	db := connectDB()
	defer db.Close()
	// db.LogMode(true)
	db.SingularTable(true)
	db.AutoMigrate(&Stop{}, &Line{}, &Journey{})
	ReadStops(db)
	ReadLines(db)
	ReadTime(db)
	CTRLoad()
	defer CTRFree()
	router := gin.Default()
	router.Delims("{%", "%}")
	router.LoadHTMLGlob("view/*.html")
	router.StaticFile("/bundle.js", "view/bundle.js")
	router.StaticFile("/bundle.min.js", "view/bundle.min.js")
	router.Static("/images", "view/images")
	router.GET("/ping", Ping)
	router.GET("/time", TimeRange)
	router.GET("/stops", GetAllStops)
	router.GET("/stops/:id", GetStop)
	router.GET("/lines", GetAllLines)
	router.GET("/lines/:id", GetLine)
	router.GET("/index", ShowIndex)
	router.GET("/", ShowIndex)
	router.GET("/stop_stats/:id", GetStopStats)
	router.GET("/xy", GetXY)
	err := router.Run(":8088")
	LogAndQuit(err)
}

func connectDB() *gorm.DB {
	db, err := gorm.Open("sqlite3", "file:data/trippy.db?cache=shared&mode=ro")
	LogAndQuit(err)
	return db
}

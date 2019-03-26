package main

// #cgo CXXFLAGS: -Ictr/libcds/includes/
// #cgo LDFLAGS: -Lctr -lwcsa -lsais -lcds -lrt -lzstd
// #include "cgo.hxx"
import "C"

import (
	"bufio"
	"encoding/csv"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"github.com/paulmach/go.geojson"
	"log"
	"os"
	"os/exec"
	"strings"
)

func logAndQuit(err error) bool {
	if err != nil {
		log.Fatalln(err)
		return false
	} else {
		return true
	}
}

func logAndPanic(err error) bool {
	if err != nil {
		log.Panicln(err)
		return false
	} else {
		return true
	}
}

// A modern language with no function overloading O_o
func logAndPanic2(err error, c *gin.Context) bool {
	if err != nil {
		c.JSON(500, gin.H{
			"message": "shit's on fire yo",
		})
		log.Panicln(err)
		return false
	} else {
		return true
	}
}

type arrayFlags []string

func (i *arrayFlags) String() string {
	return strings.Join((*i)[:], ",")
}

func (i *arrayFlags) Set(value string) error {
	*i = append(*i, value)
	return nil
}

func readCSV() {
	file, err := os.Open("data/madrid_emt/stops.txt")
	logAndQuit(err)
	defer file.Close()
	csvReader := csv.NewReader(bufio.NewReader(file))
	records, err := csvReader.ReadAll()
	logAndQuit(err)
	header := make(map[string]int, len(records[0]))

	for i, h := range records[0] {
		header[h] = i
	}

	fmt.Println(header)

	for _, r := range records[1:] {
		fmt.Println(r)
		fmt.Println(r[header["stop_name"]])
	}
}

func initDB(gtfs []string) {
	//_ = os.Remove("data/trippy.db")
	initCmd := exec.Command("sqlite3", "-init", "data/gtfs_SQL_importer/gtfs_tables.sqlite", "data/trippy.db")
	defer initCmd.Wait()
	initIn, _ := initCmd.StdinPipe()
	defer initIn.Close()
	err := initCmd.Start()
	logAndQuit(err)

	for _, f := range gtfs {
		// Now we want to call a lib written in a real language
		insertCmd := exec.Command("python", "data/gtfs_SQL_importer/import_gtfs_to_sql.py", f, "nocopy")
		out, err := insertCmd.Output()
		logAndQuit(err)
		_ = insertCmd.Wait()
		_, err = initIn.Write(out)
		logAndQuit(err)
		_, _ = initIn.Write([]byte("\n"))
	}
}

type Stop struct {
	Id   string  `db:"stop_id"`
	Name string  `db:"stop_name"`
	Lat  float64 `db:"stop_lat"`
	Lon  float64 `db:"stop_lon"`
}

//var stops = map[string]Stop{}

func returnGeoJSON(c *gin.Context, gjson []byte) {
	c.Data(200, "application/json; charset=utf-8", gjson)
}

func main() {
	var gtfsFlags arrayFlags
	flag.Var(&gtfsFlags, "gtfs", "path to GTFS")
	flag.Parse()

	fmt.Println("Hi from Go, about to calculate distance in C++ ...")
	distance := C.distance_between(1.0, 1.0, 2.0, 2.0)
	fmt.Printf("Go has result, distance is: %v\n", distance)

	if len(gtfsFlags) > 0 {
		initDB(gtfsFlags)
	}

	db, err := sqlx.Connect("sqlite3", "file:data/trippy.db?cache=shared&mode=ro")
	defer db.Close()
	logAndQuit(err)

	stops := []Stop{}
	err = db.Select(&stops, "SELECT stop_id, stop_name, stop_lat, stop_lon FROM gtfs_stops ORDER BY stop_id")
	logAndQuit(err)
	fmt.Println(stops)

	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		fc := geojson.NewFeatureCollection()
		fc.AddFeature(geojson.NewPointFeature([]float64{1, 2}))
		rawJSON, err := fc.MarshalJSON()
		logAndPanic2(err, c)
		returnGeoJSON(c, rawJSON)
	})

	err = router.Run()
	logAndQuit(err)
}

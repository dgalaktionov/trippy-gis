package main

// #cgo CXXFLAGS: -Ictr/libcds/includes/
// #cgo LDFLAGS: -Lctr -lwcsa -lsais -lcds -lrt -lzstd
// #include "cgo.hxx"
import "C"

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"os/exec"
)

func readCSV() {
	file, err := os.Open("data/madrid_emt/stops.txt")
	if err != nil {
		log.Fatalln(err)
	}

	defer file.Close()
	csvReader := csv.NewReader(bufio.NewReader(file))
	records, err := csvReader.ReadAll()
	if err != nil {
		log.Fatalln(err)
	}

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
	_ = os.Remove("data/gtfs_SQL_importer/trippy.db")
	initCmd := exec.Command("sqlite3", "-init", "data/gtfs_SQL_importer/gtfs_tables.sqlite", "data/trippy.db")
	initIn, _ := initCmd.StdinPipe()

	if err := initCmd.Start(); err != nil {
		log.Fatalln(err)
	}

	for _, f := range gtfs {
		// Now we want to call a lib written in a real language
		insertCmd := exec.Command("python", "data/gtfs_SQL_importer/import_gtfs_to_sql.py", f, "nocopy")
		out, err := insertCmd.Output()

		if err != nil {
			log.Fatalln(err)
		}

		_ = insertCmd.Wait()

		if _, err := initIn.Write(out); err != nil {
			log.Fatalln(err)
		}

		_, _ = initIn.Write([]byte("\n"))
	}

	_ = initIn.Close()
	_ = initCmd.Wait()
}

func main() {
	fmt.Println("Hi from Go, about to calculate distance in C++ ...")
	distance := C.distance_between(1.0, 1.0, 2.0, 2.0)
	fmt.Printf("Go has result, distance is: %v\n", distance)

	initDB([]string{"data/madrid_emt", "data/madrid_bus"})

	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	if err := router.Run(); err != nil {
		// pretend I'm handling it...
	}
}

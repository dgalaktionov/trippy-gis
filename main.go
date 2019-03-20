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
)

func initDB() {
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

	for _, r := range records {
		fmt.Println(r)
	}
}

func main() {
	fmt.Println("Hi from Go, about to calculate distance in C++ ...")
	distance := C.distance_between(1.0, 1.0, 2.0, 2.0)
	fmt.Printf("Go has result, distance is: %v\n", distance)

	initDB()

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

package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"os"
	"os/exec"
)

func ReadCSV() {
	file, err := os.Open("data/madrid_emt/stops.txt")
	LogAndQuit(err)
	defer file.Close()
	csvReader := csv.NewReader(bufio.NewReader(file))
	records, err := csvReader.ReadAll()
	LogAndQuit(err)
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

func InitDB(gtfs []string) {
	//_ = os.Remove("data/trippy.db")
	initCmd := exec.Command("sqlite3", "-init", "data/gtfs_SQL_importer/gtfs_tables.sqlite", "data/trippy.db")
	defer initCmd.Wait()
	initIn, _ := initCmd.StdinPipe()
	defer initIn.Close()
	err := initCmd.Start()
	LogAndQuit(err)

	for _, f := range gtfs {
		// Now we want to call a lib written in a real language
		insertCmd := exec.Command("python", "data/gtfs_SQL_importer/import_gtfs_to_sql.py", f, "nocopy")
		out, err := insertCmd.Output()
		LogAndQuit(err)
		_ = insertCmd.Wait()
		_, err = initIn.Write(out)
		LogAndQuit(err)
		_, _ = initIn.Write([]byte("\n"))
	}
}

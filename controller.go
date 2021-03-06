package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/paulmach/go.geojson"
	"time"
)

func returnGeoJSON(c *gin.Context, data []byte) {
	c.Header("Cache-Control: max-age", "86400")
	c.Data(200, "application/json; charset=utf-8", data)
}

func returnGeoJSONFeature(c *gin.Context, fc *geojson.Feature) {
	rawJSON, err := fc.MarshalJSON()
	LogAndPanic2(err, c)
	returnGeoJSON(c, rawJSON)
}

func returnGeoJSONFeatureCollection(c *gin.Context, fc *geojson.FeatureCollection) {
	rawJSON, err := fc.MarshalJSON()
	LogAndPanic2(err, c)
	returnGeoJSON(c, rawJSON)
}

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func TimeRange(c *gin.Context) {
	c.JSON(200, gin.H{
		"start": start_time.Format(time.RFC3339),
		"end":   end_time.Format(time.RFC3339),
	})
}

func GetAllStops(c *gin.Context) {
	fc := geojson.NewFeatureCollection()

	for _, s := range stops {
		if f := s.ToGeoJSON(); f != nil {
			fc.AddFeature(f)
		}
	}

	returnGeoJSONFeatureCollection(c, fc)
}

func GetStop(c *gin.Context) {
	id := Atoi32(c.Param("id"), c)
	s := stops[id].ToGeoJSON()

	if s == nil {
		c.JSON(404, gin.H{
			"message": "Stop not found",
		})
	} else {
		returnGeoJSONFeature(c, s)
	}
}

func GetAllLines(c *gin.Context) {
	fc := geojson.NewFeatureCollection()

	for _, l := range lines {
		if f := l.ToGeoJSON(); f != nil {
			fc.AddFeature(f)
		}
	}

	returnGeoJSONFeatureCollection(c, fc)
}

func GetLine(c *gin.Context) {
	id := c.Param("id")
	s := lines[id].ToGeoJSON()

	if s == nil {
		c.JSON(404, gin.H{
			"message": "Line not found",
		})
	} else {
		returnGeoJSONFeature(c, s)
	}
}

func ShowIndex(c *gin.Context) {
	c.HTML(200, "index.html", gin.H{})
}

func GetStopStats(c *gin.Context) {
	id := Atoi32(c.Param("id"), c)
	fromTime := Atoi32(c.DefaultQuery("from_time", "0"), c)
	toTime := Atoi32(c.DefaultQuery("to_time", "0"), c)

	startCTR := CTRStart(id, fromTime, toTime)
	endCTR := CTREnd(id, fromTime, toTime)
	boardCTR := CTRBoard(id, fromTime, toTime)

	c.JSON(200, gin.H{
		"start":  startCTR,
		"end":    endCTR,
		"switch": boardCTR - startCTR,
		"board":  boardCTR,
	})
}

func GetXY(c *gin.Context) {
	x := Atoi32(c.Query("x"), c)
	y := Atoi32(c.Query("y"), c)
	fromTime := Atoi32(c.DefaultQuery("from_time", "0"), c)
	toTime := Atoi32(c.DefaultQuery("to_time", "0"), c)

	xy := CTRXY(x, y, fromTime, toTime)

	c.JSON(200, gin.H{
		"xy": xy,
	})
}

type TimeWindow struct {
	From uint32 `json:"from"`
	To   uint32 `json:"to"`
}

type XYAreaRequest struct {
	Time       TimeWindow `json:"time"`
	StartStops []uint32   `json:"start_stops"`
	EndStops   []uint32   `json:"end_stops"`
}

func GetXYArea(c *gin.Context) {
	rawRequest, err := c.GetRawData()
	LogAndPanic2(err, c)
	var data XYAreaRequest
	LogAndPanic2(json.Unmarshal(rawRequest, &data), c)

	if data.StartStops == nil || data.EndStops == nil {
		c.JSON(400, gin.H{
			"message": "incomplete query",
		})
	} else {
		fromTime := data.Time.From
		toTime := data.Time.To
		xy := CTRXYArea(data.StartStops, data.EndStops, fromTime, toTime)

		c.JSON(200, gin.H{
			"xy": xy,
		})
	}
}

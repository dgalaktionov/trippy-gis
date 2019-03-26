package main

import (
	"github.com/gin-gonic/gin"
	"github.com/paulmach/go.geojson"
)

func returnGeoJSON(c *gin.Context, fc *geojson.FeatureCollection) {
	rawJSON, err := fc.MarshalJSON()
	LogAndPanic2(err, c)
	c.Data(200, "application/json; charset=utf-8", rawJSON)
}

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func GetAllStops(c *gin.Context) {
	fc := geojson.NewFeatureCollection()

	for _, s := range stops {
		fc.AddFeature(s.ToGeoJSON())
	}

	returnGeoJSON(c, fc)
}

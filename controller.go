package main

import (
	"github.com/gin-gonic/gin"
	"github.com/paulmach/go.geojson"
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

func GetAllStops(c *gin.Context) {
	fc := geojson.NewFeatureCollection()

	for _, s := range stops {
		fc.AddFeature(s.ToGeoJSON())
	}

	returnGeoJSONFeatureCollection(c, fc)
}

func GetStop(c *gin.Context) {
	id := c.Param("id")
	returnGeoJSONFeature(c, stops[id].ToGeoJSON())
}

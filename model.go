package main

import (
	"github.com/paulmach/go.geojson"
	"time"
)

type Stop struct {
	//gorm.Model
	ID   uint32 `gorm:"column:ctr_id"`
	Name string
	Lat  float64
	Lon  float64
}

type Journey struct {
	//gorm.Model
	LineId    string `gorm:"primary_key"`
	JourneyId uint32 `gorm:"primary_key"`
	StartDate time.Time
}

type Geometry interface {
	ToGeoJSON() *geojson.Feature
}

func (s Stop) ToGeoJSON() *geojson.Feature {
	f := geojson.NewPointFeature([]float64{s.Lon, s.Lat})
	f.Properties["id"] = s.ID
	f.Properties["name"] = s.Name
	return f
}

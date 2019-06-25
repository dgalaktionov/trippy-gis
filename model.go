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

type Line struct {
	ID    string
	Name  string
	Stops []Stop `gorm:"many2many:line_stop;association_foreignkey:ctr_id;jointable_foreignkey:line_id;association_jointable_foreignkey:stop_ctr_id;"`
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

func (l Line) ToGeoJSON() *geojson.Feature {
	coords := make([][]float64, len(l.Stops))
	stopIds := make([]uint32, len(l.Stops))

	for i, s := range l.Stops {
		coords[i] = []float64{s.Lon, s.Lat}
		stopIds[i] = s.ID
	}

	f := geojson.NewLineStringFeature(coords)
	f.Properties["id"] = l.ID
	f.Properties["name"] = l.Name
	f.Properties["stops"] = stopIds
	return f
}

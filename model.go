package main

import (
	"github.com/paulmach/go.geojson"
)

type Stop struct {
	Id   uint32  `db:"ctr_id"`
	Name string  `db:"name"`
	Lat  float64 `db:"lat"`
	Lon  float64 `db:"lon"`
}

type Geometry interface {
	ToGeoJSON() *geojson.Feature
}

func (s Stop) ToGeoJSON() *geojson.Feature {
	f := geojson.NewPointFeature([]float64{s.Lon, s.Lat})
	f.Properties["id"] = s.Id
	f.Properties["name"] = s.Name
	return f
}

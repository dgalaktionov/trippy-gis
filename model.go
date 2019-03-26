package main

import "github.com/paulmach/go.geojson"

type Stop struct {
	Id   string  `db:"stop_id"`
	Name string  `db:"stop_name"`
	Lat  float64 `db:"stop_lat"`
	Lon  float64 `db:"stop_lon"`
}

type Geometry interface {
	ToGeoJSON() *geojson.Feature
}

func (s Stop) ToGeoJSON() *geojson.Feature {
	f := geojson.NewPointFeature([]float64{s.Lat, s.Lon})
	f.Properties["id"] = s.Id
	f.Properties["name"] = s.Name
	return f
}

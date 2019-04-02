package main

import (
	"github.com/paulmach/go.geojson"
)

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
	f := geojson.NewPointFeature([]float64{s.Lon, s.Lat})

	if id, ok := stop_id_to_ctr[s.Id]; ok {
		f.Properties["id"] = id
	} else {
		return nil
	}

	f.Properties["name"] = s.Name
	return f
}

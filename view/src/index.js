import "./index.css";
import L from "leaflet";
import LContextMenu from "leaflet-contextmenu";
import LPolylineDecorator from "leaflet-polylinedecorator";
import RectSelect from "./Map.RectSelect";
import Vue from "vue";
import Hello from "./components/Hello.vue";
import StopPopup from "./components/StopPopup.vue";
import XYPopup from "./components/XYPopup.vue";
import XYAreaPopup from "./components/XYAreaPopup.vue";
import DateTimePicker from "./components/DateTimePicker.vue";
import TimeFilter from "./components/TimeFilter.vue";
import StopSearch from "./components/StopSearch.vue";
import LineFilter from "./components/LineFilter.vue";
import Datepicker from "vuejs-datepicker";
import VueTimepicker from "vuejs-timepicker";
import { PulseLoader } from "vue-spinner/dist/vue-spinner";
import VueRouter from "vue-router";
import Autocomplete from "vue-single-select";
import getty from "./getty";

const router = new VueRouter({mode: "history"});

window.Vue = Vue;
Vue.use(require("vue-async-computed").default);
Vue.use(VueRouter);

let app = new Vue({
    el: "#app",
    router,
    components: {LineFilter, StopPopup, XYPopup, XYAreaPopup, DateTimePicker, TimeFilter, StopSearch,
        Datepicker, PulseLoader, VueTimepicker, Autocomplete},
    data: {
        minDate: new Date(0),
        maxDate: null,
        selectedDate: {
            startDate: null,
            endDate: null,
        },
        selectedStop: {id: 0, name: ""},
        selectedStops: [],
        selectedBounds: null,
        arrow: null,
        startStop: null,
        endStop: null,
        startLine: null,
        endLine: null,
        xyStops: {
            start: null,
            end: null
        },
        stops: {},
        lines: {},
        startStops: [],
        endStops: [],
        startLines: [],
        endLines: [],
        stopMarkers: {},
        contextStop: null
    },
    methods: {
        selectStop(s, isEndStop) {
            if (!s) {
                return;
            }

            if (this.selectedStops.length > 0) {
                this.clearSelectedStops();
            }

            if (isEndStop) {
                this.endStop = s;
            } else {
                this.startStop = s;
            }

            if (this.startStop && this.endStop) {
                let originMarker = this.stopMarkers[this.startStop.id];
                let destMarker = this.stopMarkers[this.endStop.id];

                let [arrow, arrowDecorator] = this.makeArrow(originMarker.getLatLng(), destMarker.getLatLng());

                arrow.bindPopup(() => {
                    return app.$refs.hiddenXYPopup.$el;
                }, { maxWidth: "auto" });

                //setTimeout(() => arrow.openPopup(), 500);
                arrow.openPopup();
                applySelectedMarkerStyle(originMarker);
                applySelectedMarkerStyle(destMarker);
            } else {
                let marker = this.stopMarkers[s.id];

                if (marker && marker._map) {
                    marker._map.setView(marker.getLatLng());
                    marker.openPopup();
                }
            }
        },
        selectLine(l, isEndLine) {
            if (isEndLine) {
                if (!l) {
                    this.endStops = Object.values(this.stops);
                } else {
                    this.endStops = l.stops.map(sid => app.stops[sid]);
                }

            } else {
                if (!l) {
                    this.startStops = Object.values(this.stops);
                } else {
                    this.startStops = l.stops.map(sid => app.stops[sid]);
                }
            }
        },
        secondsFromMinDate(d) {
            if (this.minDate) {
                return (d.getTime() - this.minDate.getTime())/1000;
            } else {
                return -1;
            }
        },

        makeArrow(origin, dest) {
            let arrow = L.polyline([origin, dest], {color: "red", weight: 3, renderer: canvasRenderer}).addTo(map);
            let arrowDecorator = L.polylineDecorator(arrow, {
                patterns: [
                    {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false,
                            pathOptions: {color: "red", weight: 3, stroke: true, renderer: canvasRenderer}})}
                ]
            }).addTo(map);

            arrow.on("popupclose", () => {
                arrow.removeFrom(map);
                arrowDecorator.removeFrom(map);
                this.clearSelectedStops();
            });

            return [arrow, arrowDecorator];
        },

        selectStops(bounds) {
            let selectedIds = [];

            Object.keys(this.stopMarkers).forEach(sid =>  {
                let marker = this.stopMarkers[sid];

                if (bounds.contains(marker._latlng)) {
                    applySelectedMarkerStyle(marker);
                    selectedIds.push(parseInt(sid, 10));
                }
            });

            if (selectedIds.length > 0) {
                if (this.selectedStops.length > 0) {
                    let [arrow, arrowDecorator] = this.makeArrow(this.selectedBounds.getCenter(), bounds.getCenter());

                    arrow.bindPopup(() => {
                        app.$refs.hiddenXYAreaPopup.$props.startStops = this.selectedStops;
                        app.$refs.hiddenXYAreaPopup.$props.endStops = selectedIds;
                        return app.$refs.hiddenXYAreaPopup.$el;
                    }, { maxWidth: "auto" });

                    setTimeout(() => arrow.openPopup(), 500);

                    console.log("query! " + this.selectedStops + selectedIds);
                } else {
                    this.selectedStops = selectedIds;
                    this.selectedBounds = bounds;
                }
            }
        },

        clearSelectedStops() {
            Object.values(this.stopMarkers).forEach(applyDefaultMarkerStyle);
            this.selectedStops = [];
        }
    }
});

function applySelectedMarkerStyle(marker) {
    marker.setStyle({color: "#f00"});
}

function applyDefaultMarkerStyle(marker) {
    marker.setStyle({color: "#3388ff"});
}

let map = L.map('map', {
    preferCanvas: true,
    contextmenu: true,
    boxZoom: false,
}).setView([40.42, -3.70], 13)
    .on("boxzoomend", function(e) {
        app.selectStops(e.boxZoomBounds);
    });
let canvasRenderer = L.canvas({ padding: 0.2 });

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
 */

L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: process.env.THUNDERFOREST_KEY,
    maxZoom: 22
}).addTo(map);

let stopLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(() => {
            if (app.selectedStops.length > 0) {
                app.clearSelectedStops();
            }

            applySelectedMarkerStyle(layer);
            app.selectedStop = feature.properties;
            return app.$refs.hiddenStopPopup.$el;
        }, {
            maxWidth: "auto"
        }).on("popupclose", () => applyDefaultMarkerStyle(layer));
    },
    pointToLayer: function(feature, coords) {
        app.stopMarkers[feature.properties.id] = L.circleMarker(coords, {
            radius: 3,
            fillOpacity: 1,
            renderer: canvasRenderer,
            contextmenu: true,
            contextmenuItems: [
                {
                    text: feature.properties.name,
                    index: 0
                },
                {
                    separator: true,
                    index: 1
                },
                {
                    text: "Trips from this stop",
                    callback: () => {app.startStop = feature.properties;},
                    index: 2
                },
                {
                    text: "Trips to this stop",
                    callback: () => {app.endStop = feature.properties;},
                    index: 3
                }
            ]
        });

        return app.stopMarkers[feature.properties.id];
    }
}).addTo(map);

let lineLayer = L.geoJSON(null, {
    style: function (feature) {
        return {color: "#"+((1<<24)*Math.random()|0).toString(16)}
    }
}).addTo(map);

map.on("contextmenu.show", (e) => {
    if (e.sourceTarget && e.sourceTarget.setStyle) {
        app.contextStop = e.sourceTarget.feature;
        applySelectedMarkerStyle(e.sourceTarget);
    }
});

map.on("contextmenu.hide", (e) => {
    if (app.contextStop) {
        applyDefaultMarkerStyle(app.stopMarkers[app.contextStop.properties.id]);
        //app.contextStop = null;
    }
});


var stopsResolver = null;
let stopsPromise = new Promise(function(resolve, reject) {
    stopsResolver = resolve;
});

var linesResolver = null;
let linesPromise = new Promise(function(resolve, reject) {
    linesResolver = resolve;
});

getty.jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
    fc.features.map(f => f.properties).forEach(s => app.stops[s.id] = s);
    app.startStops = Object.values(app.stops);
    app.endStops = Object.values(app.stops);

    /*
    app.stops.sort((f1,f2) => {
        if (f1.name < f2.name) {
            return -1;
        } else if (f1.name > f2.name) {
            return 1;
        } else {
            return 0;
        }
    });
     */

    stopsResolver();
});

getty.jsonGet("/lines").then(function (fc) {
    //lineLayer.addData(fc);
    fc.features.map(f => f.properties).forEach(l => app.lines[l.id] = l);
    app.startLines = Object.values(app.lines);
    app.endLines = Object.values(app.lines);

    linesResolver();
});

getty.jsonGet("/time").then(function (timeRange) {
    app.minDate = new Date(timeRange.start);
    let maxDate = new Date(timeRange.end);
    maxDate.setHours(23,59,59);
    app.maxDate = maxDate;
});

Promise.all([stopsPromise, linesPromise]).then(function() {
    Object.values(app.stops).forEach(s => s.lines = []);
    Object.values(app.lines).forEach(l => l.stops.forEach(sid => app.stops[sid].lines.push(l)));
});

window.app = app;
window.map = map;

window.testXY = function() {
    getty.getXYArea().then(console.log);
};

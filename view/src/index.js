import "./index.css";
import L from "leaflet";
import LContextMenu from "leaflet-contextmenu";
import Vue from "vue";
import Hello from "./components/Hello.vue";
import StopPopup from "./components/StopPopup.vue";
import XYPopup from "./components/XYPopup.vue";
import DateTimePicker from "./components/DateTimePicker.vue";
import TimeFilter from "./components/TimeFilter.vue";
import StopSearch from "./components/StopSearch.vue";
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
    components: {StopPopup, XYPopup, DateTimePicker, TimeFilter, StopSearch, Datepicker, PulseLoader, VueTimepicker, Autocomplete},
    data: {
        minDate: new Date(0),
        maxDate: null,
        selectedDate: {
            startDate: null,
            endDate: null,
        },
        selectedStop: {id: 0, name: ""},
        startStop: null,
        endStop: null,
        xyStops: {
            start: null,
            end: null
        },
        stops: [],
        stopMarkers: {},
        contextStop: null
    },
    methods: {
        selectStop(s, isEndStop) {
            if (!s) {
                return;
            }

            if (isEndStop) {
                this.endStop = s;
            } else {
                this.startStop = s;
            }

            if (this.startStop && this.endStop) {
                let x = this.stopMarkers[this.startStop.id].getLatLng();
                let y = this.stopMarkers[this.endStop.id].getLatLng();

                let line = L.polyline([x,y], {
                    color: "red",
                    weight: 3,
                    renderer: canvasRenderer,
                }).addTo(map).bindPopup(() => {
                    return app.$refs.hiddenXYPopup.$el;
                }, {maxWidth: "auto"}).openPopup();
                line.on("popupclose", () => line.removeFrom(map));
            } else {
                let marker = this.stopMarkers[s.id];

                if (marker && marker._map) {
                    marker._map.setView(marker.getLatLng());
                    marker.openPopup();
                }
            }
        },
        secondsFromMinDate(d) {
            if (this.minDate) {
                return (d.getTime() - this.minDate.getTime())/1000;
            } else {
                return -1;
            }
        }
    }
});

let map = L.map('map', {
    preferCanvas: true,
    contextmenu: true,
}).setView([40.42, -3.70], 13);
let canvasRenderer = L.canvas({ padding: 0.2 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let stopLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(() => {
            layer.setStyle({color: "#f00"});
            app.selectedStop = feature.properties;
            return app.$refs.hiddenStopPopup.$el;
        }, {
            maxWidth: "auto"
        }).on("popupclose", () => layer.setStyle({color: "#3388ff"}));
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

map.on("contextmenu.show", (e) => {
    if (e.sourceTarget && e.sourceTarget.setStyle) {
        app.contextStop = e.sourceTarget.feature;
        e.sourceTarget.setStyle({color: "#f00"})
    }
});

map.on("contextmenu.hide", (e) => {
    if (app.contextStop) {
        app.stopMarkers[app.contextStop.properties.id].setStyle({color: "#3388ff"});
        //app.contextStop = null;
    }
});

getty.jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
    app.stops = fc.features.map(f => f.properties);
    app.stops.sort((f1,f2) => {
        if (f1.name < f2.name) {
            return -1;
        } else if (f1.name > f2.name) {
            return 1;
        } else {
            return 0;
        }
    });
});


getty.jsonGet("/time").then(function (timeRange) {
    app.minDate = new Date(timeRange.start);
    let maxDate = new Date(timeRange.end);
    maxDate.setHours(23,59,59);
    app.maxDate = maxDate;
});

window.app = app;
window.map = map;

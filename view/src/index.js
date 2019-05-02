require ("./index.css");
let L = require("leaflet");
let LContextMenu = require("leaflet-contextmenu");
let Vue = require("vue");
let Hello = require("./components/Hello.vue");
let StopPopup = require("./components/StopPopup.vue");
let DateTimePicker = require("./components/DateTimePicker.vue");
let TimeFilter = require("./components/TimeFilter.vue");
let StopSearch = require("./components/StopSearch.vue");
let Datepicker = require("vuejs-datepicker");
let VueTimepicker = require("vuejs-timepicker");
let PulseLoader = require("vue-spinner/dist/vue-spinner.min").PulseLoader;
let VueRouter = require("vue-router");
let Autocomplete = require("./node_modules/vue-single-select/dist/VueSingleSelect.vue");
let getty = require("./getty");

const router = new VueRouter({mode: "history"});

window.Vue = Vue;
Vue.use(require('vue-async-computed'));
Vue.use(VueRouter);

let app = new Vue({
    el: '#app',
    router,
    components: {Hello, StopPopup, DateTimePicker, TimeFilter, StopSearch, Datepicker, PulseLoader, VueTimepicker, Autocomplete},
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
        stopMarkers: {}
    },
    methods: {
        selectStop(s, isEndStop) {
            console.log(s);

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
                    return "Number of X to Y trips!"
                }).openPopup();
                line.on("popupclose", () => line.removeFrom(map));
            } else {
                let marker = this.stopMarkers[s.id];

                if (marker && marker._map) {
                    marker._map.setView(marker.getLatLng());
                    marker.openPopup();
                }
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


getty.jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
    app.stops = fc.features.map(f => f.properties);
});


getty.jsonGet("/time").then(function (timeRange) {
    app.minDate = new Date(timeRange.start);
    let maxDate = new Date(timeRange.end);
    maxDate.setHours(23,59,59);
    app.maxDate = maxDate;
});

window.app = app;
window.map = map;

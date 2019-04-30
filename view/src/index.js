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
        selectedStop: {properties: {id: 0, name: ""}},
        xyStops: {
            start: null,
            end: null
        },
        stops: []
    },
    methods: {
        xyFrom(e) {
            console.log(e);
        },
        xyTo(e) {
            console.log(e);
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
            app.selectedStop = feature;
            return app.$refs.hiddenStopPopup.$el;
        }, {
            maxWidth: "auto"
        }).on("popupclose", () => layer.setStyle({color: "#3388ff"}));
    },
    pointToLayer: function(feature, coords) {
        return L.circleMarker(coords, {
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
                    callback: () => app.xyFrom(feature),
                    index: 2
                },
                {
                    text: "Trips to this stop",
                    callback: () => app.xyTo(feature),
                    index: 3
                }
            ]
        })
    }
}).addTo(map);


getty.jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
    app.stops = fc.features;
});


getty.jsonGet("/time").then(function (timeRange) {
    app.minDate = new Date(timeRange.start);
    let maxDate = new Date(timeRange.end);
    maxDate.setHours(23,59,59);
    app.maxDate = maxDate;
});

window.app = app;
window.map = map;

require ("./index.css");
let L = require("leaflet");
let Vue = require("vue");
let Hello = require("./components/Hello.vue");
let StopPopup = require("./components/StopPopup.vue");
let Datepicker = require("vuejs-datepicker");
let VueTimepicker = require("vuejs-timepicker");
let PulseLoader = require("vue-spinner/dist/vue-spinner.min").PulseLoader;
let getty = require("./getty");

window.Vue = Vue;
Vue.use(require('vue-async-computed'));

let app = new Vue({
    el: '#app',
    components: {Hello, StopPopup, Datepicker, PulseLoader, VueTimepicker},
    data: {
        disabledDates: {
            to: undefined,
            from: undefined,
        },
        selectedDate: null,
        selectedTime: {
            HH: "08",
            mm: "00"
        },
    },
    methods: {
        secondsFromMinDate(d) {
            if (this.disabledDates.to) {
                return (d.getTime() - this.disabledDates.to.getTime())/1000;
            } else {
                return -1;
            }
        }
    }
});

let map = L.map('map', {
    preferCanvas: true
}).setView([40.42, -3.70], 13);
let canvasRenderer = L.canvas({ padding: 0.2 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let stopLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(() => {
            app.$refs.hiddenStopPopup.stop = feature;
            return app.$refs.hiddenStopPopup.$el;
        }, {
            maxWidth: "auto"
        });
    },
    pointToLayer: function(feature, coords) {
        return L.circleMarker(coords, {
            radius: 3,
            fillOpacity: 1,
            renderer: canvasRenderer,
        })
    }
}).addTo(map);

getty.jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
});


getty.jsonGet("/time").then(function (timeRange) {
    app.disabledDates.to = new Date(timeRange.start);
    let maxDate = new Date(timeRange.end);
    maxDate.setHours(23,59,59);
    app.disabledDates.from = maxDate;
});


window.app = app;
window.VueTimepicker = VueTimepicker;

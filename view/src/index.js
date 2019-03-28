let css = require ("./index.css");
let L = require("leaflet");

function simplyGet(url) {
    return new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(req);
            }
        };

        req.onerror = function() {
            reject(req);
        };

        req.send();
    });
}


let map = L.map('map', {
    preferCanvas: true
}).setView([40.42, -3.70], 13);
let canvasRenderer = L.canvas({ padding: 0.2 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let stopLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.name);
    },
    pointToLayer: function(feature, coords) {
        return L.circleMarker(coords, {
            radius: 3,
            fillOpacity: 1,
            renderer: canvasRenderer,
        })
    }
}).addTo(map);

simplyGet("/stops").then(function (text) {
    return text;
}).catch(function (req) {
    console.log("Failed request (" + req.status + "): " + req.response);
}).then(function (text) {
    return JSON.parse(text);
}).catch(function (err) {
    console.log(err);
    return [];
}).then(function (fc) {
    //console.log(fc);
    stopLayer.addData(fc);
});

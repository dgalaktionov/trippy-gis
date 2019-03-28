var css = require ("./index.css");
var L = require("leaflet");

function simplyGet(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
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


var map = L.map('map', {
    preferCanvas: true
}).setView([51.505, -0.09], 13);
var canvasRenderer = L.canvas({ padding: 0.5 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

var stopLayer = L.geoJSON(null, {
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

require ("./index.css");
let L = require("leaflet");
require("leaflet-toolbar");

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

function errorGet(req) {
    console.log("Failed request (" + req.status + "): " + req.response);
}

function jsonGet(url) {
    return simplyGet(url).then(function (text) {
        return text;
    }).catch(errorGet).then(function (text) {
        return JSON.parse(text);
    }).catch(function (err) {
        console.log(err);
        return [];
    });
}

let map = L.map('map', {
    preferCanvas: true
}).setView([40.42, -3.70], 13);
let canvasRenderer = L.canvas({ padding: 0.2 });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let StopAction = L.Toolbar2.Action.extend({
   options: {
       toolbarIcon: {
           html: "&#9873;",
           tooltip: "Stop Action"
       }
   },

   addHooks: function() {
       jsonGet("/start/" + this.feature.properties.id).then(function (data) {
           console.log(data);
       });
   }
});

function newStopAction(feature) {
    return StopAction.extend({
        feature: feature
    });
}

let stopLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.on("click", function(e) {
           new L.Toolbar2.Popup(e.latlng, {
               className: "stopPopupList",
               actions: [newStopAction(feature)]
           }).addTo(map);

           let p = document.querySelector("div.stopPopupList");
           let t = document.createElement("div");
           let t2 = document.createElement("div");
           t.className = "trippyPopupTitle";
           t2.className = "trippyText";
           t2.textContent = feature.properties.name;
           t.appendChild(t2);
           p.insertBefore(t,p.firstChild);
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

jsonGet("/stops").then(function (fc) {
    stopLayer.addData(fc);
});

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
        return {};
    });
}

function getStopStats(idStop, fromTime, toTime) {
    var url = "/stop_stats/" + idStop;
    let params = {};

    if (fromTime && fromTime >= 0) {
        params["from_time"] = fromTime;
    }

    if (toTime && toTime >= 0) {
        params["to_time"] = toTime;
    }

    let paramsString = new URLSearchParams(params).toString();

    if (paramsString) {
        url += "?" + paramsString;
    }

    return jsonGet(url);
}

function getXY(x, y, fromTime, toTime) {
    var url = "/xy";
    let params = {x: x, y: y};

    if (fromTime && fromTime >= 0) {
        params["from_time"] = fromTime;
    }

    if (toTime && toTime >= 0) {
        params["to_time"] = toTime;
    }

    let paramsString = new URLSearchParams(params).toString();

    if (paramsString) {
        url += "?" + paramsString;
    }

    return jsonGet(url);
}

module.exports = {simplyGet, jsonGet, getStopStats, getXY};

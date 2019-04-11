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

module.exports = {simplyGet, jsonGet};
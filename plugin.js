
function loadJSON(file, callback) {
    var requestObject = new XMLHttpRequest();
    requestObject.overrideMimeType("application/json");
    requestObject.open('GET', file, true);
    requestObject.onreadystatechange = function () {
        if (requestObject.readyState == 4 && requestObject.status == "200") {
            callback(requestObject.responseText);
        }
    };
    requestObject.send(null);
}

function callback(response) {
    var actualJSON = JSON.parse(response);

    for (var i = 0; i < actualJSON.length; i++) {
        //Create table using divs
        var content = document.getElementById("divRows");
        var div = document.createElement("div");
        div.setAttribute("class", "divRow");
        var divCell1 = document.createElement("div");
        var divCell2 = document.createElement("div");
        var divCell3 = document.createElement("div");
        var divCell4 = document.createElement("div");
        var divCell5 = document.createElement("div");
        divCell1.setAttribute("class", "divCell");
        divCell2.setAttribute("class", "divCell");
        divCell3.setAttribute("class", "divCell");
        divCell4.setAttribute("class", "divCell");
        divCell5.setAttribute("class", "divCell");
        var id = document.createTextNode(actualJSON[i].id);
        var name = document.createTextNode(actualJSON[i].name);
        var mobile = document.createTextNode(actualJSON[i].mobile);
        var dob = document.createTextNode(actualJSON[i].dob);
        var address = document.createTextNode(actualJSON[i].address);
        divCell1.appendChild(id);
        divCell2.appendChild(name);
        divCell3.appendChild(mobile);
        divCell4.appendChild(dob);
        divCell5.appendChild(address);
        div.appendChild(divCell1);
        div.appendChild(divCell2);
        div.appendChild(divCell3);
        div.appendChild(divCell4);
        div.appendChild(divCell5);
        content.appendChild(div);
    }
}

(function ($) {
    $.fn.buildTable = function (options) {
        // Default options
        var settings = $.extend({
            source: "http://localhost/plugin/data.json"
        }, options);

        loadJSON(settings.source, callback);
    };
}(jQuery));
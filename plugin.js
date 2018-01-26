var sortDescending = true, sort = false, sortTerm, header = true;
function loadJSON(file, callback) {
    var requestObject = new XMLHttpRequest();
    requestObject.overrideMimeType("application/json");
    requestObject.open('GET', file, true);
    requestObject.onreadystatechange = function () {
        if (requestObject.readyState == 4 && requestObject.status == "200") {
            if (header) {
                header = false;
                buildHeader(requestObject.responseText);
            }
            callback(requestObject.responseText, false);
        }
    };
    requestObject.send(null);
}
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function buildHeader(response) {
    var result = JSON.parse(response);
    var table = document.getElementById("results");
    var head = document.createElement("div");
    setAttributes(head, { "class": "theader" });

    // Building head labels for each column
    $.each(result[0], function (key, value) {
        var col = document.createElement("div");
        setAttributes(col, { "class": "table_header", "id": key, "style": "cursor: pointer;" });
        var colText = document.createTextNode(key + " ");
        var spanElement = document.createElement("span");
        setAttributes(spanElement, { "class": "glyphicon glyphicon-sort" });
        col.appendChild(colText);
        col.appendChild(spanElement);
        head.appendChild(col);

    });

    table.appendChild(head);

    var divRow = document.createElement("div");
    setAttributes(divRow, { "class": "table_row" });
    //Building search input box for each column
    $.each(result[0], function (key, value) {
        var divSmall = document.createElement("div");
        setAttributes(divSmall, { "class": "table_small" });
        var tableCell = document.createElement("div");
        setAttributes(tableCell, { "class": "table_cell" });
        var topNav = document.createElement("div");
        setAttributes(topNav, { "class": "topnav" });
        var inputSearch = document.createElement("input");
        setAttributes(inputSearch, { "type": "text", "placeholder": "Search", "id": key + "Search" });
        topNav.appendChild(inputSearch);
        divSmall.appendChild(tableCell);
        divSmall.appendChild(topNav);
        divRow.appendChild(divSmall);
    });
    table.appendChild(divRow);
    // Attatching sort and search functionality to each column
    $.each(result[0], function (key, value) {
        $("#" + key).customSort({ sortTerm: key });
        $("#" + key + "Search").customSearch({ searchTerm: key });
    });
}

function callback(response, search) {
    var actualJSON = JSON.parse(response);
    var content = document.getElementById("results");

    if (search) {
        while (document.getElementsByClassName("data")[0]) {
            content.removeChild(document.getElementsByClassName("data")[0]);
        }

    }

    if (sort) {
        while (document.getElementsByClassName("data")[0]) {
            content.removeChild(document.getElementsByClassName("data")[0]);
        }
        actualJSON.sort(function (one, another) {
            if (sortDescending) {
                return one[sortTerm] < another[sortTerm];
            }
            else {
                return one[sortTerm] > another[sortTerm];
            }
        });
        if (sortDescending) sortDescending = false;
        else sortDescending = true;
        sort = false;
    }



    for (var i = 0; i < actualJSON.length; i++) {
        //Create table using divs
        var table = document.getElementById("results");

        var div = document.createElement("div");
        div.setAttribute("class", "table_row data");

        $.each(actualJSON[0], function (key, value) {

            var smallDiv = document.createElement("div");
            smallDiv.setAttribute("class", "table_small");
            var cellDiv = document.createElement("div");
            cellDiv.setAttribute("class", "table_cell");
            var tempObj = actualJSON[i];
            var textNode = document.createTextNode(tempObj[key]);
            cellDiv.appendChild(textNode);
            smallDiv.appendChild(cellDiv);
            div.appendChild(smallDiv);
        });

        table.appendChild(div);
    }
}


(function ($) {
    $.fn.buildTable = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json"
        }, options);
        loadJSON(settings.source, callback);
    };

    $.fn.customSort = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json",
            sortTerm: "youCanOverideHere"
        }, options);

        this.click(function () {
            sort = true;
            sortTerm = settings.sortTerm;
            loadJSON(settings.source, callback);
        });
    };

    $.fn.customSearch = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json",
            searchTerm: "youCanOverideHere"
        }, options);

        $(this).keyup(function () {
            // If search box gets empty
            if (!this.value) {
                var content = document.getElementById("results");
                while (document.getElementsByClassName("data")[0]) {
                    content.removeChild(document.getElementsByClassName("data")[0]);
                }
                loadJSON(settings.source, callback);
            }
        });

        $(this).autocomplete({

            source: function (req, res) {

                var regex = new RegExp(req.term, 'i');
                $.ajax({
                    url: settings.source,
                    dataType: "json",
                    type: "GET",
                    data: {
                        term: req.term
                    },
                    success: function (data) {
                        var obj = [];

                        res($.map(data, function (item) {

                            if (req.term.includes(">=")) {
                                if (item[settings.searchTerm] >= req.term.substring(2)) {
                                    obj.push(item);
                                    callback(JSON.stringify(obj), true);
                                }
                            }
                            else if (req.term.includes("<=")) {
                                if (item[settings.searchTerm] <= req.term.substring(2)) {
                                    obj.push(item);
                                    callback(JSON.stringify(obj), true);
                                }
                            }
                            else if (req.term.includes("<")) {
                                if (item[settings.searchTerm] < req.term.substring(1)) {
                                    obj.push(item);
                                    callback(JSON.stringify(obj), true);
                                }
                            }
                            else if (req.term.includes(">")) {
                                console.log("equal");
                                if (item[settings.searchTerm] > req.term.substring(1)) {
                                    obj.push(item);
                                    callback(JSON.stringify(obj), true);
                                }
                            }
                            else if (regex.test(item[settings.searchTerm])) {
                                obj.push(item);
                                callback(JSON.stringify(obj), true);
                            }

                        }));
                    },
                    error: function (xhr) {

                    }
                });
            },
            select: function (event, ui) {

            }

        });

    };
}(jQuery));



var sortDescending = true, sort = false;
var obj = {};
function loadJSON(file, callback) {
    var requestObject = new XMLHttpRequest();
    requestObject.overrideMimeType("application/json");
    requestObject.open('GET', file, true);
    requestObject.onreadystatechange = function () {
        if (requestObject.readyState == 4 && requestObject.status == "200") {
            callback(requestObject.responseText,false);
        }
    };
    requestObject.send(null);
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
            console.log(obj.id);
            if (sortDescending) {
                return one[obj.id] < another[obj.id];
            }
            else {
                return one[obj.id] > another[obj.id];
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

        var smallDiv1 = document.createElement("div");
        smallDiv1.setAttribute("class", "table_small");
        var cellDiv1 = document.createElement("div");
        cellDiv1.setAttribute("class", "table_cell");
        var textNode1 = document.createTextNode(actualJSON[i].id);
        cellDiv1.appendChild(textNode1);
        smallDiv1.appendChild(cellDiv1);

        var smallDiv2 = document.createElement("div");
        smallDiv2.setAttribute("class", "table_small");
        var cellDiv2 = document.createElement("div");
        cellDiv2.setAttribute("class", "table_cell");
        var textNode2 = document.createTextNode(actualJSON[i].name);
        cellDiv2.appendChild(textNode2);
        smallDiv2.appendChild(cellDiv2);

        var smallDiv3 = document.createElement("div");
        smallDiv3.setAttribute("class", "table_small");
        var cellDiv3 = document.createElement("div");
        cellDiv3.setAttribute("class", "table_cell");
        var textNode3 = document.createTextNode(actualJSON[i].mobile);
        cellDiv3.appendChild(textNode3);
        smallDiv3.appendChild(cellDiv3);

        var smallDiv4 = document.createElement("div");
        smallDiv4.setAttribute("class", "table_small");
        var cellDiv4 = document.createElement("div");
        cellDiv4.setAttribute("class", "table_cell");
        var textNode4 = document.createTextNode(actualJSON[i].salary);
        cellDiv4.appendChild(textNode4);
        smallDiv4.appendChild(cellDiv4);

        div.appendChild(smallDiv1);
        div.appendChild(smallDiv2);
        div.appendChild(smallDiv3);
        div.appendChild(smallDiv4);

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

    $.fn.sortNumber = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json"
        }, options);

        this.click(function () {
            sort = true;
            obj = this;
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
            if (!this.value) {
                var content = document.getElementById("results");
                while (document.getElementsByClassName("data")[0]) {
                    content.removeChild(document.getElementsByClassName("data")[0]);
                }
                loadJSON(settings.source,callback);
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
                            if (regex.test(item[settings.searchTerm])) {
                                obj.push(item);
                                console.log(settings.searchTerm);
                                
                                callback(JSON.stringify(obj),true);

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


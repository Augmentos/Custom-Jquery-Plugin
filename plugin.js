var sortDescending = true, sort = false, sortTerm, header = true, filter = false, filterParam;
var filterObject = {}, gResponse;

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
            gResponse = requestObject.responseText;
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

function customFilter(response) {

}


function buildHeader(response) {
    var result = JSON.parse(response);
    var table = document.getElementById("results");
    var head = document.createElement("div");
    setAttributes(head, { "class": "theader" });

    // Building head labels for each column
    $.each(result[0], function (key, value) {
        var col = document.createElement("div");
        setAttributes(col, { "class": "table_header", "style": "cursor: pointer;" });

        var divModal = document.createElement("div");
        var contentModal = document.createElement("div");
        var dialogModal = document.createElement("div");
        setAttributes(dialogModal, { "class": "modal-dialog" });
        setAttributes(contentModal, { "class": "modal-content " });
        setAttributes(divModal, { "class": "modal fade ", "id": key + "Modal", "role": "dialog", "tabindex": "-1", "aria-labelledBy": "example", "aria-hidden": "true" });
        var modalHeader = document.createElement("div");
        setAttributes(modalHeader, { "class": "modal-header" });
        var headerTitle = document.createElement("h3");
        setAttributes(headerTitle, { "class": "modal-title" });
        var headerText = document.createTextNode("Filter");
        headerTitle.appendChild(headerText);
        var modalButton = document.createElement("button");
        setAttributes(modalButton, { "type": "button", "class": "close", "data-dismiss": "modal", "aria-label": "Close" });
        var spanClose = document.createElement("span");
        setAttributes(spanClose, { "aria-hidden": "true" });
        spanClose.innerHTML = "&times;";
        modalButton.appendChild(spanClose);
        var modalBody = document.createElement("div");
        setAttributes(modalBody, { "class": "modal-body" });

        var lookup = {};
        $(result).each(function (idx, obj) {

            $(obj).each(function (term, value) {
                console.log("asda");
                if (!(value[key] in lookup)) {

                    lookup[value[key]] = 1;

                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.name = key + "Name";
                    checkbox.value = value[key];
                    checkbox.id = key + "id";

                    var label = document.createElement('label')
                    label.htmlFor = key + "id";
                    label.appendChild(document.createTextNode("\u00A0" + value[key]));

                    modalBody.appendChild(checkbox);
                    modalBody.appendChild(label);
                    var br = document.createElement("br");
                    modalBody.appendChild(br);

                }
            });
        });

        var modalFooter = document.createElement("div");
        setAttributes(modalFooter, { "class": "modal-footer" });
        var modalFilter = document.createElement("button");
        setAttributes(modalFilter, { "class": "btn btn-primary", "type": "submit" });
        var submitText = document.createTextNode("Filter");
        modalFilter.appendChild(submitText);

        modalFilter.addEventListener("click", function () {
            var filterObj = {};
            $('input[type=checkbox]').each(function () {
                if (this.checked)
                    filterObj[$(this).val()] = 1;
                // arr.push($(this).val());
            });
            filterParam = key;
            filterObject = filterObj;
            filter = true;
            callback(gResponse);
            $('#' + key + 'Modal').modal('hide');
        });
        modalHeader.appendChild(modalButton);
        modalHeader.appendChild(headerTitle);

        contentModal.appendChild(modalHeader);
        modalFooter.appendChild(modalFilter);

        contentModal.appendChild(modalBody);
        contentModal.appendChild(modalFooter);
        dialogModal.appendChild(contentModal);
        divModal.appendChild(dialogModal);
        var spanText = document.createElement("span");
        var colText = document.createTextNode(key + " ");
        spanText.appendChild(colText);
        setAttributes(spanText, { "id": key + "Filter" });
        var spanElement = document.createElement("span");
        setAttributes(spanElement, { "class": "glyphicon glyphicon-sort", "id": key, "style": "cursor: pointer;" });
        col.appendChild(spanText);
        col.appendChild(spanElement);
        head.appendChild(col);

        body.appendChild(divModal);

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
        $('#' + key + "Filter").on('click', function (ev) {
            console.log("hereee");
            $('#' + key + 'Modal').modal('show');

        })
    });


}

function callback(response, search = false) {
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
    while (document.getElementsByClassName("data")[0]) {
        content.removeChild(document.getElementsByClassName("data")[0]);
    }


    for (var i = 0; i < actualJSON.length; i++) {
        //Create table using divs
        var table = document.getElementById("results");

        var div = document.createElement("div");
        div.setAttribute("class", "table_row data");

        if (filter) {
            var tempObj = actualJSON[i];
            console.log(tempObj[filterParam]);
            if (!(tempObj[filterParam] in filterObject))
                continue;

        }

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
                            else callback(JSON.stringify(obj), true);

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


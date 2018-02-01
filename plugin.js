var sortDescending = true,
    sort = false,
    sortTerm, header = true,
    filter = false,
    filterParam;
var filterObject = {},
    gResponse;

// This function will read the file using AJAX and send the content to callback function.
function loadJSON(file, callback) {
    var requestObject = new XMLHttpRequest();
    requestObject.overrideMimeType("application/json");
    requestObject.open('GET', file, true);
    requestObject.onreadystatechange = function () {
        if (requestObject.readyState == 4 && requestObject.status == "200") {
            //This will be true only in the beginning, setting the header.
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
//This is a helper function, to set the attributes to any DOM element in a faster and efficient manner.
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
//This function will build the header row and search row for the table. As well as excel filter modal on them.
function buildHeader(response) {
    var result = JSON.parse(response);
    var table = document.getElementById("results");
    var head = document.createElement("div");
    setAttributes(head, {
        "class": "theader"
    });

    // Building head labels for each column
    $.each(result[0], function (key, value) {
        var col = document.createElement("div");
        setAttributes(col, {
            "class": "table_header",
            "style": "cursor: pointer;"
        });
        //Building modal to pop up when clicked on header using DOM.
        var divModal = document.createElement("div");
        var contentModal = document.createElement("div");
        var dialogModal = document.createElement("div");
        setAttributes(dialogModal, {
            "class": "modal-dialog"
        });
        setAttributes(contentModal, {
            "class": "modal-content "
        });
        setAttributes(divModal, {
            "class": "modal fade ",
            "id": key + "Modal",
            "role": "dialog",
            "tabindex": "-1",
            "aria-labelledBy": "example",
            "aria-hidden": "true"
        });
        var modalHeader = document.createElement("div");
        setAttributes(modalHeader, {
            "class": "modal-header"
        });
        var headerTitle = document.createElement("h3");
        setAttributes(headerTitle, {
            "class": "modal-title"
        });
        var headerText = document.createTextNode("Filter");
        headerTitle.appendChild(headerText);
        var modalButton = document.createElement("button");
        setAttributes(modalButton, {
            "type": "button",
            "class": "close",
            "data-dismiss": "modal",
            "aria-label": "Close"
        });
        var spanClose = document.createElement("span");
        setAttributes(spanClose, {
            "aria-hidden": "true"
        });
        spanClose.innerHTML = "&times;";
        modalButton.appendChild(spanClose);
        var modalBody = document.createElement("div");
        setAttributes(modalBody, {
            "class": "modal-body"
        });
        //This will populate checkbox and labels on the modal, only unique ones using lookup.
        var lookup = {};
        $(result).each(function (idx, obj) {

            $(obj).each(function (term, value) {
                if (!(value[key] in lookup)) {
                    // This lookup would be used to populate only unique values in the modal excel filter.
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
        setAttributes(modalFooter, {
            "class": "modal-footer"
        });
        var modalFilter = document.createElement("button");
        setAttributes(modalFilter, {
            "class": "btn btn-primary",
            "type": "submit"
        });
        var submitText = document.createTextNode("Filter");
        modalFilter.appendChild(submitText);
        // This will be invoked when filter button is clicked. It will make list of checked checkboxes and store it in filterObj.
        modalFilter.addEventListener("click", function () {
            var filterObj = {};
            $('input[type=checkbox]').each(function () {
                if (this.checked)
                    filterObj[$(this).val()] = 1;
            });
            // Setting filterParam, so as to reorganize table structure according to this parameter.
            filterParam = key;
            filterObject = filterObj;
            filter = true;
            callback(gResponse);
            // This will hide the modal.
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
        setAttributes(spanText, {
            "id": key + "Filter"
        });
        var spanElement = document.createElement("span");
        setAttributes(spanElement, {
            "class": "glyphicon glyphicon-sort",
            "id": key,
            "style": "cursor: pointer;"
        });
        col.appendChild(spanText);
        col.appendChild(spanElement);
        head.appendChild(col);

        body.appendChild(divModal);

    });

    table.appendChild(head);
    //Building search row for each column.
    var divRow = document.createElement("div");
    setAttributes(divRow, {
        "class": "table_row"
    });
    //Building search input box for each column
    $.each(result[0], function (key, value) {
        var divSmall = document.createElement("div");
        setAttributes(divSmall, {
            "class": "table_small"
        });
        var tableCell = document.createElement("div");
        setAttributes(tableCell, {
            "class": "table_cell"
        });
        var topNav = document.createElement("div");
        setAttributes(topNav, {
            "class": "topnav"
        });
        var inputSearch = document.createElement("input");
        setAttributes(inputSearch, {
            "type": "text",
            "placeholder": "Search",
            "id": key + "Search"
        });
        topNav.appendChild(inputSearch);
        divSmall.appendChild(tableCell);
        divSmall.appendChild(topNav);
        divRow.appendChild(divSmall);
    });
    table.appendChild(divRow);
    // Attatching sort and search functionality to each column
    $.each(result[0], function (key, value) {
        $("#" + key).customSort({
            sortTerm: key
        });
        $("#" + key + "Search").customSearch({
            searchTerm: key
        });
        // Attaching filter functionality to each header text of each column.
        $('#' + key + "Filter").on('click', function (ev) {
            $('#' + key + 'Modal').modal('show');

        })
    });


}
// This is the main callback function for displaying the whole data on the screen in tabular format.
function callback(response, search = false) {
    var actualJSON = JSON.parse(response);
    var content = document.getElementById("results");
    // This will remove all the existing tabular structure, so as to append new ones which will match search criteria.
    if (search) {
        while (document.getElementsByClassName("data")[0]) {
            content.removeChild(document.getElementsByClassName("data")[0]);
        }
    }
    // This will remove existing tabular structure, as well as sort the JSON data in ascending or descending order.
    if (sort) {
        while (document.getElementsByClassName("data")[0]) {
            content.removeChild(document.getElementsByClassName("data")[0]);
        }
        actualJSON.sort(function (one, another) {
            if (sortDescending) {
                return one[sortTerm] < another[sortTerm];
            } else {
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

    // This loops through whole JSON data and displays it on the screen in tabular format.
    for (var i = 0; i < actualJSON.length; i++) {
        //Create table using divs
        var table = document.getElementById("results");

        var div = document.createElement("div");
        div.setAttribute("class", "table_row data");
        // This lookup is used to skip those rows which do not match filter criteria.
        if (filter) {
            var tempObj = actualJSON[i];
            if (!(tempObj[filterParam] in filterObject))
                continue;

        }
        // This will append each JSON data into each cell of table.
        $.each(actualJSON[0], function (key, value) {
            var smallDiv = document.createElement("div");
            smallDiv.setAttribute("class", "table_small");
            var cellDiv = document.createElement("div");
            cellDiv.setAttribute("class", "table_cell");
            var tempObj = actualJSON[i];
            var textNode;
            // This is used to replace with no value, if key does not exists.
            if (typeof tempObj[key] != 'undefined')
                textNode = document.createTextNode(tempObj[key]);
            else textNode = document.createTextNode("( no value )");
            cellDiv.appendChild(textNode);
            smallDiv.appendChild(cellDiv);
            div.appendChild(smallDiv);
        });

        table.appendChild(div);
    }
}


(function ($) {
    // This is the function used to build whole table, by just giving the JSON file.
    $.fn.buildTable = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json"
        }, options);
        loadJSON(settings.source, callback);
    };
    // This will help in sorting the JSON data.
    $.fn.customSort = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json",
            sortTerm: "youCanOverideHere"
        }, options);
        // When clicked on sort icon, it will enabled sort and display data on screen in sorted format.
        this.click(function () {
            sort = true;
            sortTerm = settings.sortTerm;
            loadJSON(settings.source, callback);
        });
    };
    // This is used for searching within the JSON content. 
    $.fn.customSearch = function (options) {
        // Default options
        var settings = $.extend({
            source: "./data.json",
            searchTerm: "youCanOverideHere"
        }, options);
        // On keyup, JSON content will be filtered on search criteria.
        $(this).keyup(function () {
            // If search box gets empty, it will populate whole data back on screen.
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
                            if (req.term.includes(">=") && typeof item[settings.searchTerm] == "number") {
                                if (item[settings.searchTerm] >= req.term.substring(2)) {
                                    obj.push(item);
                                }

                            } else if (req.term.includes("<=") && typeof item[settings.searchTerm] == "number") {
                                if (item[settings.searchTerm] <= req.term.substring(2)) {
                                    obj.push(item);
                                }

                            } else if (req.term.includes("<") && typeof item[settings.searchTerm] == "number") {
                                if (item[settings.searchTerm] < req.term.substring(1)) {
                                    obj.push(item);
                                }

                            } else if (req.term.includes(">") && typeof item[settings.searchTerm] == "number") {
                                if (item[settings.searchTerm] > req.term.substring(1)) {
                                    obj.push(item);
                                }

                            } else if (regex.test(item[settings.searchTerm])) {
                                obj.push(item);

                            }
                            callback(JSON.stringify(obj), true);

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
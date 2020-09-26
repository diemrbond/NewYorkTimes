var $APPKEY = "G7IDcKA7IaDvvGQAHXg6erBC3ArA6pYT";
// https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=YLAecXv0mrV3QHzmqxWS3U3GiSDA6opc&q=
// q
// begin_date
// end_date

// Query selectors
// Inputs
var $input_search = $('#search-term');
var $input_num = $('#num-records');
var $input_start = $('#start-year');
var $input_end = $('#end-year');

// Buttons
var $button_search = $('#run-search');
var $button_clear = $('#clear-all');

// Display
var $display_searchbox = $('#search-box');
var $display_results = $('#search-results');
var $searching = $('#searching');

// Functions
function clearResults() {

    console.log("Clear results");
    $display_results.empty();
    $display_searchbox.css("display", "none");

    $searching.css("display", "none");

    $input_search.val("");
    $input_start.val("");
    $input_end.val("");
}

function displayResults() {
    $display_searchbox.css("display", "block");

    $searching.css("display", "none");
}

function validateSearch(theSearch, theNumber, theStart, theEnd) {
    if (theSearch == "") {
        return false;
    }
    if (isNaN(theNumber)) {
        return false;
    }

    if (parseInt(theStart).toString().length != 4) {
        return false;
    }
    if (parseInt(theEnd).toString().length != 4) {
        return false;
    }
    if (parseInt(theEnd) < parseInt(theStart)){
        return false;
    }

    return true;
}

function searchResults(event) {

    event.preventDefault();

    var searchQuery = $input_search.val().trim();
    var numberSearches = parseInt($input_num.val().trim());
    var startDate = parseFloat($input_start.val().trim());
    var endDate = parseFloat($input_end.val().trim());

    console.log("startDate: " + startDate);
    console.log("endDate: " + endDate);

    if (validateSearch(searchQuery, numberSearches, startDate, endDate)) {

        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + $APPKEY + "&q=" + searchQuery;

        if ((!isNaN(startDate)) && (!isNaN(endDate))) {
            
            queryURL += "&begin_date=" + startDate + "0101&end_date=" + endDate + "0101";
        }

        $searching.css("display", "block");

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            $display_results.empty();

            var results = response.response.docs;

            if (results.length < numberSearches){
                numberSearches = results.length;
            }

            for (var i = 0; i < numberSearches; i++) {

                if (results[i].headline.main != undefined) {
                    var newH3 = $('<h3>');
                    var searchId = $('<span>');
                    searchId.addClass("label")
                    searchId.addClass("label-primary");
                    searchId.text((i + 1));
                    newH3.append(searchId);
                    $display_results.append(newH3);

                    var title = $("<h4>").text(results[i].headline.main);
                    $display_results.append(title);

                    var author = $("<p>").text("Author: " + results[i].byline.original);
                    $display_results.append(author);

                    var theDate = new Date(results[i].pub_date);
                    var pubDate = $("<p>").text("Published: " + theDate);
                    $display_results.append(pubDate);
                }
            }

            displayResults();
        })

    }
}

// Functionality
$(document).ready(function () {

    $button_search.on("click", searchResults)

    $button_clear.on("click", clearResults);
})
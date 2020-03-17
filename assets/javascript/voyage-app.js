// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA7yTHFyRl7s6ZvTvQ-chYiE5flrw8NJ0g",
    authDomain: "myapp-654ae.firebaseapp.com",
    databaseURL: "https://myapp-654ae.firebaseio.com",
    projectId: "myapp-654ae",
    storageBucket: "myapp-654ae.appspot.com",
    messagingSenderId: "437569120119",
    appId: "1:437569120119:web:3d608b52341c7f06806372",
    measurementId: "G-G5YVGZ0V28"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// VARIABLES -------------
var destinationRecommendations = [];

// webcam api key (owner: Thuy)
// webcam api reference: https://api.windy.com/webcams/docs
const webcamApiKey = config.webcamApiKey;
const googleMapAPI = config.googleMapAPI;


// save destination vars in object for sorting/ranking
const destinations = {
    Vail: 0,
    Vienna: 0,
    SanDiego: 0,
    Bahamas: 0,
    Alaska: 0,
    Newport: 0
};

// hard coding lattitude,longitutde,radius(km) of each destination
const destCoordinates = {
    Vail: "39.64,-106.38,50",
    Vienna: "48.21,16.37,50",
    SanDiego: "32.72,-117.15,50",
    Bahamas: "24.65,-78.04,500",
    Alaska: "61.54,-149.56,500", // Anchorage
    Newport: "41.50,-71.31,50"
}

var clickedDestination;

// FUNCTIONS -------------
$(function () {
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 10) {
            $('.navbar').addClass('active');
        } else {
            $('.navbar').removeClass('active');
        }
    });
});
// function to get and display webcams based on selected destination name: 
function getWebcams(destName1, destName2) {
    let coors = "";
    $("#webcam-spinner").show();
    // switch will assign the coordinates from the destCoordinations object
    switch (destName1) {
        case "Vail":
            coors = destCoordinates.Vail;
            break;
        case "Vienna":
            coors = destCoordinates.Vienna;
            break;
        case "San Diego":
            coors = destCoordinates.SanDiego;
            break;
        case "Bahamas":
            coors = destCoordinates.Bahamas;
            break;
        case "Alaska":
            coors = destCoordinates.Alaska;
            break;
        case "Newport":
            coors = destCoordinates.Newport;
            break;
        default:
            coors = "21.32,-157.82,100" // defaults to Hawaii (just because, no particular reason);
    }
    // use the 'nearby' modifier to return webcams within specified radius of lattitude, longitutde coordinate
    let path = "nearby=" + coors + // coors = "latitude,longitude,radius"
        // "/category=beach + 
        "/orderby=popularity,desc" + // order webcams by most popular
        "/limit=8" + // limit number of webcams
        "?show=webcams:image,player,property,location,category&lang=en" // shows webcam image
    let queryURL = "https://api.windy.com/api/webcams/v2/list/" + path
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "x-windy-key": webcamApiKey
        },
        timeout: 3000
    }).then(function (response) {
        // do stuff after getting back response 
        console.log("response: ", response);

        if (response.result.webcams.length > 0) {
            // at least one webcam found
            // loop through webcams
            for (var w of response.result.webcams) {
                // NOTE: to get index of webcam: response.result.webcams.indexOf(w)
                let $newWebcamCard = makeWebcamCard(
                    w.id, // webcam id as card id
                    w.image.daylight.preview, // daytime preview image url
                    w.player.day.embed, // embeded player url
                    w.title, // img alt
                    w.title, // card title
                    w.location.country); // card text
                $("#webcam-container").append($newWebcamCard);
                $("#webcam-spinner").hide();

            }
        } else {
            // display 'no webcams found' message
            $("#webcam-container").append($("<h1>")
                .attr("class", "display-4 col-12 mt-5 pt-5 text-left text-secondary")
                .text("No webcams found :("));
            $("#webcam-spinner").hide();


        }
    });
}

function checkSurveyRadioButtons() {
    var destWinner = "";
    var destRunnerup = "";

    // tally the survey results into destination vars
    if ($("#q1-adventure").is(':checked')) {
        destinations.Vail++;
    };
    if ($("#q1-relaxation").is(':checked')) {
        destinations.Bahamas++;
    };
    if ($("#q1-combo").is(':checked')) {
        destinations.Vienna++;
    };

    if ($("#q2-sunshine").is(':checked')) {
        destinations.Bahamas++;
    };
    if ($("#q2-snow").is(':checked')) {
        destinations.Alaska++;
        destinations.Vail++;
    };
    if ($("#q2-combo").is(':checked')) {
        destinations.Vail++;
    };

    if ($("#q3-beach").is(':checked')) {
        destinations.SanDiego++;
        destinations.Bahamas++;
    };
    if ($("#q3-skislopes").is(':checked')) {
        destinations.Vail++;
        destinations.Alaska++;
    };
    if ($("#q3-hiking").is(':checked')) {
        destinations.Vail++;
        destinations.Alaska++;
        destinations.SanDiego++;
    };
    if ($("#q3-explorecity").is(':checked')) {
        destinations.SanDiego++;
        destinations.Vienna++;
    };
    if ($("#q4-historical").is(':checked')) {
        destinations.Vienna++;
        destinations.SanDiego++;
    };
    if ($("#q4-atv").is(':checked')) {
        destinations.Alaska++;
    };
    if ($("#q4-pool").is(':checked')) {
        destinations.SanDiego++;
        destinations.Bahamas++;
    };
    if ($("#q4-nightlife").is(':checked')) {
        destinations.Vienna++;
        destinations.SanDiego++;
    };
    if ($("#q5-shortflight").is(':checked')) {
        destinations.SanDiego++
    };
    if ($("#q5-acrosscountry").is(':checked')) {
        destinations.Alaska++;
        destinations.Vail++;
    };
    if ($("#q5-acrossworld").is(':checked')) {
        destinations.Vienna++;
    }
    // store the destination.scores properties to an array for sorting
    let toBeSorted = Object.entries(destinations); // example: toBeSorted = [ ["Bahamas", 4], ["Vail", 5]...]
    // sort the score values in decending order (rank high-low)
    let sorted = toBeSorted.sort(function (x, y) {
        return y[1] - x[1]
    });

    // loop through the sorted array
    for (var i of sorted) {
        if (sorted.indexOf(i) == 0) {
            destWinner = i[0];
        };
        if (sorted.indexOf(i) == 1) {
            destRunnerup = i[0];
        };
        if (sorted.indexOf(i) + 1 === 2) {
            break; // breaks the loop after top two destinations (winner & runner-up)
        }
    }
    // return the winner and runner-up in an array
    return [destWinner, destRunnerup]; // example: ["Vail", "Bahamas"]
}

$(document).ready(function () {
    $('.surveyquestions').hide();
    $("#webcam-spinner").hide();
    // load webcams when the 'destination.html page' is loaded
    if (/destination.html/i.test(window.location.href)) {
        // load the selected destination from sessionStorage
        let destination = sessionStorage.getItem("clickedDestination");
        console.log("selected destination: ", destination);
        getWebcams(destination);
    }
});

// Hides start button and title after clicking start
$('#pstart').on('click', function () {
    $('#start').remove();
    $('#heading').remove();
    $('.surveyquestions').show();
    $('#pstart').remove();
    $('h1').remove();
});

$('#test-button').on('click', function () {
    checkSurveyRadioButtons();
});

$(".card").on("click", function (e) {
    e.preventDefault;
    // save the clicked card's destination name to sessionStorage, 
    // so it can be retrieved by the destination.html page (otherwise it'll get erased on page load)
    clickedDestination = $(this).find(".card-title").text().trim();
    sessionStorage.setItem("clickedDestination", clickedDestination);
});

// loads webcam player in new tab
$("#webcam-container").on("click", ".webcam-card", function () {
    let $img = $(this).children("img.card-img");
    let playerUrl = $img.attr("data-player-url");
    window.open(playerUrl);
})

// INITIALIZE/MAIN -------------


// MORE FUNCTIONS DOWN HERE

// function to display webcam card elements;
function makeWebcamCard(id, preview, playerUrl, alt, title, text) {
    let $cardDiv = $("<div>", {
        id: id,
        class: "text-white col-lg-3 col-md-6 mt-4 webcam-card"
        // style: "width: 16rem;"
    });
    let $cardImg = $("<img>", {
        id: id + "-card-img",
        class: "card-img",
        src: preview,
        "data-preview-url": preview,
        "data-player-url": playerUrl,
        alt: alt
    });
    let $cardOverlay = $("<div>", {
        id: id + "-card-img-overlay",
        class: "card-img-overlay"
    });
    let $cardTitle = $("<h5>", {
        id: id + "card-title",
        class: "card-title webcam-title d-table",
        text: title
    });
    let $cardText = $("<p>", {
        class: "card-text webcam-text d-table",
        text: text
    });
    $cardDiv.append($cardImg);
    $cardDiv.append($cardOverlay);
    $cardOverlay.append($cardTitle);
    $cardOverlay.append($cardText);
    return $cardDiv;
}
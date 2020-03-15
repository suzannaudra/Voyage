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
    Alaska: 0
};

// hard coding lattitude,longitutde,radius(km) of each destination
const destCoordinates = {
    Vail:       "39.64,-106.38,50",
    Vienna:     "48.21,16.37,50",
    SanDiego:   "32.72,-117.15,50",
    Bahamas:    "24.65,-78.04,500",
    Alaska:     "61.54,-149.56,500" // Anchorage
}

// FUNCTIONS -------------

// function to get and display webcams based on selected destination name: 
function getWebcams(destName1, destName2){
    let coors = "";
    // switch will assign the coordinates from the destCoordinations object
    switch (destName1) {
        case "Vail": coors = destCoordinates.Vail; break;
        case "Vienna": coors = destCoordinates.Vienna; break;
        case ("SanDiego" ||  "San Diego"): coors = destCoordinates.SanDiego; break;
        case "Bahamas": coors = destCoordinates.Bahamas; break;
        case "Alaska": coors = destCoordinates.Alaska; break;
        default: coors = "21.32,-157.82,100" // defaults to Hawaii (just because, no particular reason);
    }
    // use the 'nearby' modifier to return webcams within specified radius of lattitude, longitutde coordinate
    let path = "nearby=" + coors + // coors = "latitude,longitude,radius"
        // "/category=beach + 
        "/orderby=popularity,desc" + // order webcams by most popular
        "/limit=5" + // limit number of webcams
        "?show=webcams:image,player,property,location,category&lang=en" // shows webcam image
    let queryURL = "https://api.windy.com/api/webcams/v2/list/" + path
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {"x-windy-key": webcamApiKey}
    }).then(function (response) {
        // do stuff after getting back response 
        console.log("response: ", response);

        if (response.result.webcams.length > 0){
            // at least one webcam found
            // loop through webcams
            for (var w of response.result.webcams){
                // NOTE: to get index of webcam: response.result.webcams.indexOf(w)
                let $newWebcamCard = makeWebcamCard(
                    w.id, // webcam id as card id
                    w.image.daylight.preview, // daytime preview image url
                    w.player.day.embed, // embeded player url
                    w.title, // img alt
                    w.title, // card title
                    w.location.country); // card text
                $("#webcam-container").append($newWebcamCard);

                // $("#showCase").append($("<img>").attr({
                //     "id":response.result.webcams.indexOf(w),
                //     "class":"img-thumbnail",
                //     "src":w.image.current.thumbnail,
                //     "alt":w.image.current.title}));
            }
        } else {
            // no webcams found :(
                // TODO: display message or retry api request with larger radius / alternate location?
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
        if (sorted.indexOf(i) == 0) {destWinner = i[0];};
        if (sorted.indexOf(i) == 1) {destRunnerup = i[0];};
        if (sorted.indexOf(i) + 1 === 2){
            break; // breaks the loop after top two destinations (winner & runner-up)
        } 
    }
    // return the winner and runner-up in an array
    return [destWinner, destRunnerup]; // example: ["Vail", "Bahamas"]
}

$(document).ready(function () {
    $('.surveyquestions').hide();

    // check if the destination.html page loaded
    if(/destination.html/i.test(window.location.href)){
        // find webcams when the destination page loads
        let destination = $(".card-text").text();
        getWebcams(destination);
    }
    

});

// Hides start button and title after clicking start
$('#pstart').on('click', function () {
    $('#start').remove();
    $('#heading').remove();
    $('.surveyquestions').show();
    $('#pstart').remove();
});

$('#test-button').on('click', function () {
    checkSurveyRadioButtons();
});

// attempt to change preview image to player (ran into CORBS error; doesn't work)
// $("#webcam-container").on({
//     mouseenter: function () {
//         // ...when mouse over
//         let $img = $(this).children("img");
//         $img.attr("src",$img.attr("data-player-url"));
//     },
//     mouseleave: function () {
//         // ...when mouse leaves
//         let $img = $(this).children("img");
//         $img.attr("src",$img.attr("data-preview-url"));
//     }
// }, ".webcam-card");
// INITIALIZE/MAIN -------------

// MORE FUNCTIONS

// function to make the webcam card elements;
// uses a background image with text overlay style
function makeWebcamCard(id, preview, playerUrl, alt, title, text) {
    let $cardDiv = $("<div>", {
            id: id,
            class: "card bg-dark text-white d-inline-block w-25 webcam-card"
            // style: "width: 16rem;"
         });
    let $cardImg = $("<img>", {
            id: id+"-card-img",
            class: "card-img",
            src: preview,
            "data-preview-url": preview,
            "data-player-url": playerUrl,
            alt: alt
        });
    let $cardOverlay = $("<div>", {
            id: id+"-card-img-overlay",
            class: "card-img-overlay"
        });
    let $cardTitle = $("<h5>", {
            id: id+"card-title",
            class: "card-title",
            text: title
        });
    let $cardText = $("<p>", {
            class: "card-text",
            text: text
        });
    $cardDiv.append($cardImg);
    $cardDiv.append($cardOverlay);
    $cardOverlay.append($cardTitle);
    $cardOverlay.append($cardText);
    return $cardDiv;
  }
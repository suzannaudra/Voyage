
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
var Vail 
var Vienna
var SanDiego
var Bahamas
var Alaska

// webcam api key (owner: Thuy)
const webcamApiKey = "QwMvscmcOAV4Xsn2Hr6N9MNJ1dGAGGLO";

// save destination vars in object for sorting/ranking
const destinations = {
    Vail: 0,
    Vienna: 0,
    SanDiego: 0,
    Bahamas: 0,
    Alaska: 0
};

const destCoordinates = {
    Vail:       "39.64,-106.38,50",
    Vienna:     "48.21,16.37,50",
    SanDiego:   "32.72,-117.15,50",
    Bahamas:    "24.65,-78.04,500",
    Alaska:     "61.54,-149.56,500" // Anchorage
}

// TODO: work in progress (dflores): building element to display webcams dynamically
var $webcamCard = $("<div>").attr({"class":"card","id":"webcam-card"}).append(
        $("<img>").attr({"class":"card-img-top"}).append(
            $("<div>").attr({"class":"card-body","id":"webcam-card-body"}).append(
                $("<p>").attr("class","card-text").text("")
            )
        )    
)


// FUNCTIONS -------------

// function to get and display webcams; 
// destName input is destination string name (see switch statement below);
// switch will load the coordinates/radius to find webcams "nearby"
function getWebcams(destName1, destName2){
    let coors = "";

    switch (destName1) {
        case "Vail": coors = destCoordinates.Vail; break;
        case "Vienna": coors = destCoordinates.Vienna; break;
        case ("SanDiego" ||  "San Diego"): coors = destCoordinates.SanDiego; break;
        case "Bahamas": coors = destCoordinates.Bahamas; break;
        case "Alaska": coors = destCoordinates.Alaska; break;
        default: coors = "21.32,-157.82,100" // defaults to Hawaii (just because, no particular reason);
    }
    // use the 'nearby' modifier to return webcams within certain radios of lattitude, longitutde
    let path = "nearby=" + coors + // latitude,longitude,radius
        "/orderby=popularity" + // order by popularity
        "/limit=5" + // limit to five
        "?show=webcams:image"// localize language to English if available 
    let queryURL = "https://api.windy.com/api/webcams/v2/list/" + path
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {"x-windy-key": webcamApiKey}
    }).then(function (response) {
        // do stuff after getting back response 
        // if(response.result.webcams.length > 0) {};
        console.log(response.result.webcams.length);

        if (response.result.webcams.length > 0){
            // at least one webcam found, loop through the results and display thumbnails (for now)
            for (var w of response.result.webcams){
                console.log(w, response.result.webcams.indexOf(w));
                $("#showCase").append($("<img>").attr({
                    "id":response.result.webcams.indexOf(w),
                    "class":"img-thumbnail",
                    "src":w.image.current.thumbnail,
                    "alt":w.image.current.title}));
            }
        } else {
            // no webcams found :(
                // TODO: display message or retry api request with larger radius / alternate location?
        }

    });
}


=======
// FUNCTIONS

function getWebcams(){
    let path = "nearby=25.03,77.39" + // Bahamas latitude,longitude
        ",1000" + // radius is 250km
        "/orderby=popularity" + // order by popularity
        "/limit=5" + // limit to five
        "?show=webcams:image"// localize language to English if available 
    let queryURL = "https://api.windy.com/api/webcams/v2/list/" + path
    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {"x-windy-key": webcamApiKey}
    }).then(function (response) {
        console.log(response);
        // do stuff after getting back response 
       
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
    // Sorting the scores to rank the destinations...
    //  Object.entries saves each destination:score (key:value) pair into 
    //  an array so we can sort by the score values (sorting objects by their properties
    //  requires a little extra effort)
    let toBeSorted = Object.entries(destinations);
    // example: toBeSorted = [ ["Bahamas", 4], ["Vail", 5]...]
    let sorted = toBeSorted.sort(function (x, y) {
        return y[1] - x[1]
    }); // sorts the score values in decending order (rank high-low)
    // example: sorted = [ ["Vail", 5], ["Bahamas",4]...]

    for (var i of sorted) {
        // i = each [destination, score] array inside the "sorted" array 
        console.log(i[0], i[1]); // displays destination name (index 0) and score (index 1)


        if (sorted.indexOf(i) == 0) {
            destWinner = i[0];
        };
        if (sorted.indexOf(i) == 1) {
            destRunnerup = i[0];
        };
        if (sorted.indexOf(i) + 1 === 2) {
            break;
        } // breaks the loop after top two destinations: winner & runner up

    }
    // this is winner
    destWinner;
    // this is runner-up
    destRunnerup;
    // TODO: call function (need to create it) that displays travel destination stuff!



}

$(document).ready(function () {
    $('.surveyquestions').hide();

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

$('#webcam-test-button').on('click', function (e) {
    e.preventDefault();

    let dest1 = ""; let dest2 = ""; // destination names (to be determined from survey eventually)
    getWebcams(dest1, dest2);


});

// INITIALIZE/MAIN -------------

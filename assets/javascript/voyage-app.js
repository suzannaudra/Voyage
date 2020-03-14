
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


// VARIABLES
var Vail 
var Vienna
var SanDiego
var Bahamas
var Alaska

// webcam api key (owner: Thuy)
var webcamApiKey = "QwMvscmcOAV4Xsn2Hr6N9MNJ1dGAGGLO";

// save destination vars in object for sorting/ranking
var destinations = {
    Vail:       1,
    Vienna:     2,
    SanDiego:   5,
    Bahamas:    4,
    Alaska:     3
};


// FUNCTIONS
function checkSurveyRadioButtons() {
    
    // tally the survey results into destination vars
    if ($("#q1-adventure").is(':checked')) {destinations.Vail++;};
    if ($("#q1-relaxation").is(':checked')) {destinations.Bahamas++;};
    if ($("#q1-combo").is(':checked')) {destinations.Vienna++;};

    if ($("#q2-sunshine").is(':checked')) {destinations.Bahamas++;};
    if ($("#q2-snow").is(':checked')){
        destinations.Alaska++;
        destinations.Vail++;
    };
    if ($("#q2-combo").is(':checked')) {destinations.Vail++;};

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
    if ($("#q5-shortflight").is(':checked')) {destinations.SanDiego++};
    if ($("#q5-acrosscountry").is(':checked')) {
        destinations.Alaska++;
        destinations.Vail++;
    };
    if ($("#q5-acrossworld").is(':checked')) {destinations.Vienna++;}
    // Sorting the scores to rank the destinations...
    //  Object.entries saves each destination:score (key:value) pair into 
    //  an array so we can sort by the score values (sorting objects by their properties
    //  requires a little extra effort)
    let toBeSorted = Object.entries(destinations);
        // example: toBeSorted = [ ["Bahamas", 4], ["Vail", 5]...]
    let sorted = toBeSorted.sort(function(x, y){return y[1] - x[1]}); // sorts the score values in decending order (rank high-low)
        // example: sorted = [ ["Vail", 5], ["Bahamas",4]...]
    for (var i of sorted) {
        // i = each [destination, score] array inside the "sorted" array
        console.log(i[0], i[1]); // displays destination name (index 0) and score (index 1)
        if(sorted.indexOf(i)+1 === 2){break;} // breaks the loop after top two destinations: winner & runner up
    }

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


// INITIALIZE/MAIN 

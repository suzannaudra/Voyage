// Initialize Firebase
var firebaseConfig = {
    // TODO setup firebase and copy config parameters here
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// VARIABLES
var Vail = 1;
var Vienna = 2;
var SanDiego = 3;
var Bahamas = 4;
var Alaska = 5;
var something = 0; // just for testing

var arrDestinations = [Vail, Vienna, SanDiego, Bahamas, Alaska];


// FUNCTIONS
function checkSurveyRadioButtons() {
    // console.log("checked: ", $("#q1-adventure").is(':checked'));
    if ($("#q1-adventure").is(':checked')) {
        Vail++;
    };
    if ($("#q1-relaxation").is(':checked')) {
        Bahamas++;
    };
    if ($("#q1-combo").is(':checked')) {
        Vienna++;
    };

    if ($("#q2-sunshine").is(':checked')) {
        Bahamas++;
    };
    if ($("#q2-snow").is(':checked')) {
        Alaska++;
        Vail++;
    };
    if ($("#q2-combo").is(':checked')) {
        Vail++;
    };

    if ($("#q3-beach").is(':checked')) {
        SanDiego++;
        Bahamas++;
    };
    if ($("#q3-skislopes").is(':checked')) {
        Vail++;
        Alaska++;
    };
    if ($("#q3-hiking").is(':checked')) {
        Vail++;
        Alaska++;
        SanDiego++;
    };
    if ($("#q3-explorecity").is(':checked')) {
        SanDiego++;
        Vienna++;
    };

    if ($("#q4-historical").is(':checked')) {
        Vienna++;
        SanDiego++;
    };
    if ($("#q4-atv").is(':checked')) {
        Alaska++;
    };
    if ($("#q4-pool").is(':checked')) {
        SanDiego++;
        Bahamas++;
    };
    if ($("#q4-nightlife").is(':checked')) {
        Vienna++;
        SanDiego++;
    };

    if ($("#q5-shortflight").is(':checked')) {
        SanDiego++
    };
    if ($("#q5-acrosscountry").is(':checked')) {
        Alaska++;
        Vail++;
    };
    if ($("#q5-acrossworld").is(':checked')) {
        Vienna++;
    };

    // TODO: push each destination variable into array

    // TODO: sort array large to small to find winner/runner up
    arrDestinations.sort(); // sorts the array in ascending order
    arrDestinations.reverse(); // then sorts in decending order (highest first)
    for (var a of arrDestinations) {
        console.log(a);
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
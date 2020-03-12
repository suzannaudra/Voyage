
// Initialize Firebase
var firebaseConfig = {
    // TODO setup firebase and copy config parameters here
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// VARIABLES
var Vail 
var Vienna
var SanDiego
var Bahamas
var Alaska

// FUNCTIONS
$(document).ready(function(){
    $('.surveyquestions').hide();

});
// Hides start button and title after clicking start
$('#pstart').on('click', function () {
    $('#start').remove();
    $('#heading').remove();
    $('.surveyquestions').show();
    $('#pstart').remove();
});


        

// INITIALIZE/MAIN 

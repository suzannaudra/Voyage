// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAJCNuM-YvvqM-P7C-ycyrAZO4OSoijLIU",
    authDomain: "project1-app-4102a.firebaseapp.com",
    databaseURL: "https://project1-app-4102a.firebaseio.com",
    projectId: "project1-app-4102a",
    storageBucket: "project1-app-4102a.appspot.com",
    messagingSenderId: "650455788981",
    appId: "1:650455788981:web:134e5ddb516d463c07bdfc",
    measurementId: "G-CRYV2184MF"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
var contactsRef = db.ref("/contacts");

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
    Newport: "41.50,-71.31,50",
    Hawaii: "21.32,-157.82,100" // default
}

var map; // user for Google Maps element

// FUNCTIONS -------------

// initialize Google Map element
function initMap(destination) {
    console.log("calling initMap");
    let coors = "";
    switch(destination) {
        case "Vail":
            coors = destCoordinates.Vail
            break;
        case "Vienna":
            coors = destCoordinates.Vienna
            break;
        case "San Diego":
            coors = destCoordinates.SanDiego
            break;
        case "Bahamas":
            coors = destCoordinates.Bahamas
            break;
        case "Alaska":
            coors = destCoordinates.Alaska
            break;
        case "Newport":
            coors = destCoordinates.Newport
            break;
        default:
          coors = destCoordinates.Hawaii
    }

    map = new google.maps.Map(document.getElementById('google-map'), {
        center: {lat: Number(coors.split(",")[0]),
                 lng: Number(coors.split(",")[1])},
        zoom: 10
    })
    
}

$("#test-map").on("click", function(e){
    e.preventDefault
    
})

// navbar function
$(function () {
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 10) {
            $('.navbar').addClass('active');
        } else {
            $('.navbar').removeClass('active');
        }
    });
});
// function to get and display webcams from selected destination name: 
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
        timeout: 5000
    }).then(function (response) {
        if (response.result.webcams.length > 0) {
            // at least one webcam found, loop through webcams
            for (var w of response.result.webcams) {
                // to get index of webcam: response.result.webcams.indexOf(w)
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


    // tally survey results into destination vars


    // ---- question 1 ----
    if ($("#q1-adventure").is(':checked')) {
        destinations.Vail++; // user prefers adventure
    };
    if ($("#q1-relaxation").is(':checked')) {
        destinations.Bahamas++; // user prefers relaxation
    };
    if ($("#q1-combo").is(':checked')) {
        destinations.Vienna++; // user prefers combination adventure/relaxation
    };
    // ---- question 2 ----
    if ($("#q2-sunshine").is(':checked')) {
        destinations.Bahamas++; // user prefers sunshine
    };
    if ($("#q2-snow").is(':checked')) {
        destinations.Alaska++; // user prefers snow
        destinations.Vail++;
    };
    if ($("#q2-combo").is(':checked')) {
        destinations.Vail++; // user prefers warm weather
    };
    // ---- question 3 ----
    if ($("#q3-beach").is(':checked')) {
        destinations.SanDiego++; // user prefers beach locals
        destinations.Bahamas++;
    };
    if ($("#q3-skislopes").is(':checked')) {
        destinations.Vail++; // user prefers ski slops
        destinations.Alaska++;
    };
    if ($("#q3-hiking").is(':checked')) {
        destinations.Vail++; // user prefers hiking
        destinations.Alaska++;
        destinations.SanDiego++;
    };
    if ($("#q3-explorecity").is(':checked')) {
        destinations.SanDiego++; // user prefers city exploration
        destinations.Vienna++;
    };
    // ---- question 4 ----
    if ($("#q4-historical").is(':checked')) {
        destinations.Vienna++; // user prefers historical sites
        destinations.SanDiego++;
    };
    if ($("#q4-atv").is(':checked')) {
        destinations.Alaska++; // user prefers ATVs
    };
    if ($("#q4-pool").is(':checked')) {
        destinations.SanDiego++; // user prefers poolside
        destinations.Bahamas++;
    };
    if ($("#q4-nightlife").is(':checked')) {
        destinations.Vienna++; // user prefers nightlife
        destinations.SanDiego++;
    };
    // ---- question 5 ----
    if ($("#q5-shortflight").is(':checked')) {
        destinations.SanDiego++ // short travel
    };
    if ($("#q5-acrosscountry").is(':checked')) {
        destinations.Alaska++; // medium travel
        destinations.Vail++;
    };
    if ($("#q5-acrossworld").is(':checked')) {
        destinations.Vienna++; // distant travel
    }
    // store the destination.scores properties to an array for sorting
    let toBeSorted = Object.entries(destinations); // example: toBeSorted = [ ["Bahamas", 4], ["Vail", 5]...]
    // sort the score values in decending order (rank high-low)
    let sorted = toBeSorted.sort(function (x, y) {
        return y[1] - x[1]
    });

    // loop through sorted array
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
    console.log([destWinner, destRunnerup]);
    return [destWinner, destRunnerup]; // example: ["Vail", "Bahamas"]

}


$(document).ready(function () {
    $('.content').hide();
    $("#webcam-spinner").hide();
    // load webcams when the 'destination.html page' is loaded
    if (/destination.html/i.test(window.location.href)) {
        // load the selected destination from sessionStorage
        let destination = sessionStorage.getItem("clickedDestination");
        console.log("Bahamas", destination);
        getWebcams(destination);
        getWeather(destination);
        // make destination block

        if (destination == "Bahamas") {
            $("body").css("background-image", "url('assets/Images/Bahamas.jpg')");

            let carouselitem1 = $("<div>").attr("class", "carousel-item active");
            let imgitem1 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://i2.wp.com/fishingbooker.com/blog/media/Fishing-in-the-Bahamas.jpg?resize=1024%2C683&ssl=1"
            });
            carouselitem1.append(imgitem1);
            $('.carousel-inner').append(carouselitem1);
            let carouselitem2 = $("<div>").attr("class", "carousel-item");
            let imgitem2 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://www.fodors.com/wp-content/uploads/2018/03/Ultimate-Things-To-Do-Bahamas-Hero.jpg"
            });
            carouselitem2.append(imgitem2);
            $('.carousel-inner').append(carouselitem2);
            let carouselitem3 = $("<div>").attr("class", "carousel-item");
            let imgitem3 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://q-cf.bstatic.com/images/hotel/max1024x768/147/147871201.jpg"
            });
            carouselitem3.append(imgitem3);
            $('.carousel-inner').append(carouselitem3);
            $("h5").text("Bahamas");
            $("p").text("Like seashells, no two holidays in the Bahamas are alike. With options as diverse as its 700 islands, it's a place where you can find exactly the getaway you love most. Looking for a family destination, a place for lovers to sneak away, a gambling mecca, a haven for cruise passengers, or a shopper’s world market? The Bahamas is all these… and much more.")
            $("#Vienna").text("Bahamas, North America")


        }
        if (destination == "Vienna") {
            $("body").css("background-image", "url('assets/Images/Vienna.jpg')");

            let carouselitem4 = $("<div>").attr("class", "carousel-item active");
            let imgitem4 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://wallpaperaccess.com/full/156614.jpg"
            });
            carouselitem4.append(imgitem4);
            $('.carousel-inner').append(carouselitem4);
            let carouselitem5 = $("<div>").attr("class", "carousel-item");
            let imgitem5 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://images.wallpapersden.com/image/download/vienna-austria-capital_16962_2560x1440.jpg"
            });
            carouselitem5.append(imgitem5);
            $('.carousel-inner').append(carouselitem5);
            let carouselitem6 = $("<div>").attr("class", "carousel-item");
            let imgitem6 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://s1.1zoom.me/b5050/912/Austria_Vienna_Fountains_Sculptures_Belvedere_565326_2560x1440.jpg"
            });
            carouselitem6.append(imgitem6);
            $('.carousel-inner').append(carouselitem6);
            $("h5").text("Vienna");
            $("p").text("In Vienna, the coffee house isn’t just a hangout: it’s an institution. Lingering over a newspaper with a pastry and a strong espresso drink is, according to UNESCO, officially a Viennese cultural pastime. Walk off your slice of Sachertorte with a self-guided tour of the city’s stunning traditional, Secessionist, and modern architecture, such as the Imperial Palace, the State Opera House, the Kirche am Steinhof, or the Kunsthistorisches Museum, an exercise in ornate geometry.")
            $("#Vienna").text("Vienna, Austira")
        }

        if (destination == "Vail") {
            $("body").css("background-image", "url('assets/Images/Vail.jpg')");
            let carouselitem7 = $("<div>").attr("class", "carousel-item active");
            let imgitem7 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://cdn.hipwallpaper.com/i/45/53/Zi8JKO.jpg"
            });
            carouselitem7.append(imgitem7);
            $('.carousel-inner').append(carouselitem7);
            let carouselitem8 = $("<div>").attr("class", "carousel-item");
            let imgitem8 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://wallpaperaccess.com/full/130547.jpg"
            });
            carouselitem8.append(imgitem8);
            $('.carousel-inner').append(carouselitem8);
            let carouselitem9 = $("<div>").attr("class", "carousel-item");
            let imgitem9 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://wallpaperaccess.com/full/130527.jpg"
            });
            carouselitem9.append(imgitem9);
            $('.carousel-inner').append(carouselitem9);
            $("h5").text("Vail");
            $("p").text("North America's biggest and most popular ski resort, Vail is an alpine village in the heart of the Rocky Mountains. Long a favorite of serious skiers and jet setting celebrities, Vail now also draws a younger, hipper snowboarding crowd. Skiing is king at Vail Mountain and the Blue Sky Basin, but the area's vast splendor is perfect for hiking, biking, snowmobiling or scenery-gazing at any time of the year.")
            $("#Vienna").text("Vail, CO")
        }
        if (destination == "San Diego") {
            $("body").css("background-image", "url('assets/Images/san-diego.jpg')");
            let carouselitem10 = $("<div>").attr("class", "carousel-item active");
            let imgitem10 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://images.wallpaperscraft.com/image/san_diego_california_evening_pier_waves_sea_decline_8985_800x600.jpg"
            });
            carouselitem10.append(imgitem10);
            $('.carousel-inner').append(carouselitem10);
            let carouselitem12 = $("<div>").attr("class", "carousel-item");
            let imgitem12 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://media.farandwide.com/81/c8/81c892124e9d421f8a7598d2a253c7c0.jpg"
            });
            carouselitem12.append(imgitem12);
            $('.carousel-inner').append(carouselitem12);
            let carouselitem11 = $("<div>").attr("class", "carousel-item");
            let imgitem11 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://mustlovetraveling.com/wp-content/uploads/2019/06/old-town-san-diego.jpg"
            });
            carouselitem11.append(imgitem11);
            $('.carousel-inner').append(carouselitem11);
            $("h5").text("San Diego");
            $("p").text("San Diego embodies laid-back California culture, complete with a Boardwalk, surfing communities, and outstanding Mexican food. Breathe in the fresh ocean air at Sunset Cliffs Natural Park, then gobble down a fresh fish taco at a La Jolla seafood joint. The naval aircrafts at the USS Midway Museum will have you standing at attention. A free Sunday concert at the Spreckels Organ Pavilion is the perfect way to unwind after a Saturday night bar-hop in the thumping Gaslamp Quarter.")
            $("#Vienna").text("San Diego, CA")
        }
        if (destination == "Newport") {
            $("body").css("background-image", "url('assets/Images/Newport-bg.jpg')");
            let carouselitem14 = $("<div>").attr("class", "carousel-item active");
            let imgitem14 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://live.staticflickr.com/4006/4672669161_6bfd52fdb7_b.jpg"
            });
            carouselitem14.append(imgitem14);
            $('.carousel-inner').append(carouselitem14);
            let carouselitem18 = $("<div>").attr("class", "carousel-item");
            let imgitem18 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_759,q_60,w_1138/v1/clients/newportri/6e7b4a08_e50f_44e4_8e5a_a5de35cda481_ca154a01-fba4-411e-bc0d-371a6c97df35.jpg"
            });
            carouselitem18.append(imgitem18);
            $('.carousel-inner').append(carouselitem18);
            let carouselitem19 = $("<div>").attr("class", "carousel-item");
            let imgitem19 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://whatsupnewp.com/wp-content/uploads/2015/10/bowens-wharf-newport-ri.jpg"
            });
            carouselitem19.append(imgitem19);
            $('.carousel-inner').append(carouselitem19);
            $("h5").text("Newport");
            $("p").text("Part unspoiled nature, part manmade wonder and part luxury paradise, Newport Beach enchants every type of traveler to its glowing shores. Trendsetters flock to the shopping havens of open air Fashion Island, the seaside shops of Corona Del Mar and the new developments on Newport Coast. The estuary on Back Bay is a birder's paradise, while the protected beach at Crystal Cove is favored by hikers. Surfers catch the best breaks on The Wedge while families enjoy the Fun Zone on Balboa Peninsula.")
            $("#Vienna").text("Newport, RI")
        }
        if (destination == "Alaska") {
            $("body").css("background-image", "url('assets/Images/alaska_national_park.jpg')");
            let carouselitem15 = $("<div>").attr("class", "carousel-item active");
            let imgitem15 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://www.steppestravel.com/app/uploads/2019/06/glacier-bay-alaska-800x600.jpg"
            });
            carouselitem15.append(imgitem15);
            $('.carousel-inner').append(carouselitem15);
            let carouselitem16 = $("<div>").attr("class", "carousel-item");
            let imgitem16 = $("<img>").attr({
                "class": "d-block w-100",
                "src": "https://www.wallpapergeeks.com/wp-content/uploads/2013/12/Humpback-Whale-Alaska-Wallpaper-800x600.jpg"
            });
            carouselitem16.append(imgitem16);
            $('.carousel-inner').append(carouselitem16);
            $("h5").text("Alaska");
            $("p").text("Alaska is divided into five regions: far north, interior, southwest, south central, and inside passage. Although it takes a long time to see the entire state, you can travel through the regions by boat, car, bus, or plane. Hike through the mountains, or venture out on a deep sea fishing or whale watching excursion. Get in touch with nature by camping in the wilderness, or experience your preferred degree of class and luxury in the beautiful, active cities of Anchorage and Fairbanks. ")
            $("#Vienna").text("Alaska, United States")


        }

        // call function to initialize and display the Google Map element
        initMap(destination);
    }

});

//Dynamic Destination Elements

// Hides start button and title after clicking start
$('#pstart').on('click', function () {
    // $('#start').remove();
    $('#welcome').remove();
    $('.content').show();
    $('#pstart').remove();
    // $('h1').remove();
    $('body').css('background-image', 'url("assets/Images/monaco.png")');
});

// survey submit button event
$('#submit').on('click', function () {

    var recommendation = checkSurveyRadioButtons();
    console.log(recommendation)
    if (recommendation[0] == "Vail") {
        $("#winner1").attr('src', 'assets/Images/Vail.jpeg');
        $("#winner1Text").text("Vail");
    }
    if (recommendation[0] == "Vienna") {
        $("#winner1").attr('src', 'assets/Images/Vienna.jpeg')
        $("#winner1Text").text("Vienna");
    }
    if (recommendation[0] == "SanDiego") {
        $("#winner1").attr('src', 'assets/Images/SanDiego.jpeg')
        $("#winner1Text").text("San Diego");
    }
    if (recommendation[0] == "Bahamas") {
        $("#winner1").attr('src', 'assets/Images/Bahamas.jpeg')
        $("#winner1Text").text("Bahamas");
    }
    if (recommendation[0] == "Alaska") {
        $("#winner1").attr('src', 'assets/Images/Alaska.jpg')
        $("#winner1Text").text("Alaska");
    }
    if (recommendation[0] == "Newport") {
        $("#winner1").attr('src', 'assets/Images/Newport.jpg')
        $("#winner1Text").text("Newport");
    }
    if (recommendation[1] == "Vail") {
        $("#winner2").attr('src', 'assets/Images/Vail.jpeg');
        $("#winner2Text").text("Vail");
    }
    if (recommendation[1] == "Vienna") {
        $("#winner2").attr('src', 'assets/Images/Vienna.jpeg')
        $("#winner2Text").text("Vienna");
    }
    if (recommendation[1] == "SanDiego") {
        $("#winner2").attr('src', 'assets/Images/SanDiego.jpeg')
        $("#winner1Text").text("San Diego");
    }
    if (recommendation[1] == "Bahamas") {
        $("#winner2").attr('src', 'assets/Images/Bahamas.jpeg')
        $("#winner2Text").text("Bahamas");
    }
    if (recommendation[1] == "Alaska") {
        $("#winner2").attr('src', 'assets/Images/Alaska.jpg')
        $("#winner2Text").text("Alaska");
    }
    if (recommendation[1] == "Newport") {
        $("#winner2").attr('src', 'assets/Images/Newport.jpg')
        $("#winner2Text").text("Newport");
    }
});


$(".card").on("click", function (e) {
    e.preventDefault;
    // save the clicked card's destination name to sessionStorage, 
    // so it can be retrieved by the destination.html page (otherwise it'll get erased on page load)
    let clickedDestination = $(this).find(".card-title").text().trim();
    sessionStorage.setItem("clickedDestination", clickedDestination);
});

// loads webcam player in new tab
$("#webcam-container").on("click", ".webcam-card", function () {
    let $img = $(this).children("img.card-img");
    let playerUrl = $img.attr("data-player-url");
    window.open(playerUrl);
})

// contact form send message button event
$("#send-message-button").on("click", function (event) {
    // event.preventDefault();
    let name = $("input[name='txtName']").val().trim();
    let email = $("input[name='txtEmail']").val().trim();
    let phone = $("input[name='txtPhone']").val().trim();
    let msg = $("textarea[name='txtMsg']").val().trim();

    contactsRef.push({
        n: name,
        e: email,
        p: phone,
        m: msg,
        dAdded: firebase.database.ServerValue.TIMESTAMP
    }, function (error) {
        console.log(error);
    })
    console.log("test send message");
});


$("#contact-read-messages-button").on("click", function (event) {
    event.preventDefault();
    displayMessages();

});

// INITIALIZE/MAIN -------------


// MORE FUNCTIONS DOWN HERE

// function to display contact message data from firebase
function displayMessages() {
    $("#messages-display").empty();
    // build headers
    let $headerWrapper = $("<div>").attr("class", "row text-white font-weight-bold text-center justify-content-center");
    let $headerName = $("<div>").attr("class", "col-3 text-right").text("Name");
    let $headerEmail = $("<div>").attr("class", "col-4 text-left").text("Email");
    let $headerMsg = $("<div>").attr("class", "col-5 h-auto text-left text-wrap").text("Message");
    $headerWrapper.append($headerName, $headerEmail, $headerMsg);
    $("#messages-display").append($headerWrapper);

    // retrieve data from firebase and display
    contactsRef.on('child_added', function (snap) {
        let $msgWrapper = $("<div>").attr("class", "row text-white text-center justify-content-center");
        let $msgDivName = $("<div>").attr("class", "col-3 text-right").text(snap.val().n + " ");
        let $msgDivEmail = $("<div>").attr("class", "col-4 text-left").text(snap.val().e + " ");
        let $msgDivMsg = $("<div>").attr("class", "col-5 h-auto text-left text-wrap").html("<p class='text-break'>" + snap.val().m.toString() + "</p>");

        $msgWrapper.append($msgDivName, $msgDivEmail, $msgDivMsg);
        $("#messages-display").append($msgWrapper);
    }, function () {
        contactsRef.off(); // detach (turn off) the listner when complete
    });

}


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
        class: "card-title webcam-title d-block text-truncate",
        text: title
    });
    let $cardText = $("<p>", {
        class: "card-text webcam-text d-inline text-truncate",
        text: text
    });
    $cardDiv.append($cardImg);
    $cardDiv.append($cardOverlay);
    $cardOverlay.append($cardTitle);
    $cardOverlay.append($cardText);
    return $cardDiv;
}
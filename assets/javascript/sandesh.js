// var city = "Bahamas";
let city = sessionStorage.getItem("clickedDestination");

$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=8854699e93fb8fa1fd3d91c1753f07b8", function (data) {

    // console.log(data);

    var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temp = Math.floor(data.main.temp) + "°F";
    var weather = data.weather[0].main;

    $(".icon").attr("src", icon);
    $(".temp").append(temp);
    $(".weather").append(weather);

});

$.getJSON("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=8854699e93fb8fa1fd3d91c1753f07b8", function (data) {

    console.log(data);

    for (var i = 0; i < 41; i += 7) {
        var divTag = $("<div>");
        var imgTag = $("<img>");
        var forecastDate = data.list[i].dt * 1000;
        var d = new Date(forecastDate);
        imgTag.attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
        divTag.addClass("forecast" + [i]);
        imgTag.html(imgTag);
        $(".test").append(divTag);
        $(".forecast" + [i]).append("<span>" + d.toDateString() + "</span>");
        $(".forecast" + [i]).append(imgTag);
        // $(".test").append(imgTag);
        $(".forecast" + [i]).append("<span>" + Math.floor(data.list[i].main.temp) + "°F </span>");
        $(".forecast" + [i]).append("<span>" + data.list[i].weather[0].main + "</span>");
    }
});
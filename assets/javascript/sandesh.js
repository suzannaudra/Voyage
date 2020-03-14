
var city = "London";

$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=8854699e93fb8fa1fd3d91c1753f07b8", function (data) {

    console.log(data);

    var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temp = Math.floor(data.main.temp);
    var weather = data.weather[0].main;

    console.log(icon);

    $(".icon").attr("src", icon);
    $(".temp").append(temp);
    $(".weather").append(weather);

});
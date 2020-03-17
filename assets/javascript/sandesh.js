var city = "Bahamas";

var imgTag = $("<img>");

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

$.getJSON("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=8854699e93fb8fa1fd3d91c1753f07b8", function (data) {

    console.log(data);

    var icon = "http://openweathermap.org/img/w/" + data.list[1].weather[0].icon + ".png";
    var temp = Math.floor(data.list[1].main.temp);
    var weather = data.list[1].weather[0].main;

    console.log(weather);
    console.log(temp);
    console.log(icon);

    // <span><img class="icon"></span>

    for (var i = 0; i < 41; i+= 7) {
        // console.log(data.list[i].main.temp);
        var imgTag = $("<img>");
        var forecastDate = data.list[i].dt * 1000;
        var d = new Date(forecastDate);
        imgTag.attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
        // imgTag.addClass("forecast" + [i]);
        imgTag.html(imgTag);
        $(".test").append(imgTag);
        $(".test").append("<span>" + Math.floor(data.list[i].main.temp) + "</span>");
        $(".test").append("<span>" + data.list[i].weather[0].main + "</span>");
        $(".test").append("<span>" + d.toDateString() + "</span>");
    }
});
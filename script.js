$(document).ready(function () {
    //to show weather icons
    var cityName = "";
    $(".weather-side").css("display", "none");
    $(".info-side").css("display", "none");
    $(".week-container").css("display", "none");

    // Search for a city
    document.querySelector('#cityname').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            cityName = $("#cityname").val().toLowerCase();
            $(".week-list").empty();
            //$(".week-list").empty();
            createList();
            $(".weather-side").css("display", "block");
            $(".info-side").css("display", "block");
            $(".week-container").css("display", "block");
            renderWeather();
            //console.log(e.key);
        }
    });
    // create a list of locations already searched
    var createList = function () {
        var button = $("<p>").text(cityName);
        button.addClass("locationname list-group-item list-group-item-action");
        button.attr("type", "button");
        $(".location-list").prepend(button);
        // to delete the oldest search once the list reaches 8
        var max = 8;
        $('ul, ol').each(function () {
            $(this).find('p').each(function (index) {
                if (index >= max) $(this).remove()
            })
        })

    };

    $(".location-list").on("click", function (event) {
        cityName = event.target.innerText;
        renderWeather();
        $(".week-list").empty();
        // $(".week-list").empty();
        console.log(cityName);
    });

    // display current weather
    var renderWeather = function () {
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=c8a87a10c722a1c854c14163a184e2a4";

        var longtitude;
        var latitude;
        var citynamedisplay;
        var iconcode;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            console.log(response.name);
            console.log(response.weather[0].icon);
            console.log(response.weather[0].description);
            console.log(response.main.temp);
            console.log(response.main.humidity);
            console.log(response.wind.speed);
            console.log(response.coord.lon);
            console.log(response.coord.lat);

            citynamedisplay = response.name;
            iconcode = response.weather[0].icon;
            $(".desc").text(response.weather[0].description);
            $(".temp").text(response.main.temp + " °C");
            $(".humidity").text(response.main.humidity + " %");
            $(".wind").text(response.wind.speed + " m/s");
            longtitude = response.coord.lon;
            latitude = response.coord.lat;

            //display icon
            var iconlink = "https://openweathermap.org/img/wn/" + iconcode + "@2x.png";
            var secondqueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=c8a87a10c722a1c854c14163a184e2a4&lat=" + latitude + "&lon=" + longtitude;
            $.ajax({
                url: secondqueryURL,
                method: "GET"
            }).then(function (response) {
                //console.log(response);
                var currentDate = (response.date_iso).split("T")[0]
                var year = (currentDate).split('-')[0]
                var month = (currentDate).split('-')[1]
                var day = ((currentDate).split('-')[2])
                FinalDate = (day + '-' + month + '-' + year)
                //console.log(FinalDate);
                $(".citynamedisplay").html(citynamedisplay + '<br></br>' + FinalDate)

                //console.log(year);
                //console.log(month);
                //console.log(day);
                $(".uvindex").text(response.value);
                var index = Math.round(parseInt(response.value));
                // if functions to change the background color of the uvindex based on their value
                if (0 < index && index < 2) {
                    $(".uvindex").css("background-color", "green");
                    $(".uvindex").css("color", "black");
                }
                if (2.5 < index && index < 5.5) {
                    $(".uvindex").css("background-color", "yellow");
                    $(".uvindex").css("color", "black");
                }
                if (6 < index && index < 7.5) {
                    $(".uvindex").css("background-color", "orange");
                    $(".uvindex").css("color", "black");
                }
                if (8 < index && index < 10.5) {
                    $(".uvindex").css("background-color", "red");
                    $(".uvindex").css("color", "black");
                }
                if (11 < index) {
                    $(".uvindex").css("background-color", "purple");
                    $(".uvindex").css("color", "black");
                }
                $('#wicon').attr('src', iconlink);
                $("#wicon").css("display", "block");

            });

            var secondicon;
            //display weather for 5 days
            var thirdqueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=c8a87a10c722a1c854c14163a184e2a4";
            $.ajax({
                url: thirdqueryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var fivedaysweather = response.list;
                // i = 8 in the for loop because the api used is 5 day/ 3 hour forecast data 24hrs/3 = 8 sets of data per day
                for (var i = 8; i < fivedaysweather.length; i = i + 7) {
                    //console.log(fivedaysweather[i].dt_txt);
                    var currentDate = (fivedaysweather[i].dt_txt).split(' ')[0];
                    //console.log(currentDate);
                    var year = (currentDate).split('-')[0]
                    var month = (currentDate).split('-')[1]
                    var day = ((currentDate).split('-')[2])
                    FinalDate = (day + '-' + month + '-' + year);
                    //console.log(year);
                    //console.log(month);
                    // console.log(day);
                    //console.log(FinalDate);
                    var newDiv = $("<div>");
                    newDiv.addClass("col forecast");
                    secondicon = fivedaysweather[i].weather[0].icon;
                    var secondiconlink = "https://openweathermap.org/img/wn/" + secondicon + "@2x.png";
                    var date = $("<h3>").text(FinalDate);
                    var icon = $("<img>").attr('src', secondiconlink);
                    var temp = $("<p>").text("Temp: " + fivedaysweather[i].main.temp + " °C");
                    var humidity = $("<p>").text("Humidity: " + fivedaysweather[i].main.humidity + " %");

                    newDiv.append(date, icon, temp, humidity);
                    $(".week-list").append(newDiv);

                }
            });


        })





    }
});
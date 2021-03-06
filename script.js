   //declare cityName variable
   var cityName;
   // function that needs to run once a search is made
   function search() {
       cityName = $("#cityname").val().toLowerCase();
       $(".week-list").empty();
       itemsArray.push(cityName);
       localStorage.setItem('items', JSON.stringify(itemsArray))
       createList();
       renderWeather();
   }

   //function that creates the list of previous searches 
   function createList() {
       var button = $("<p>").text(cityName);
       button.addClass("list-group-item list-group-item-action");
       //each p tag generated is given a button attribute so the user doesn't have to type the cityname again to search
       // the cursor turns into a pointer when you hover over these tags(done in css) 
       button.attr("type", "button");
       $(".location-list").prepend(button);
       // to delete the oldest search once the list reaches 8
       var max = 8;
       $('ul').each(function () {
           $(this).find('p').each(function (index) {
               if (index >= max) $(this).remove()
           })
       })
   };

   // function that runs when a city in the list is clicked. event listener is added to the p tags generated
   $(".location-list").on("click", function (event) {
       cityName = event.target.innerText;
       renderWeather();
       $(".week-list").empty();
   })

   // function to display current weather
   function renderWeather() {

       var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=c8a87a10c722a1c854c14163a184e2a4";

       var longtitude;
       var latitude;
       var citynamedisplay;
       var iconcode;

       $.ajax({
           url: queryURL,
           method: "GET"
       }).then(function (response) {
           citynamedisplay = response.name;
           iconcode = response.weather[0].icon;
           $(".desc").text(response.weather[0].description);
           $(".temp").text(response.main.temp + " °C");
           $(".humidity").text(response.main.humidity + " %");
           $(".wind").text(response.wind.speed + " m/s");
           longtitude = response.coord.lon;
           latitude = response.coord.lat;

           //display icon: i used this particular link because it provides the icons twice as big
           var iconlink = "https://openweathermap.org/img/wn/" + iconcode + "@2x.png";
           //querylink for getting the UV index
           var secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=c8a87a10c722a1c854c14163a184e2a4&lat=" + latitude + "&lon=" + longtitude;
           $.ajax({
               url: secondqueryURL,
               method: "GET"
           }).then(function (response) {

               // to change the format of the date provided in the response I used the split method to arrange the dates to the standard british notation
               var currentDate = (response.date_iso).split("T")[0]
               var year = (currentDate).split('-')[0]
               var month = (currentDate).split('-')[1]
               var day = ((currentDate).split('-')[2])
               FinalDate = (day + '-' + month + '-' + year)

               //append final date to html
               $(".citynamedisplay").html(citynamedisplay + '<br></br>' + FinalDate)


               //append uv index to the corresponding html element
               $(".uvindex").text(response.value);
               // to change response.value into a number and then round it to the nearest integer
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
               //append icon to the corresponding html
               $('#wicon').attr('src', iconlink);
               $("#wicon").css("display", "block");
           });

           // variable that contains the forecast icons
           var secondicon;

           // queryURL to get weather forecast for 5 days
           var thirdqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=c8a87a10c722a1c854c14163a184e2a4";
           $.ajax({
               url: thirdqueryURL,
               method: "GET"
           }).then(function (response) {

               var fivedaysweather = response.list;
               // i = 8 in the for loop because the api used is 5 day/ 3 hour forecast data 24hrs/3 = 8 sets of data per day
               // this was done to make sure that the data given is the next days instead of 3 hours from when the Ajax call was made
               for (var i = 8; i < fivedaysweather.length; i = i + 7) {

                   //to change the date format 
                   var currentDate = (fivedaysweather[i].dt_txt).split(' ')[0];

                   var year = (currentDate).split('-')[0]
                   var month = (currentDate).split('-')[1]
                   var day = ((currentDate).split('-')[2])
                   FinalDate = (day + '-' + month + '-' + year);

                   // to generate the div that will contain the five day forecast
                   var newDiv = $("<div>");
                   newDiv.addClass("col forecast");
                   secondicon = fivedaysweather[i].weather[0].icon;
                   var secondiconlink = "https://openweathermap.org/img/w/" + secondicon + ".png";
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

   // to get searches from local storage that were saved and display them in the searches list
   var itemsArray = JSON.parse(localStorage.getItem('items')) || [];
   var lastSearch = itemsArray[itemsArray.length - 1];
  
   // create a list of locations already searched
   for (var i = 0; i < itemsArray.length && i < 8; i++) {
       var list = $("<p>").text(itemsArray[i])
       list.addClass("locationname list-group-item list-group-item-action");
       list.attr("type", "button");
       list.attr("data-set", itemsArray[i]);
       $(".location-list").prepend(list);
   }

   $(document).ready(function () {

       // to render the weather for last search upon opening the dashboard
       cityName = lastSearch;
       renderWeather();
    

       // Search for a city. event listener is listening out for a keypress and the following if function makes sure that the key pressed is enter. 
       //if true then it runs the search function
       document.querySelector('#cityname').addEventListener('keypress', function (e) {
           if (e.key === 'Enter') {
               search();
               $("#cityname").clear();

           }
       })
   })
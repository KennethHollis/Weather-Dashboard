var apiKey = "704210508ac4b5ba6d3818353b3a15d4";
var savedSearches = [];
var currentWeatherDiv = $("#current-weather");
var currentWeathCont = $("#current-weather-container");
var currentTitleCont = $("#current-title-container");
var forecastCardContainer = $("#forecast-container");
var currentForecastTitle = $("#current-forecast-title");


function searchHistoryList(cityName) {

  var searchHistEnt = $("<button>");
  searchHistEnt.addClass(
    "bg-gray-400 rounded-md text-black text-center font-medium h-8 w-96 mt-5"
  );
  searchHistEnt.text(cityName);

  $("#history").append(searchHistEnt);
  $("#history").addClass("border-gray-400 border-t-2 border-solid");

  if (savedSearches.length > 0) {
  
    var previousSavedSearches = localStorage.getItem("savedSearches");
    savedSearches = JSON.parse(previousSavedSearches);
  }


  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));


  $("#city-input").val("");
}

function loadSearchHistory() {

  var savedSerHist = localStorage.getItem("savedSearches");

  if (!savedSerHist) {
    return false;
  }

  savedSerHist = JSON.parse(savedSerHist);

  for (var i = 0; i < savedSerHist.length; i++) {
    searchHistoryList(savedSerHist[i]);
  }
}

function currentWeather(cityName) {

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          var cityLon = response.coord.lon;
          var cityLat = response.coord.lat;

          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (response) {
              searchHistoryList(cityName);

              currentWeatherDiv.removeClass("hidden");

              currentWeatherDiv.addClass(
                "border border-black border-solid mt-4 mr-10 h-50"
              );

              var currentTitle = $("<h1>");
              var currentDay = moment().format("M/D/YYYY");
              currentTitle.text(`${cityName} (${currentDay})`);
              var currentIcon = $("<img>");
              var currentIconCode = response.current.weather[0].icon;
              currentIcon.attr(
                "src",
                `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`
              );
              currentTitle.addClass("text-3xl font-bold mb-2 ml-1 mt-1");
              currentIcon.addClass("inline h-11 w-11 pb-1");
              currentTitleCont.append(currentTitle);
              currentTitle.append(currentIcon);

              var currentTemp = $("<p>");
              currentTemp.text(
                "Temperature: " + response.current.temp + " \u00B0F"
              );
              currentTemp.addClass("mb-2 ml-1");

              var currentHumidity = $("<p>");
              currentHumidity.text(
                "Humidity: " + response.current.humidity + "%"
              );
              currentHumidity.addClass("mb-2 ml-1");

              var currentWind = $("<p>");
              currentWind.text(
                "Wind Speed: " + response.current.wind_speed + " MPH"
              );
              currentWind.addClass("mb-2 ml-1");

              var currentUV = $("<p>");
              currentUV.text("UV Index: ");
              var currentNumber = $("<p>");
              currentNumber.text(response.current.uvi);
              currentNumber.addClass(
                "inline w-12 text-white px-3 rounded-md mb-2 ml-1"
              );
              currentUV.addClass("mb-2 ml-1");

              if (response.current.uvi <= 2) {
                currentNumber.addClass("bg-green-400");
              } else if (
                response.current.uvi >= 3 &&
                response.current.uvi <= 7
              ) {
                currentNumber.addClass("bg-yellow-400");
              } else {
                currentNumber.addClass("bg-red-400");
              }

              currentWeathCont.append(currentTemp);
              currentWeathCont.append(currentHumidity);
              currentWeathCont.append(currentWind);
              currentWeathCont.append(currentUV);
              currentUV.append(currentNumber);
            });
        });
      } else {
        $("#current-weather").addClass("hidden");
        setTimeout(function () {
          alert("Please enter name of city.");
        }, 20);
      }
    });
}

function fiveDay(cityName) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
  )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          var cityLon = response.coord.lon;
          var cityLat = response.coord.lat;

          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (response) {

              var futureFore = $("<h2>");
              futureFore.attr("id", "title-h2");
              futureFore.text("5-Day Forecast:");
              futureFore.addClass("text-2xl font-bold my-2");
              currentForecastTitle.prepend(futureFore);

              for (var i = 1; i <= 5; i++) {

                var futureForeCard = $("<div>");
                forecastCardContainer.append(futureForeCard);
                futureForeCard.addClass(
                  "flex flex-col w-40 mr-32 pr-4 pl-2 pt-1 pb-2 mt-2 bg-blue-500 text-left text-white rounded-md"
                );

                var futureForeDate = $("<p>");
                futureForeDate.addClass("text-lg font-bold");
                var date = moment().add(i, "d").format("M/D/YYYY");
                futureForeDate.text(date);
                futureForeCard.append(futureForeDate);

                var futureIcon = $("<img>");
                futureIcon.addClass("w-14 h-14");
                var futureIconCode = response.daily[i].weather[0].icon;
                futureIcon.attr(
                  "src",
                  `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`
                );
                futureForeCard.append(futureIcon);

                var futureTemp = $("<p>");
                futureTemp.addClass("mb-2");
                futureTemp.text(
                  "Temp: " + response.daily[i].temp.day + " \u00B0F"
                );
                futureForeCard.append(futureTemp);

                var futureWind = $("<p>");
                futureWind.addClass("mb-2");
                futureWind.text(
                  "Wind: " + response.daily[i].wind_speed + " MPH"
                );
                futureForeCard.append(futureWind);

                var futureHumidity = $("<p>");
                futureHumidity.addClass("mb-2");
                futureHumidity.text(
                  "Humidity: " + response.daily[i].humidity + "%"
                );
                futureForeCard.append(futureHumidity);
              }
            });
        });
      }
    });
}

function resetDivs() {
  $("#current-title-container").empty();
  $("#current-weather-container").empty();
  $("#forecast-container").empty();
  $("#title-h2").remove();
}

$("#user-form").on("submit", function () {
  event.preventDefault();

  var cityName = $("#city-input").val();

  if (cityName === "" || cityName == null) {

    alert("Please enter name of city.");
    event.preventDefault();
  } else {

    resetDivs();
    currentWeather(cityName);
    fiveDay(cityName);
  }
});

$("#history").on("click", "button", function () {

  var previousCityName = $(this).text();
  currentWeather(previousCityName);
  fiveDay(previousCityName);

  resetDivs();
});

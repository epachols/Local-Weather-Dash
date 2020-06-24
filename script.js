var cityInput = $("#cityInput");
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
var cityBtns = $("#cityBtns");

clearBtn.append($("<button>").addClass("btn-pill btn-light mt-1 mx-4").text("Clear"));
// retrieving locally saved info
savedCities = [];
for (ii = 0; ii < 10; ii++) {
  var retrievedCity = localStorage.getItem([ii]);
  if (retrievedCity) {
    savedCities.push(retrievedCity);
  } else {
    break;
  }
}
// begin function declarations
function renderBtns() {
  cityBtns.empty();
  for (var i = 0; i < savedCities.length; i++) {
    var b = $("<button>");
    b.addClass("col btn btn-lg bg-dark text-light mb-1");
    b.attr("data-name", savedCities[i]);
    b.attr("data-index", [i]);
    b.text(savedCities[i]);
    $("#cityBtns").prepend(b);
  }
}

function weatherGet(inputCity) {
  $("#today").empty();

  // var city = cityInput.val().trim();
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    inputCity +
    "&APPID=844468539098ae6ed77db2290adaac81&units=imperial";
  // Creating an AJAX call for the city being clicked
  $.ajax({
    url: weatherURL,
    method: "GET",
  }).then(function (response) {
    var daycard = $("<div card>");
    // if (!response) {
    // } else {}
    // Storing the city name/date
    var name = response.name + "(" + moment().format("MMM Do YY") + ")";
    var pOne = $("<p>").addClass("h3").text(name);
    // Displaying city/date
    daycard.append(pOne);
    // making and placing day weather icon
    var iconCode = response.weather[0].icon;
    var icon = $("<img>").addClass("d-inline");
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    icon.attr("src", iconUrl);
    pOne.append(icon);
    // temp
    var pTwo = $("<p>").text("Temperature: " + response.main.temp + "°F");
    daycard.append(pTwo);
    // humidity
    var pThree = $("<p>").text("Humidity: " + response.main.humidity + "%");
    daycard.append(pThree);
    // windspeed
    var pFour = $("<p>").text("Windspeed: " + response.wind.speed + "MPH");
    daycard.append(pFour);
    // add line for uv index
    var pFive = $("<p>").addClass("uvindex");
    daycard.append(pFive);
    function uvIndex() {
      $.ajax({
        url:
          "http://api.openweathermap.org/data/2.5/uvi?appid=844468539098ae6ed77db2290adaac81&lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon,
        method: "GET",
      }).then(function (response) {
        var uvResp = $("<p>").text("UV index: ");
        var uvDisplay = $("<button>").addClass("btn btn-warning");
        uvDisplay.text(response.value);
        uvResp.append(uvDisplay);
        uvResp.appendTo($("#today"));
      });
    }
    uvIndex()
    $("#today").prepend(daycard);
  });
}
// and 5 day
function fiveDay(inputCity) {
  $("#five-day").empty();
  $("#fiveTitle").text("Five Day Forecast: ")
   // var city = cityInput.val().trim();
  var fiveURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    inputCity +
    "&APPID=844468539098ae6ed77db2290adaac81&units=imperial";
  // ajax call for fiveday
  $.ajax({
    url: fiveURL,
    method: "GET",
  }).then(function (response) {
    for (ii = 0; ii < 5; ii++) {
      var foreCard = $("<div>").addClass(
        "card col-sm-5 col-md-2 blueSteel text-white p-1 my-3"
      );

      // retrieve and append date
      var fiveDate = $("<h5>").addClass("card-title");
      fiveDate.text(
        moment()
          .add(ii + 1, "days")
          .format("L")
      );
      foreCard.prepend(fiveDate);

      // retrieve and append icon
      var iconLine = $("<p>").addClass("justify-self-center my-n2");
      var fiveIcon = response.list[ii].weather[0].icon;
      var icon = $("<img>");
      var iconUrl = "http://openweathermap.org/img/w/" + fiveIcon + ".png";
      icon.attr("src", iconUrl);
      icon.appendTo(iconLine);
      iconLine.appendTo(foreCard);

      // retrieve and append temp
      var fivetemp = $("<p>").text(
        "Temp: " + response.list[ii].main.temp + "°F"
      );
      foreCard.append(fivetemp);
      // retrieve and append humidity
      var fiveHum = $("<p>").text(
        "Humidity: " + response.list[ii].main.humidity + "%"
      );
      foreCard.append(fiveHum);
      // append card
      $("#five-day").append(foreCard);
    }
  });
}
// initial call to fill board with stored info
renderBtns();
weatherGet(savedCities[savedCities.length-1]);
fiveDay(savedCities[savedCities.length-1]);
// event listener for search button
searchBtn.click(function () {
  event.preventDefault();
  var city = cityInput.val().trim();
  if (city && (!savedCities.includes(city))) {
    savedCities.push(city);
    weatherGet(city);
    fiveDay(city);
    cityInput.val("");
    renderBtns();
    // saving updated list to local storage
    for (ii = 0; ii < savedCities.length; ii++) {
      localStorage.setItem([ii], savedCities[ii]);
    }
  }
});
// event listener for stored buttons
cityBtns.on("click", ".btn", function (){
  event.preventDefault();
  var city = $(this).attr("data-name");
  weatherGet(city);
  fiveDay(city);
});
// event handler for clear button
clearBtn.click(function () {
  savedCities = [];
  cityInput.val("");
  $("#five-day").empty();
  $("#today").empty();
  $("#fiveTitle").text("Search a City to see current weather, forecast, and UV index");
  localStorage.clear();
  renderBtns();
});

// icebox
// TODO:make a moment conditional that handles day vs night css style. IF toggle is set to night, remove day class add night class, else add day remove night.


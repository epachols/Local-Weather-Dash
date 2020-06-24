var cityInput = $("#cityInput");
var searchBtn = $("#searchBtn");
var clearBtn = $("#clearBtn");
var cityBtns = $("#cityBtns");
clearBtn.append($("<button>").addClass("btn-pill btn-light mt-1 mb-2 mx-4").text("Clear"));
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
    b.addClass("col-5 col-md-12 btn btn-lg bg-dark text-light mb-1");
    b.attr("data-name", savedCities[i]);
    b.attr("data-index", [i]);
    b.text(savedCities[i]);
    $("#cityBtns").prepend(b);
  }
}
/**
 * 
 * @param {*} inputCity for the initial weather retrieval function is taken as either the button data-name or the search input field value. A portion of the results are then passed to the UV index ajax call.
 */
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
        var uvDisplay = $("<button>").addClass("btn");
        // handling condition uv response coloration
        if (response.value <5) {
          uvDisplay.addClass("btn-success")
        } else
        if (response.value < 8) {
          uvDisplay.addClass("btn-warning")
        }
        else 
        if (response.value > 8) {
          uvDisplay.addClass("btn-danger")
        }
        uvDisplay.text(response.value);
        uvResp.append(uvDisplay);
        uvResp.appendTo($("#today"));
      });
    }
    uvIndex()
    $("#today").prepend(daycard);
  });
}
/**
 * 
 * @param {*} inputCity takes in the same parameter from a given source, but runs the forecast api and generates 5 buttons instead
 */
function fiveDay(inputCity) {
  $("#five-day").empty();
  $("#fiveTitle").text("Five Day Forecast: ")
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
        "card col-5 col-md-2 text-white p-1 my-3"
      );
      // handling day/night styles
      if (((moment().format('H')) < 19) || (($('#dayNight').prop('checked')))) {
        foreCard.addClass("blueSteel");
      } else {foreCard.addClass("darkNight");}

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

// the following section contains a completely unneccessary, soaking wet repetitive section that handles
//  day/night changes via a toggle for css styling. I was playing around with conditional styles, and haven't merged the two yet, because I organized them sort of contrary to each other.Seems like it would require switching the data attribute of the toggle and the whole section of code, which I may do after the project1 due date.

$('#dayNight').change(function() 
{
  if ($(this).prop('checked')) {
    // if this is checked, (on night), then switch to day
    $("#parallaxImg").removeClass("parallaxNight");
    $("#parallaxImg").addClass("parallax");
    $("body").css("background-color", "#4682b4");
    $(".darkNight").addClass("blueSteel");
    $(".blueSteel").removeClass("darkNight");
    
  } else {
    // switch to night
    $("#parallaxImg").removeClass("parallax");
    $("#parallaxImg").addClass("parallaxNight");
    $("body").css("background-color", "#1f2a6b");
    $(".blueSteel").addClass("darkNight");
    $(".darkNight").removeClass("blueSteel");
  }
});
// function dayNight (){
  if ((moment().format('H')) > 17){
    // if it's later than five, set bg color to purple,  
    $("body").css("background-color", "#1f2a6b");
    $("#parallaxImg").removeClass("parallaxNight");
    $("#parallaxImg").addClass("parallax");
    $("#dayNight").bootstrapToggle('off');
  } else {
    // render it daytime
    $("body").css("background-color", "#4682b4");
    $('#foreCard').addClass('blueSteel');
    $('#foreCard').removeClass('darkNight');
    $("#parallaxImg").removeClass("parallaxNight");
    $("#parallaxImg").addClass("parallax");
  };
// }
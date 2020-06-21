// make it locally saveable (ideas: button has data-name of city. and data-index of number in array of generated buttons
// need to link all 3 apis, test outcome.
// basic weather,
// then 5 day forecast
// then insert uv index into both
var cityInput = $("#cityInput");
var searchBtn = $("#searchBtn");
console.log(cityInput.html());
// TODO:once cities will push into array, store for local storage data.
var savedCities = [];
// button adding to an array of buttons
// class them as button large, bg light,

function renderBtns() {
  $("#cityBtns").empty();

  for (var i = 0; i < savedCities.length; i++) {
    var b = $("<button>");
    b.addClass("col-10 btn btn-lg bg-dark text-light mb-1");
    b.attr("data-name", savedCities[i]);
    b.attr("data-index", [i]);
    b.text(savedCities[i]);
    $("#cityBtns").prepend(b);
  }
}

// city, + date + overcast notation, temp, humidity, windspeed, uv index
// NOTE:: since the following refers to THE BUTTON THAT"S CLICKED'S DATA NAME IT WON'T WORK.
// RESET so that the thing passed into weatherGet (either data-name in case of button or this.prev().val().trim()
function weatherGet() {
  $("#today").empty();
  var city = cityInput.val().trim();
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=844468539098ae6ed77db2290adaac81&units=imperial";
  // Creating an AJAX call for the city being clicked
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var daycard = $("<div card>");
    // Storing the city name/date
    var name =
      response.name +
      "(" +
      moment().format("MMM Do YY") +
      ")";
    var pOne = $("<p>").addClass("h3").text(name);
    // Displaying city/date
    daycard.append(pOne);

    // making and placing day weather icon 
    var iconCode = response.weather[0].icon;
    var icon = $("<img>").addClass("d-inline");
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    icon.attr('src', iconUrl);
    pOne.append(icon);

    // Storing the temp
    var temp = response.main.temp;
    var pTwo = $("<p>").text("Temperature: " + temp + "°F");
    // display temp
    daycard.append(pTwo);

    $("#today").prepend(daycard);
  });
}

searchBtn.click(function () {
  event.preventDefault();
  var city = cityInput.val().trim();
  //  TODO: change this if statement to if there is a result
  if (city) {
    savedCities.push(city);
    weatherGet();
    cityInput.val("");
    // store savedCities to local storage with a for-each, store data-name as key and data-index as object
    renderBtns();
    // TODO: also call the query functions for all,consider adding uv index last, since it will be appended to both other items.
  }
});

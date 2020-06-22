// make it locally saveable (ideas: button has data-name of city. and data-index of number in array of generated buttons
var cityInput = $("#cityInput");
var searchBtn = $("#searchBtn");
console.log(cityInput.html());
// TODO:once cities will push into array, store for local storage data.
var savedCities = [];

// begin function declarations 
function renderBtns() {
  $("#cityBtns").empty();

  for (var i = 0; i < savedCities.length; i++) {
    var b = $("<button>");
    b.addClass("col btn btn-lg bg-dark text-light mb-1");
    b.attr("data-name", savedCities[i]);
    b.attr("data-index", [i]);
    b.text(savedCities[i]);
    $("#cityBtns").prepend(b);
  }
}

// final wring - GIVE THE COMBINED FUNCTION MULTIPLE ARGUMENTS. *********
// run weatherget on (variable)
// note that the difference between the two calls is 'weather' and 'forecast'. the rest is identical.
// the other option is whether we are passing the this.data-name.val() or the cityInput.val().trim()

// could possibly run this through a 3-member array? too complicated with varying retrieval calls though...

function weatherGet() {
  $("#today").empty();

  var city = cityInput.val().trim();
  var weatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=844468539098ae6ed77db2290adaac81&units=imperial";
  // Creating an AJAX call for the city being clicked
  $.ajax({
    url: weatherURL,
    method: "GET",
  }).then(function (response) {
    var daycard = $("<div card>");

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

    // Storing the temp
    var temp = response.main.temp;
    var pTwo = $("<p>").text("Temperature: " + temp + "°F");
    // display temp
    daycard.append(pTwo);

    // Storing the humidity
    var humidity = response.main.humidity;
    var pThree = $("<p>").text("Humidity: " + humidity + "%");
    // display windspeed
    daycard.append(pThree);

    // Storing the windspeed
    var wind = response.wind.speed;
    var pFour = $("<p>").text("Windspeed: " + wind + "MPH");
    // display temp
    daycard.append(pFour);

    // add line for uv index
    var pFive = $("<p>");
    pFive.addClass("uvindex");
    daycard.append(pFive);
    uvIndex();

    $("#today").prepend(daycard);
  });
}






function uvIndex() {
  var city= cityInput.val().trim();









  // WORKING HERE --> NEXT TASK IS TO RETRIEVE UV INDEX DATA, THEN:
  // 1. append uvindex as text content of red button and accompanying text to the p.uvindex element
  // 2. work on passing city into ALL 3 functions, with city ass the initial call inside them, referencing either 
  // 2.a. - the data-name of the button created if button was clicked (link in event handler)
  // 2.b. - the cityInput.val().trim() for it being entered live.





  



}









function fiveDay() {
  $("#five-day").empty();

  var city = cityInput.val().trim();
  var fiveURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&APPID=844468539098ae6ed77db2290adaac81&units=imperial";
  // ajax call for fiveday
  $.ajax({
    url: fiveURL,
    method: "GET",
  }).then(function (response) {
   for (ii=0; ii<5; ii++) {
      // make card with background color (custom)
      var foreCard = $("<div>").addClass("card col-md-5 col-lg-2 bg-primary text-white p-1 my-3");

      // retrieve and append date
      var fiveDate = $("<h5>").addClass("card-title");
      fiveDate.text(moment().add((ii+1), 'days').format('L'));
      foreCard.prepend(fiveDate);

      // retrieve and append icon
      var iconLine = $("<p>").addClass("justify-self-center")
      var fiveIcon = response.list[ii].weather[0].icon;
      var icon = $("<img>");
      var iconUrl = "http://openweathermap.org/img/w/" + fiveIcon + ".png";
      icon.attr("src", iconUrl);
      icon.appendTo(iconLine);
      iconLine.appendTo(foreCard);

      // retrieve and append temp
      var fivetemp = $("<p>");
      fivetemp.text("Temp: " + response.list[ii].main.temp + "°F");
      foreCard.append(fivetemp);

      // retrieve and append humidity
      var fiveHum = $("<p>");
      fiveHum.text("Humidity: " + response.list[ii].main.humidity + "%");
      foreCard.append(fiveHum);

      // append card 
      $("#five-day").append(foreCard);
   }
  });
}

searchBtn.click(function () {
  event.preventDefault();
  var city = cityInput.val().trim();
  //  TODO: could do both buttons here with button listener, and if, then else city = this.data-name
  if (city) {
    savedCities.push(city);
    weatherGet();
    fiveDay();
    cityInput.val("");
    // store savedCities to local storage with a for-each, store data-name as key and data-index as object - could do this at the end of renderbuttons for loop as it will handle anything in the array.
    renderBtns();
  }
});

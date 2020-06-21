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
    $("#cityBtns").prepend(a);
  }
}

searchBtn.click(function () {
  event.preventDefault();
  var city = cityInput.val().trim();
//  TODO: change this if statement to if there is a result 
  if (city) {
    savedCities.push(city);
    cityInput.val("");
    // store savedCities to local storage with a for-each, store data-name as key and data-index as object
    renderBtns();
    // TODO: also call the query functions for all,consider adding uv index last, since it will be appended to both other items.
  }
});

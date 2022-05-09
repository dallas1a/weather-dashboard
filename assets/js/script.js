var key = "91b941255c14063d95fdc2a4aa5d6e7b";
var city = "Hartford"

var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')



var currentCityToday = $('.currentCityToday')

function currentWeather(){
	var retrieveCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(currentCityToday).empty();

	$.ajax({
		url: retrieveCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.dateToday').text(date);
		
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		currentCityToday.append(pEl);
		
		var pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		currentCityToday.append(pElTemp);
		
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		currentCityToday.append(pElHumid);
		
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		currentCityToday.append(pElWind);
		
		
        var cityLon = response.coord.lon;
		var cityLat = response.coord.lat;
		

		var retrieveUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: retrieveUvi,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			currentCityToday.append(pElUvi);
			
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'green');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "yellow")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "orange")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "red")
			} else {
				uviSpan.attr("class", "purple")
			}
		});
	});
	
};


//function collectUpcomingFive(){}


    currentWeather();

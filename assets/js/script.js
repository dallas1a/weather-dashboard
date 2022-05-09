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
				uviSpan.attr('class', 'low');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "moderate")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "high")
			} else if (uvi > 7 && uvi <= 10) {
				uviSpan.attr("class", "very-high")
			} else {
				uviSpan.attr("class", "extreme")
			}
		});
	});
	
};
var upcomingFiveEl = $('.upcomingFive');

function collectUpcomingFive() {
	var getUpcomingFIveUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUpcomingFIveUrl,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var dailyUpcoming = [];
		
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				dailyUpcoming.push(testObj);
			}
		})
		
		for (let i = 0; i < dailyUpcoming.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3  cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			upcomingFiveEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var day = moment(`${dailyUpcoming[i].date}`).format('dddd, MM-DD-YY');
			divElHeader.text(day);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${dailyUpcoming[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			
			var pElTemp = $('<p>').text(`Temperature: ${dailyUpcoming[i].temp} °F`);
			divElBody.append(pElTemp);
			
			var pElFeel = $('<p>').text(`Feels Like: ${dailyUpcoming[i].feels_like} °F`);
			divElBody.append(pElFeel);
			
			var pElHumid = $('<p>').text(`Humidity: ${dailyUpcoming[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};






currentWeather();
collectUpcomingFive();

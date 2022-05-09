//sets variable for the key to call api and variable for initial example city
var key = "91b941255c14063d95fdc2a4aa5d6e7b";
var city = "Hartford"
//calls moment.js for time outputs
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')



var currentCityToday = $('.currentCityToday')
//get the weather for the day for the example pulling info from weather api calls
function currentWeather(){
	var retrieveCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(currentCityToday).empty();
//retrieves api information from the url using the city as the search criteria 
	$.ajax({
		url: retrieveCurrent,
		method: 'GET',
        //after retrieving it appends the cooresponding info to each api call
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.dateToday').text(date);
		
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		var pElTempCon = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		currentCityToday.append(pElTempCon);
		
		var pElFeel = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		currentCityToday.append(pElFeel);
		
		var pElHumidCon = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		currentCityToday.append(pElHumidCon);
		
		var pElWindCon = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		currentCityToday.append(pElWindCon);
		
		
        var cityLon = response.coord.lon;
		var cityLat = response.coord.lat;
		
//uses the latitude and longitude to get the uv index for the coordinates
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
			//for a value of the given uvi it gives the uviSpan a class attribute that styles the warning color in the css
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
	collectUpcomingFive();
};
var upcomingFiveEl = $('.upcomingFive');
//uses the weather api to create an array that gets the upcoming 5 day forecast for the city given
function collectUpcomingFive() {
	var getUpcomingFIveUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUpcomingFIveUrl,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var dailyUpcoming = [];
		//creates an object for the info for each days weather 
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
		//creates a card for each of the 5 days in the forecast appending all the info 
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

			
			var pElTempCon = $('<p>').text(`Temperature: ${dailyUpcoming[i].temp} °F`);
			divElBody.append(pElTempCon);
			
			var pElFeel = $('<p>').text(`Feels Like: ${dailyUpcoming[i].feels_like} °F`);
			divElBody.append(pElFeel);
			
			var pElHumidCon = $('<p>').text(`Humidity: ${dailyUpcoming[i].humidity} %`);
			divElBody.append(pElHumidCon);
		}
	});
};
var previousSearch = [];
//listens for a click on the search button, then uses the city inputted to output
// that cities weather info for the day and 5 day forecast
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnParam').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	previousSearch.push(city);

	localStorage.setItem('city', JSON.stringify(previousSearch));
	upcomingFiveEl.empty();
	retrieveHistory();
	currentWeather();
});

var fillHistoryEl = $('.previousSearch');
//collects previously saved cities and turns them into buttons that can be used to re search that cities weather info 
function retrieveHistory() {
	fillHistoryEl.empty();

	for (let i = 0; i < fillHistoryEl.length; i++) {

		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${previousSearch[i]}`)

		rowEl.addClass('row previousCities');
		btnEl.addClass('btn btn-outline-secondary previousCityBtn');
		btnEl.attr('type', 'button');

		fillHistoryEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	
	$('.previousCityBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		upcomingFiveEl.empty();
		currentWeather();
	});
};

//loads page with the example as the initial page, loads any previously searched cities from 
//local storage into a list of clickable buttons
function loadPage() {

	var collectPrevious = JSON.parse(localStorage.getItem('city'));

	if (collectPrevious !== null) {
		previousSearch = collectPrevious
	}
	retrieveHistory();
	currentWeather();
};

loadPage();

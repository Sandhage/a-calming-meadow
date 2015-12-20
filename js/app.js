var latitude    = null;
var longitude   = null;

var sunSet      = null;
var sunRise     = null;

var currentdate = new Date(); 
var zoneOffset  = currentdate.getTimezoneOffset() / 60;
var dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
var timeToday   = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

$(document).ready(function() {	

    console.log("Time difference from UTC: " + zoneOffset);
    console.log("Date: " + dateToday);
    console.log("Time in UTC: " + timeToday);
    
	// Google API request
	var googleRequest = {
		address: 19104,
		key: 'AIzaSyBjoYUBZWys5JbkuUVznJIfnMBgfWT7iYE'
	};

	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		data: googleRequest,
		dataType: 'json',
		method: "GET"
	})
	.done(function(echo) {
		console.log(echo);
		latitude  = echo.results[0].geometry.location.lat;
		longitude = echo.results[0].geometry.location.lng;
		console.log("Lat: " + latitude);
		console.log("Lng: " + longitude);

		callSun();
	});

	// Reddit API request
	var redditRequest = {
		sort: 'new'
	};

	$.ajax({
		url: 'http://www.reddit.com/r/nosleep/new.json',
		data: redditRequest,
		dataType: 'json',
		type: 'GET'
	})
	.done(function(echo) {
 		console.log(echo);
 		// console.log(echo.data.children[1].data.selftext);

 		// $.each(echo.data.children, function(i, item) {
 		// 	console.log(item.data.title);
 		// });
	});

});


// Sunshine API request
function callSun() {
	var sunRequest = {
		lat: latitude,
		lng: longitude,
		date: dateToday
	};

	$.ajax({
		url: 'http://api.sunrise-sunset.org/json',
		data: sunRequest,
		dataType: 'jsonp',
		type: 'GET'
	})
	.done(function(echo) {
		console.log(echo);
		sunSet = echo.results.sunset;
		console.log(sunSet);
	});

}
var inputLocation = null;

var latitude    = null;
var longitude   = null;

var sunSet      = null;
var sunRise     = null;

var currentdate = new Date(); 
var zoneOffset  = currentdate.getTimezoneOffset() / 60;
var dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
var timeToday   = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

$(document).ready(function() {
	locationGet();
	timeStats();    
	callReddit();
});


// Google Geocode API request
function callGoogle() {
	var googleRequest = {
		address: inputLocation,
		key: 'AIzaSyBjoYUBZWys5JbkuUVznJIfnMBgfWT7iYE'
	};

	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		data: googleRequest,
		dataType: 'json',
		method: "GET"
	})
	.done(function(echo) {
		latitude  = echo.results[0].geometry.location.lat;
		longitude = echo.results[0].geometry.location.lng;
		console.log("Lat: " + latitude);
		console.log("Lng: " + longitude);
		console.log(echo);
		callSun();
	});
}

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
		sunSet = echo.results.sunset;
		console.log(sunSet);
		console.log(echo);
	});

}

// Reddit API request
function callReddit() {
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
}

function timeStats() {
    console.log("Date: " + dateToday);
    console.log("Time: " + timeToday);
    console.log("Time difference from UTC: " + zoneOffset);
    console.log("Time adjusted to UTC: " + (currentdate.getHours()-zoneOffset) + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds());
}

function locationGet() {
	$("#input-location").submit(function(event) {
		event.preventDefault();
		inputLocation = $("#location-form").val();
		console.log(inputLocation);
		callGoogle();
		$("#input-location").hide();
	});
}

function sunSet()
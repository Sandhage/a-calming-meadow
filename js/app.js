var inputLocation = null;

var latitude    = null;
var longitude   = null;

var sunState    = null;

var currentdate = new Date(); 
var zoneOffset  = currentdate.getTimezoneOffset() / 60;
var dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
var timeToday   = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

var storyTitle  = null;
var storyGuts   = null;

$(document).ready(function() {
	storytimeCheck();

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
		console.log(echo);

		latitude  = echo.results[0].geometry.location.lat;
		longitude = echo.results[0].geometry.location.lng;

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
		console.log(echo);

		sunSet = echo.results.sunset;
	});

}

// Reddit API request
function callReddit() {
	var redditRequest = {
		// q: "NOT+%28flair%3ASeries%29", 
		// restrict_sr: "on",
		sort: 'top'
		// q=NOT+%28flair%3ASeries%29&restrict_sr=on
	};

	$.ajax({
		url: 'http://www.reddit.com/r/nosleep/new.json',
		data: redditRequest,
		dataType: 'json',
		type: 'GET'
	})
	.done(function(echo) {
 		console.log(echo);

 		var randomIndex = numberGenerate();

 		storyTitle  = echo.data.children[randomIndex].data.title;
 		storyGuts   = echo.data.children[randomIndex].data.selftext;
 		
 		pushStory();
	});
}

function numberGenerate() {
    return Math.floor(Math.random() * 21);
}

function pushStory() {
	$("#story-title").append(storyTitle);
	$("#story-guts").append(storyGuts);
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

function storytimeCheck() {
	if ( sunState == "set" ) {
		$("#result").show();
	} else {
		$("#result").hide();
	}
}

function sunstateCheck() {

}

function sunSet() {

}

function sunRise() {

}
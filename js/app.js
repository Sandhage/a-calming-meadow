var inputLocation = null;

var latitude    = null;
var longitude   = null;

var sunState    = null;
var amPM        = null;
var nightTime   = null;
var dayTime     = null;

var currentdate = new Date(); 
var zoneOffset  = currentdate.getTimezoneOffset() / 60;
var dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
var timeToday   = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
var varHours    = null;

var storyTitle  = null;
var storyGuts   = null;

$(document).ready(function() {
	callReddit();

	$("#impatient-button").click(function() {
		$("#form-container").hide();

		nightTime = true;
		dayTime   = false;
		
		setScenery();
		setStory();
	});

	locationGet();
	timeStats();    

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
		console.log(sunSet);
		timeSplit(sunSet);
		sunStateCheck();

		setStory();

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

// Assign a random story and push it to HTML elements
function numberGenerate() {
    return Math.floor(Math.random() * 21);
}

function pushStory() {
	$("#story-title").append(storyTitle);
	$("#story-guts").append(storyGuts);
}

// Console command -- log the current time at user's PC
function timeStats() {
    console.log("Date: " + dateToday);
    console.log("Time: " + timeToday);
    console.log("Time difference from UTC: " + zoneOffset);
    console.log("Time adjusted to UTC: " + (currentdate.getHours() + zoneOffset) + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds());
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

function setStory() {
	if ( nightTime ) {
		$("#form-container").hide();
		$("#result").show();
	} else {
		$("#result").hide();
	}
}

function sunStateCheck() {
	if ( currentdate.getHours() >= 12 ) {
		amPM      = 'PM';
		
		if ( currentdate.getMinutes() <= 9 && currentdate.getSeconds() <= 9 ) {
			timeToday = (currentdate.getHours() - 7) + "0" + currentdate.getMinutes() + "0" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else if ( currentdate.getMinutes() >= 10 && currentdate.getSeconds() <= 9 ) {
			timeToday = (currentdate.getHours() - 7) + "" + currentdate.getMinutes() + "0" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else if ( currentdate.getMinutes() <= 9 && currentdate.getSeconds() >= 10 ) {
			timeToday = (currentdate.getHours() - 7) + "0" + currentdate.getMinutes() + "" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else {
			timeToday = (currentdate.getHours() - 7) + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		}

	} else {
		amPM     = 'AM';

		if ( currentdate.getMinutes() <= 9 && currentdate.getSeconds() <= 9 ) {
			timeToday = (currentdate.getHours() + 5) + "0" + currentdate.getMinutes() + "0" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else if ( currentdate.getMinutes() >= 10 && currentdate.getSeconds() <= 9 ) {
			timeToday = (currentdate.getHours() + 5) + "" + currentdate.getMinutes() + "0" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else if ( currentdate.getMinutes() <= 9 && currentdate.getSeconds() >= 10 ) {
			timeToday = (currentdate.getHours() + 5) + "0" + currentdate.getMinutes() + "" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		} else {
			timeToday = (currentdate.getHours() + 5) + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
			timeToday = parseInt(timeToday, 10);
		}
	}

	console.log(timeToday + " " + amPM);

	if ( timeToday == sunSet ) {
		console.log('The Sun is setting.');
	} else if ( timeToday < sunSet ) {
		console.log('The Sun has not set. Everything is calm.');
		dayTime   = true;
		nightTime = false;
	} else {
		dayTime   = false;
		nightTime = true;
		console.log('The Sun has set. Do not be afraid.')
	}

	setScenery();
}


function timeSplit(stringToSplit) {
	var firstArray  = stringToSplit.split(':');
	var noAmPm = firstArray[2].split(' ');

	sunSet = firstArray[0] + firstArray[1] + noAmPm[0];
	sunSet = parseInt(sunSet, 10);
	
	console.log(sunSet);

}

function setScenery() {

	if ( !dayTime ) {
		$("#day-video").hide();
		$("#night-video").show();
	}

}
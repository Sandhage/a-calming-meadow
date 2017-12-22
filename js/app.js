let sunSet      = null;
let sunState    = null;
let amPM        = null;
let nightTime   = null;
let dayTime     = null;

let currentdate = new Date(); 
let zoneOffset  = currentdate.getTimezoneOffset() / 60;
let dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
let timeToday   = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
let letHours    = null;

let storyTitle  = null;
let storyGuts   = null;

$(document).ready(function() {
	callReddit();

	$("#impatient-button").click(function() {
		$("#form-container").hide();
		// $("body").css(background-color: #fffdc8) -- the code here is obviously wrong, but I'm in a car and can't check my reference material
		nightTime = true;
		dayTime   = false;
		
		setScenery();
		setStory();
	});

	locationGet();
});


// Google Geocode API request
function callGoogle(inputLocation) {
	let googleRequest = {
		address: inputLocation,
		key: 'AIzaSyBjoYUBZWys5JbkuUVznJIfnMBgfWT7iYE'
	};

	$.ajax({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		data: googleRequest,
		dataType: 'json',
		method: "GET"
	})
	.done(function(resp) {
		const latitude  = resp.results[0].geometry.location.lat;
		const longitude = resp.results[0].geometry.location.lng;

		callSun(longitude, latitude);
	});
}

// Sunshine API request
function callSun(longitude, latitude) {
	const lat =  latitude;
	const lng = longitude;

	$.ajax({
		url: `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`
	})
	.done(function(resp) {
		sunSet = resp.results.sunset;
		timeSplit(sunSet);
		sunStateCheck();
		setStory();
	});

}

// Reddit API request
function callReddit() {
	let redditRequest = {
		// q: "NOT+%28flair%3ASeries%29", 
		// restrict_sr: "on",
		sort: 'top'
		// q=NOT+%28flair%3ASeries%29&restrict_sr=on
	};

	$.ajax({
		url: 'https://www.reddit.com/r/nosleep/new.json',
		data: redditRequest,
		dataType: 'json',
		type: 'GET'
	})
	.done(function(resp) {
 		let randomIndex = numberGenerate();
 		storyTitle  = resp.data.children[randomIndex].data.title;
 		storyGuts   = resp.data.children[randomIndex].data.selftext;
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

function locationGet() {
	$("#input-location").submit(function(event) {
		event.preventDefault();

		const inputLocation = $("#location-form").val();
		
		callGoogle(inputLocation);
		
		$("#input-location").hide();
		$("#impatient-button").show();
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

	if ( timeToday < sunSet ) {
		dayTime   = true;
		nightTime = false;
	} else {
		dayTime   = false;
		nightTime = true;
	}

	setScenery();
}


function timeSplit(stringToSplit) {
	let firstArray  = stringToSplit.split(':');
	let noAmPm = firstArray[2].split(' ');

	sunSet = firstArray[0] + firstArray[1] + noAmPm[0];
	sunSet = parseInt(sunSet, 10);
}

function setScenery() {
	if ( !dayTime ) {
		$("#day-video").hide();
		$("#night-video").show();
	} else {
		$(".form-text")[0].textContent = 'The Sun has not set. Everything is calm.';
	}
}
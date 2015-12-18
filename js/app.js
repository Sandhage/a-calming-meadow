$(document).ready(function() {
	var currentdate = new Date(); 
	var zoneOffset  = currentdate.getTimezoneOffset() / 60;
	var dateToday   = currentdate.getDate() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
    var timeToday   = (currentdate.getHours() - zoneOffset) + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    var sunSet      = null;
    var sunRise     = null;

    console.log("Time difference from UTC: " + zoneOffset);
    console.log("Date: " + dateToday);
    console.log("Time in UTC: " + timeToday);
    

	var sunRequest = {
		lat: 40.7127,
		lng: 74.0059,
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
 		console.log(echo.data.children[1].data.selftext);

 		$.each(echo.data.children, function(i, item) {
 			console.log(item.data.title);
 		});
	});
});
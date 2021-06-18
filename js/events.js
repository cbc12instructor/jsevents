// declare our variables
var event = 'silly'; 
var isClicked = false;

function getEl(el) {
	return document.getElementById(el);
}

var timer = null;

// current trial
var trial = 0;

// store all of our lap split times in here for JSON
var lapSplits = {
	/*
		'trial-1': [0.77,0.9],
		'trial-2': []
	*/
};

// create my event listeners when the page is ready
window.addEventListener('DOMContentLoaded', function() {

	// ask the user for their name, and greet them in our h1
	var username;
	if ( localStorage.getItem('UserName') ) {
		username = localStorage.getItem('UserName');
	} else {
		username = prompt('What is your name, friend?');
		localStorage.setItem('UserName', username);
	}
	if ( username ) {
		document.getElementById('greeting').innerHTML = 'Hello Again, ' + username;
	}

	// if we have saved lap information, lets load that into our
	// lap split times
	if ( localStorage.getItem('storedLaps') ) {

		// fetch the JSON string
		var storedLapsJsonString = localStorage.getItem('storedLaps');

		// turn the JSON string into an object
		var storedLapsObj = JSON.parse(storedLapsJsonString);

		// best performing
		// loop through all of the trials, and turn them into ordered lists
		console.time('createElement');
		for ( var key in storedLapsObj ) {
			// key == trial-# 
			// storedLapsObj[ key ] == array 
			//console.log(key);

			var ol = document.createElement('ol');
			ol.setAttribute('id', key);

			// loop through the times array, and create list items for each time
			var times = storedLapsObj[ key ];
			//console.log(times);
			times.forEach(function(time) {
				var li = document.createElement('li');
				li.innerText = 'Lap: ' + time;

				// add the li to our new ordered list
				ol.appendChild(li);
			});
			
			// and put them in the div #lapTimeSplits
			document.getElementById('lapTimeSplits').appendChild(ol);
		}
		console.timeEnd('createElement');

		// worst performing
		// console.time('innerHTML'); 
		// for ( var key in storedLapsObj ) {
		// 	// key == trial-# 
		// 	// storedLapsObj[ key ] == array 
		// 	//console.log(key);

		// 	var htmlOutput = '<ol id="' + key + '">';

		// 	// loop through the times array, and create list items for each time
		// 	var times = storedLapsObj[ key ];
		// 	//console.log(times);

		// 	times.forEach(function(time) {
		// 		htmlOutput = htmlOutput + '<li>Lap: ' + time + '</li>';
		// 	});
			
		// 	htmlOutput = htmlOutput + '</ol>';

		// 	// and put them in the div #lapTimeSplits
		// 	//console.log(htmlOutput);
		// 	document.getElementById('lapTimeSplits').innerHTML = document.getElementById('lapTimeSplits').innerHTML + htmlOutput;
		// }
		// console.timeEnd('innerHTML');

		

	
		// // second best performing
		// // loop through all of the trials, and turn them into ordered lists
		// console.time('createElementInefficiently');
		// for ( var key in storedLapsObj ) {
		// 	// key == trial-# 
		// 	// storedLapsObj[ key ] == array 
		// 	//console.log(key);

		// 	var ol = document.createElement('ol');
		// 	ol.setAttribute('id', key);

		// 	// and put them in the div #lapTimeSplits
		// 	document.getElementById('lapTimeSplits').appendChild(ol);

		// 	// loop through the times array, and create list items for each time
		// 	var times = storedLapsObj[ key ];
		// 	//console.log(times);
		// 	times.forEach(function(time) {
		// 		var li = document.createElement('li');
		// 		li.innerText = 'Lap: ' + time;

		// 		// add the li to our new ordered list
		// 		document.getElementById(key).appendChild(li);
		// 	});
		// }
		// console.timeEnd('createElementInefficiently');




	}



	// prototype the store time on server mechanism
	document.getElementById('storeTimes').addEventListener('click', function(e) {
		// turn the lapSplits object into a JSON string
		var storedLaps = JSON.stringify(lapSplits);

		// send it to a server #serverDebug
		// todo(erh): actually send this to the server in the future
		// lets store this in localStorage for now.
		var p = document.createElement('p');
		p.innerText = storedLaps;
		document.getElementById('serverDebug').appendChild(p);
		localStorage.setItem('storedLaps', storedLaps);

		// when the server responds, clear the object
		// and clear the page times.
		setTimeout(function() {
			lapSplits = {};
			document.getElementById('lapTimeSplits').innerHTML = '<ol id="lapTimes"></ol>';
			console.log('the server save was correct');
		}, 3000);
	});

	document.getElementById('stopTimer').addEventListener('click', function() {
		// grab current lap times list
		var ol = document.getElementById('lapTimes');

		// remove it's id
		ol.setAttribute('id', '');

		// create new ordered list for the next cycle
		var newOl = document.createElement('ol');
		newOl.setAttribute('id', 'lapTimes');
		document.getElementById('lapTimeSplits').appendChild(newOl);

		// clear our timers and reset the main clock to 0.
		clearInterval(timer);
		timer = null;
		document.getElementById('startTimer').innerHTML = 'Start Timer';
		document.getElementById('interval').innerHTML = '0';
	});

	document.getElementById('startTimer').addEventListener('click',
		function() {
			if ( timer == null ) {

				trial = trial + 1;
				lapSplits[ 'trial-' + trial ] = [];

				this.innerHTML = 'Start Next Lap';

				timer = setInterval(function() {
					var intValue = parseInt(document.getElementById('interval').innerHTML);
					document.getElementById('interval').innerHTML = intValue + 1;
				}, 1);
	
				
			} else {
				var intValue = parseInt(document.getElementById('interval').innerHTML);
				var ul = document.getElementById('lapTimes');
				var lapTimeLi = document.createElement('li');

				// generate the current lap time
				var currentLapTime = (intValue / 1000);

				// write that lap time to our obj
				lapSplits[ 'trial-' + trial ].push(currentLapTime);

				// display lap times on the page
				lapTimeLi.innerHTML = 'Lap: ' + currentLapTime;
				
				ul.appendChild(lapTimeLi);
			}
		}
	);

	document.addEventListener('mousedown', function() {
		isClicked = true;
		console.log(isClicked);
		document.getElementById('clicked').innerHTML = 'yes';
	});
	document.addEventListener('mouseup', function() {
		isClicked = false;
		document.getElementById('clicked').innerHTML = 'no';
	});

	document.addEventListener('mousemove', function(event) {
		if ( isClicked ) {
			//console.log(event);

			document.getElementById('x').innerHTML = event.pageX;
			document.getElementById('y').innerHTML = event.pageY;
		}
	});

	document.addEventListener(
		'click', 
		function (event) {
			if ( event.target.getAttribute('id') == 'someButton' ) {
				//console.log(event);
				//console.log(event.target);
			}
		}
	);


});
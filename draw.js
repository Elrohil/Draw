window.onload = function() {
	
	document.ontouchmove = function(e) { e.preventDefault(); };

	// JSON notation describing properties of drawing
	var draw = {
		fill: '#000000',
		stroke: '#000000',
		clear: '#ffffff',
		size: 5,
		cap: 'round',
		join: 'round',
		width: 300,
		height: 300
	};

	var canvas = document.getElementById('main');
	var canvastop = canvas.offsetTop;

	var context = canvas.getContext('2d');

	var lastX;
	var lastY;

	// Clear function for btn, just makes the canvas totally white.
	function clear() {
		context.fillStyle = draw.clear;
		context.rect(0, 0, draw.width, draw.height);
		context.fill();
	}

	// Sets up the housekeeping for drawing, that way
	// it needs not be defined with each drawing operation.
	// Instead it uses moves as a callback function that can
	// be redefined as an anonymous function in each function
	// which defines a style of drawing (see dot and line)
	function path(moves) {
		context.beginPath();
		context.strokeStyle = draw.stroke;
		context.fillStyle = draw.fill;
		context.lineCap = draw.cap;
		context.lineJoin = draw.join;
		context.lineWidth = draw.size;

		moves();

		context.fill();
		context.stroke();
		context.closePath();
	}

	// The anonymous function is the move() function from above
	function dot(x,y) {
		path(function() {
			context.arc(x, y, 1, 0, Math.PI * 2, true);
		});
	}

	// The anonymous function is the move() function from above
	function line(x1, y1, x2, y2) {
		path(function() {
			context.moveTo(x1, y1);
			context.lineTo(x2, y2);
		});
	}

	// Handles the house keeping for the touch events
	// params: touch event(gets the finger pos.) 
	// and callback function (causes drawing action to occur)
	function position(event, action) {
		event.preventDefault();

		var newX = event.touches[0].clientX;
		var newY = event.touches[0].clientY - canvastop;

		// Callback logic
		action(lastX, lastY, newX, newY);

		lastX = newX;
		lastY = newY;
	}

	// Anon function is the action function above
	canvas.ontouchstart = function(event) {
		position(event, function(lastX, lastY, newX, newY) {
			dot(newX, newY);
		});
	};

	// Anon function is the action function above
	canvas.ontouchmove = function(event) {
		position(event, function(lastX, lastY, newX, newY) {
			line(lastX, lastY, newX, newY);
		});
	};

	// JSON for buttons
	var buttons = {
		clear: document.getElementById('clear'),
		red: document.getElementById('red'),
		green: document.getElementById('green'),
		blue: document.getElementById('blue'),
		save: document.getElementById('save'),
		restore: document.getElementById('restore')
	}

	// Set the color equal to id of button element
	function setcolor(event) {
		draw.fill = event.target.id;
		draw.stroke = event.target.id;
	}

	buttons.clear.onclick = clear;
	buttons.red.onclick = setcolor;
	buttons.green.onclick = setcolor;
	buttons.blue.onclick = setcolor;

	var imagedata;

	buttons.save.onclick = function() {
		imagedata = context.getImageData(0, 0, draw.width, draw. height);
		buttons.save.style.display = 'none';
		buttons.restore.style.display = 'inline';

	}

	buttons.restore.onclick = function() {
		context.putImageData(imagedata, 0, 0);
		buttons.save.style.display = 'inline';
		buttons.restore.style.display = 'none';

	}



	clear();  // this ensures there is nothing on the canvas at the start
}
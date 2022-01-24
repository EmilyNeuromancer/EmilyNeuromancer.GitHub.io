/*
 * shim layer with setTimeout fallback
 * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimFrame = (function () {
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


/*
 * FX will be our global object
 */
var FX = {};

/*
 * basic canvas variables
 */
FX.canvas = document.createElement('canvas');

document.body.appendChild(FX.canvas);
FX.canvas.width = window.innerWidth;
FX.canvas.height = window.innerHeight;
FX.ctx = FX.canvas.getContext('2d');
FX.width = window.innerWidth;
FX.height = window.innerHeight;



/*
 * FX.entity constructs, draws and updates geometric shapes
 * @return	Object	public functions
 * 			create : create a new rectangle with given config
 * 			drawAll : draws all rectangles in their current state
 */
FX.entity = (function () {

	var entities = []; //array with all shapes

	/*
	 * constructor for new rectangles
	 * @param	Object	args	configuration object
	 * 				x : X-Position (centered)
	 * 			 	y : Y-Position (centered)
	 * 			 	w : width
	 * 			 	h: height
	 * 			 	r : rotation
	 * 			 	s : rotation-speed
	 * 			 	c : color
	 */
	var construct = function (args) {

		this.sincount = 0; //helper variable for sinus transform-transitions
		this.lifetime = 90;

		this.x = args.x;
		this.y = args.y;
		this.w = args.w;
		this.h = args.h;
		this.r = args.r;
		this.s = args.s;
		this.c = args.c;
	};

	/*
	 * creates a new shape with given config
	 * @param	Object	args	configuration object
	 * @return	Object	a new "construct"-Object
	 */
	var create = function (args) {

		var defaults = {
			x : FX.width / 2,
			y : FX.height / 2,
			w : 40,
			h : 40,
			r : 0,
			s : 1,
			c : FX.gradient.get()
		};

		//merge defaults with given args
		for (var key in args) {
			defaults[key] = args[key];
		}

		var newborn = new construct(defaults);

		//save the newborn in the entities-array
		entities.push(newborn);
	};

	/*
	 * updates the parameters of a single entity
	 */
	var update = function (index) {

		//e is our entity
		var e = entities[ index ];

		//update rotation
		e['r'] += e['s'];

		//update sincount
		e['sincount'] = e['sincount'] + 0.05;
		if (e['sincount'] > 180) {
			e['sincount'] = 0;
		}

		//update scaling in a sinus-kinda way
		e['w'] *= (1 + Math.sin( FX.rad(e['sincount']) ));
		e['h'] *= (1 + Math.sin( FX.rad(e['sincount']) ));

		//drain lifepoints
		drain(index);
	};

	/*
	 * reduces the lifetime by 1
	 * if lifetime is zero, destroy the entity
	 */
	var drain = function (index) {

		//e is our entity
		var e = entities[ index ];

		e['lifetime']--;

		if (e['lifetime'] <= 0) {
			entities.splice(index, 1);
		}
	};

	/*
	 * draws a single entity
	 */
	var draw = function (index) {
		var e = entities[ index ],
			polys = [];


		//set stroke color
		FX.ctx.strokeStyle = e.c;

		/*
		 * RECTANGLE START
		 * @see http://stackoverflow.com/questions/644378/drawing-a-rotated-rectangle
		 * I'm sure this could've been made easier, but I wanted to calculate the rectangle on my own
		 * You can draw anything here, or add/remove polys, to alter the shape
		 * You can comment this block out and uncomment the block below, "CIRCLE START", to switch to circles
		 */

		//top left corner
		polys.push([
			e.x + ( e.w / 2 ) * Math.cos(FX.rad(e.r)) - ( e.h / 2 ) * Math.sin(FX.rad(e.r)),
			e.y + ( e.h / 2 ) * Math.cos(FX.rad(e.r)) + ( e.w / 2 ) * Math.sin(FX.rad(e.r))
		]);

		//top right corner
		polys.push([
			e.x - ( e.w / 2 ) * Math.cos(FX.rad(e.r)) - ( e.h / 2 ) * Math.sin(FX.rad(e.r)),
			e.y + ( e.h / 2 ) * Math.cos(FX.rad(e.r)) - ( e.w / 2 ) * Math.sin(FX.rad(e.r))
		]);

		//bottom left corner
		polys.push([
			e.x - ( e.w / 2 ) * Math.cos(FX.rad(e.r)) + ( e.h / 2 ) * Math.sin(FX.rad(e.r)),
			e.y - ( e.h / 2 ) * Math.cos(FX.rad(e.r)) - ( e.w / 2 ) * Math.sin(FX.rad(e.r))
		]);

		//bottom right corner
		polys.push([
			e.x + ( e.w / 2 ) * Math.cos(FX.rad(e.r)) + ( e.h / 2 ) * Math.sin(FX.rad(e.r)),
			e.y - ( e.h / 2 ) * Math.cos(FX.rad(e.r)) + ( e.w / 2 ) * Math.sin(FX.rad(e.r))
		]);


		FX.ctx.beginPath();
		FX.ctx.moveTo(polys[0][0], polys[0][1]);
		for (var i = 1, k = polys.length; i < k; i = i + 1) {
			FX.ctx.lineTo(polys[i][0], polys[i][1]);
		}
		FX.ctx.lineTo(polys[0][0], polys[0][1]);

		/*
		 * RECTANGLE END
		 */

		/*
		 * CIRCLE START
		 */

		/*
		 FX.ctx.beginPath();
		 FX.ctx.arc(e.x,e.y,e.w,0,Math.PI*2,true); // Outer circle
		 */

		/*
		 * CIRCLE END
		 */


		//draw the defined paths
		FX.ctx.stroke();
	};

	/*
	 * Loop over all entites, update and draw each
	 */
	var drawAll = function () {

		for (var i in entities) {
			update(i);
			draw(i);
		}
	};

	return {
		create:create,
		drawAll:drawAll
	};
})();


/*
 * FX.spawn handles the spawning of new entities
 * @return Object	public functions
 * 			update : update spawn counter, spawn if nessessary
 */
FX.spawn = (function () {

	var 	countdown = 5,	//each 5 iterations, spawn an entity
		rotation = 0,	//current spawn rotation
		sin = 0;	//spawn sinus for x/y spawn

	/*
	 * decrease spawn countdown, increase sinus,
	 * spawn a new entity if nessessary
	 */
	var update = function () {

		sin++;
		countdown--;

		if (sin > 359) {
			sin = 0;
		}

		if (countdown === 0) {
			spawn();
			countdown = 5;
		}
	};

	/*
	 * create a new entity
	 */
	var spawn = function () {

		var cx = FX.width / 2;
		var cy = FX.height / 2;

		//inrease the rotation by 5 with each spawn
		rotation = rotation + 5;

		FX.entity.create({
			x:cx + Math.sin(FX.rad(sin)) * 100,
			y:cy + Math.sin(FX.rad(sin)) * 100,
			r:rotation

			/*
			 * uncomment this to have sinus-depening shape sizes
			 */
			/*
			 , w : 40 + Math.sin( FX.rad( sin )) * 20,
			 h : 40 + Math.sin( FX.rad( sin )) * 20
			 */
		});
	};

	return {
		update : update
	};
})();


/*
 * FX.gradient provides methods to generate a color gradient in X Steps
 * @return Object	public functions
 * 			get: get the next gradient color
 */
FX.gradient = (function () {

	var 	amount = 32, 		//how many steps
		start = [255, 196, 0],	//startcolor, RGB
		end = [5, 239, 209],	//endcolor, RGB

		currentStep = 0,	//index of current step
		steps = [],		//a single gradient step
		colors = [];		//array with all gradient steps


	/*
	 * create single gradient out of start & end
	 */
	var create = (function () {

		//calculate single step size by color channel
		steps = [
			( start[0] - end[0] ) / amount, //R
			( start[1] - end[1] ) / amount, //G
			( start[2] - end[2] ) / amount  //B
		];

		//save each gradient step in colors[]
		for (var i = 0; i <= amount; i = i + 1) {
			colors[i] = [
				Math.round(start[0] - steps[0] * i), //R
				Math.round(start[1] - steps[1] * i), //G
				Math.round(start[2] - steps[2] * i)  //B
			];
		}
	})();

	/*
	 * set the next gradient step
	 */
	var next = function () {
		currentStep++;
		if (currentStep >= amount) {
			currentStep = 0;
		}
	};

	/*
	 * Get the next gradient color as rgb
	 * @return	String	rgb()
	 */
	var get = function () {

		next();
		return "rgb(" + colors[currentStep][0] + ", " + colors[currentStep][1] + ", " + colors[currentStep][2] + ")";
	};

	return {
		get : get
	};
})();


/*
 * FX.loop is our main loop
 */
FX.loop = function () {

	//clear the canvas
	FX.ctx.clearRect(0, 0, FX.canvas.width, FX.canvas.height);

	//update the spawn
	FX.spawn.update();

	//draw all available entities
	FX.entity.drawAll();

	//request next loop
	requestAnimFrame(FX.loop);
};

/*
 * Converts degrees to radients
 * @param	Number	deg	The degrees to be convertet
 * @return	Number	the radient value
 */
FX.rad = function (deg) {
	return deg * Math.PI / 180;
};



/*
 * Call the loop for the first time
 */
//FX.loop();
var game = {
  start: function () {
    // This function sets up the game and it's objects
    var player = game.object.create(
      -32, // x
      game.canvas.height / 2 // y
    );
    player.start = function () {
      this.speed = 4;
      this.direction = 0; // Not moving
    };
    player.update = function () {
      if (game.input.keyboard["a"] || game.input.keyboard["ArrowLeft"]) {
        this.direction = -1;
      } else if (game.input.keyboard["d"] || game.input.keyboard["ArrowRight"]) {
        this.direction = 1;
      } else {
        this.direction = 0;
      }

      this.position.x += this.direction * this.speed;
      this.position.y = (Math.sin(game.time) * game.canvas.height / 4) + game.canvas.height / 2;

      // Wrap around the screen horizontally
      if (this.position.x > game.canvas.width) {
        this.position.x = -32;
      } else if (this.position.x < -32) {
        this.position.x = game.canvas.width;
      }
    };
    player.paint = function () {
      game.canvas.context.fillRect(
        this.position.x,
        this.position.y,
        32,
        32
      );
    };

    // Start all game objects regardless of state
    for (var object = 0; object < game.objects.length; object++) {
      game.objects[object].start();
    }
  },
  update: function () {
    // This function advances each object by one step
    switch (game.state) {
      case game.states.playing:
        if (game.objects.length > 0) {
          for (var object = 0; object < game.objects.length; object++) {
            game.objects[object].update();
          }
        }
        break;
      case game.states.paused:

        break;
      default:
        break;
    }

    game.time += 1 / 60; // The game runs at 60 frames per second
    window.requestAnimationFrame(game.update);
  },
  paint: function () {
    // This function is used for displaying graphics to the player
    game.canvas.clear();

    // Draw different things depending on the current  game state
    switch (game.state) {
      case game.states.playing:
        for (var object = 0; object < game.objects.length; object++) {
          game.objects[object].paint();
        };
        break;
      case game.states.paused:

        break;
      default:
        break;
    }

    window.requestAnimationFrame(game.paint);
  },
  clean: function () {
    // This function removes any game objects marked as 'destroyed'
    // from the global collection

    // This loop iterates backwards to deal with
    // the array changing size as it iterates
    for (var object = game.objects.length - 1; object >= 0; object--) {
			if (game.objects[object].destroyed) {
				game.objects.splice(object, 1);
			}
		}

    window.requestAnimationFrame(game.clean);
  },
  states: {
    playing: 0,
    paused: 1
  },
  state: 0, // Playing
  time: 0, // The amount of time in seconds elapsed during play
  object: {
    prototype: {
      destroyed: false,
      position: {
        x: 0,
        y: 0
      },
      start: function () {},
      update: function () {},
      paint: function () {}
    },
    create: function (x, y) {
      // This function is used for creating a new kind of object
      // and pushing it onto the array
      var object = game.object.prototype;
      object.position.x = x;
      object.position.y = y;

      game.objects.push(object);

      return object;
    },
    clone: function (object, x, y) {
      // This function is used to create a copy of an existing game prototype
      object.x = x;
      object.y = y;

      game.objects.push(object);

      return object;
    }
  },
  objects: [], // Starts out with no objects, but they can be added later
  canvas: {
    node: $("game")[0],
    context: $("#game")[0].getContext("2d"),
    width: $("#game")[0].width,
    height: $("#game")[0].height,
    clear: function () {
      this.context.clearRect(
        0, // x
        0, // y
        this.width,
        this.height
      );
    }
  },
  input: {
		keyboard: [],
		handle: function () {
			$("body").on("keydown", function (event) {
				game.input.keyboard[event.key] = true;
			});

			$("body").on("keyup", function (event) {
				 game.input.keyboard[event.key] = false;
			});
		}
	}
};

$("document").ready(function () {
  // Begin the game loop
  game.start();
  game.input.handle();

  window.requestAnimationFrame(game.update);
  window.requestAnimationFrame(game.paint);
  window.requestAnimationFrame(game.clean);
});

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

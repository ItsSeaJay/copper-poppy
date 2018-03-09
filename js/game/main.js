var game = {
  start: function () {
    // This function sets up the game and it's objects
    var player = game.object.create(
      game.canvas.width / 2, // x
      game.canvas.height / 2 // y
    );
    player.update = function () {

    };
    player.paint = function () {
      game.canvas.context.fillRect(
        this.position.x,
        this.position.y,
        32,
        32
      );
    };

    console.log(player.x, player.y);
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

    // TODO: Collect garbage from objects array

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
      var object = game.object.prototype;
      object.position.x = x;
      object.position.y = y;

      game.objects.push(object);

      return object;
    },
    clone: function (object, x, y) {
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
  }
};

$("document").ready(function () {
  // Begin the game loop
  game.start();

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

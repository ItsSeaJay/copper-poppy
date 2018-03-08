var game = {
  init: function () {

  },
  play: function () {
    
  },
  draw: function () {

  },
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
  // TODO: start game loop
});

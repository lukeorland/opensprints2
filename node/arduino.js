// Connecting to the arduino and configuring its gpio pin.
// Each "up" on a sensor is a "tick".

var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var ticks = 0;

  // Create an Led on pin 9
  var led = new five.Led(9);

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance
  button = new five.Button(2);

  // Inject the `button` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button: button
  });

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
    console.log("down");
    led.toggle();
    ticks++;
    if (ticks % 10 === 0) {
      console.log(ticks + " ticks");
    }
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
    led.toggle();
  });

});

// Connecting to the arduino and configuring its gpio pin.
// Each "up" on a sensor is a "tick".

var five = require("johnny-five");
var DEFAULT_NUM_BIKES = 4;
var LED_PINS = [9, 10, 11, 12, 13];
var SENSOR_PINS = [2, 3, 4, 5, 6];

function HubHw(senseFunctions) {

  this.board = new five.Board();

  this.board.on("connected", function() {
    console.log("The board is connected.");
  });

  this.board.on("ready", function() {
    console.log("The board is ready.");

    function setupButton(i) {
      // Create the LEDs:
      var led = new five.Led(LED_PINS[i]);

      // Create the sensors:
      var button = new five.Button({
        pin: SENSOR_PINS[i],
        isPullup: true
      });

      button.on("down", function() {
        led.on();
        senseFunctions[i]();
      });

      button.on("up", function() {
        led.off();
      });
    }

    for (i = 0; i < senseFunctions.length; i++) {
      setupButton(i);
    }
  });

  this.board.on("error", function() {
    console.log("The board connection has an error.");
  });

  this.board.on("message", function(event) {
    console.log(
      "Received a %s message, from %s, reporting: %s",
      event.type, event.class, event.message
    );
  });
}

module.exports.HubHw = HubHw;

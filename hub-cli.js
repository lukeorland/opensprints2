var hubHw = require("./node/hub-hw");

var NUM_RACERS = 4;
var counts = [];
var tickFunctions = [];

for (i = 0; i < NUM_RACERS; i++) {
  // Initialize counts
  counts.push(0);

  // Initialize tickFunctions
  function sensorFunctionFactory(i) {
    return function() {
      counts[i] += 1;
      console.log("Racer %s has %s ticks", i, counts[i]);
    };
  }

  tickFunctions.push(sensorFunctionFactory(i));
}

var opensprintsHubHw = new hubHw.HubHw(tickFunctions);

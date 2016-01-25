// Exposes websocket connections for starting/stopping a race. Publishes race status updates.

class Race() {
    distanceTicks = 0;
    durationSeconds = 0.0;
    status = nil;
}

// WAMP Router:

// Subscribes to commands:
// - start
// - stop

// Publishes updates:
// - waiting (every second)
// - countdown seconds
//    - ticks for each racer
// - started race seconds
//    - ticks for each racer
// - finished race results
//    - ticks for each racer


// com.opensprints.race

// TODO: set up WAMP router http://crossbar.io/docs/Getting-started-with-NodeJS/
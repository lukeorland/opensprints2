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

setTimeout(function() {
    streeem.push({
            "time-elapsed-ms": race.timeElapsedMs,
            "racer-ticks": {
                "0": racers[0].ticks,
                "1": racers[1].ticks,
                "2": racers[2].ticks,
                "3": racers[3].ticks
            }
        }
    );
}, race.config.updatePeriod);

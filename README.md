# opensprints2
OpenSprints goldsprints software, rewritten in Node.js.

This is an Electron application based on the [Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start) within the Electron documentation.

A basic Electron application needs just these files:

- `index.html` - A web page to render.
- `main.js` - Starts the app and creates a browser window to render HTML.
- `package.json` - Points to the app's main file and lists its details and dependencies.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/lukeorland/opensprints2
# Go into the repository
cd opensprints2
# Install dependencies and run the app
npm install && npm start
```


# hub

The *hub* is a

The application running in the client browser controls race logic, such as seconds seconds of countdown, false starts, distance race or time trial, etc. In other words, the hub is completely ignorant of details of the race, including the distance or duration or countdown seconds. It only handles:

- connecting to hardware
- waiting for the race to begin
- once the race starts, reporting timestamped counts of ticks
- once the race starts, watching for a command to stop


# The *hub* has a web API.

## `GET /hub/hw/`

Responds with one of the following:

```json
{
    "state": "ready"
}
```
or
```json
{
    "state": "connecting"
}
```
or
```json
{
    "state": "disconnected"
}
```
or
```json
{
    "state": "error",
    "description": "unsupported firmware version"
}
```

## `POST /hub/hw/`

Expects one of the following payloads:

(The following is the default hardware configuration.)
```json
{
    "configuration": {
        "input-pins": [2, 3, 4, 5],
        "led-pins": [13, 14, 15, 16]
    }
}
```

## `GET /hub/race/`

Responds with one of the following:

```json
{
    "state": "started"
}
```
or
```json
{
    "state": "stopped"
}
```

## `POST /hub/race/`

Expects one of the following payloads:

```json
{
    "state": "started"
    "configuration": {
        "update-period-ms": 20
    }
}
```
The above value of 20 ms for `"update-period-ms"` would support 50 frames per second animation.

or
```json
{
    "state": "stopped"
}
```


## `POST /hub/xmas-tree/`

```json
{
    "race-indicators": {
        "0": "green",
        "1": "red",
        "2": "green",
        "3": "red",
    }
}
```


# The *hub* is a WAMP-compatible websocket router.

- More about WAMP and Node.js: http://crossbar.io/docs/Getting-started-with-NodeJS/


While the race `"state"` is `"started"`, the *hub* publishes status messages on the websocket:

```json
{
    "time-elapsed-ms": 12345,
    "racer-ticks": {
        "0": 42,
        "1": 43,
        "2": 44,
        "3": 40
    }
}
```

The initial status message will match the following:
```json
{
    "time-elapsed-ms": 0,
    "racer-ticks": {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0
    }
}
```

All Node.js application code is in `hello/node/hello.js`. The backend is called from JavaScript, which is in `hello/web/index.html`.


# TODO:

- [ ] Rename `hello` to `reports`
- [ ] Evaluate replacing crossbar with https://github.com/christian-raedel/nightlife-rabbit (node-based instead of python-based).

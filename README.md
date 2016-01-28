# opensprints2
OpenSprints goldsprints software, rewritten in Node.js.

The *hub* is a

The application running in the client browser controls race logic, such as seconds seconds of countdown, false starts, distance race or time trial, etc.

# The *hub* has a web API.

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
}
```
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

# The *hub* is a websocket router.

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

All Node.js application code is in `hello/node/hello.js`. The backend is called from JavaScript, which is in `hello/web/index.html`.


# TODO:

- Evaluate replacing crossbar with https://github.com/christian-raedel/nightlife-rabbit (node-based instead of python-based).

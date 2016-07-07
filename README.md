# opensprints2

OpenSprints goldsprints software, rewritten in Node.js.

## To Use

### Initial setup

To clone and run this repository you'll need [Git](https://git-scm.com) and
[Node.js](https://nodejs.org/en/download/) (which includes
[npm](http://npmjs.com)) installed on your computer. From your command line:

```sh
# Clone this repository
git clone https://github.com/lukeorland/opensprints2
# Go into the repository
cd opensprints2
# Install dependencies and run the app
npm install
```

Make sure the Arduino has been flashed with the
[firmata sketch](https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting).

### Running

Make sure the Arduino is connected. Then run:

```sh
node hub-cli.js
```

When the magnet is passed by the sensor, update messages should be printed to
the terminal.

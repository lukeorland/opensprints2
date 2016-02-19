/*eslint-env node*/
/*jshint node: true*/
/*jshint esversion: 6 */
'use strict';

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

var nightlife = require('nightlife-rabbit');
var autobahn = require('autobahn');
var http = require('http');
var raceMonitor = require('node/raceMonitor.js');

function raceInteraction() {

  var myRaceMonitor = raceMonitor.RaceMonitor();
  // Create a secure webserver as transport for the WebSocket connections.
  var transport = http.createServer();

  // Create a router which use previously created webserver,
  // listen on specified port and path and don't create realms
  // automatically when requested. The router constructor itself
  // call the webserver.listen method and reject new sessions,
  // if the requested realm doesn't exists.
  var router = nightlife.createRouter({
    httpServer: transport,
    port: 9000,
    path: '/ws',
    autoCreateRealms: false
  });

  // Create an example realm.
  router.createRealm('realm1');

  var connection = new autobahn.Connection({
    url: 'ws://127.0.0.1:9000/ws',
    realm: 'realm1'
  });

  connection.onopen = function(session) {

    // publish an event
    const numRacers = 4;
    setInterval(function() {
      session.publish('com.opensprints.race.ticks', myRaceMonitor.ticksForRacers, {}, {
          acknowledge: true
        })
        .then(

          function(publication) {
            console.log("published, publication ID is ", publication);
          },

          function(error) {
            console.log("publication error", error);
          }
        );
    }, 200);

    // session.register('com.opensprints.race.start')
    //   myRaceMonitor.start();
    //   session.publish('com.opensprints.race.state', {'state': 'started'})
    // session.register('com.opensprints.race.stop')
    //   myRaceMonitor.stop();
    //   session.publish('com.opensprints.race.state', {'state': 'stopped'})
  };

  connection.open();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  raceInteraction();
});

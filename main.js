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
var fs = require('fs');


function wampStuff() {
  // Create a secure webserver as transport for the WebSocket connections.
  var transport = http.createServer();

  // Create a router which use previously created webserver,
  // listen on specified port and path and don't create realms
  // automatically when requested. The router constructor itself
  // call the webserver.listen method and reject new sessions,
  // if the requested realm doesn't exists.
  var router = nightlife.createRouter({
    httpServer: transport,
    port: 8080,
    path: '/secure-nightlife',
    autoCreateRealms: false
  });

  // Create an example realm.
  router.createRealm('com.example.inge');

  // Create an example service which return a random integer when called.
  // This service maybe runs on a different machine or in the browser.
  var serviceA = new autobahn.Connection({
    url: 'ws://localhost:8080/secure-nightlife',
    realm: 'com.example.inge'
  });

  serviceA.onopen = function(session) {
    session.register('com.example.random', function(args, kwargs, details) {
        return Math.floor(Math.random() * Math.pow(2, 53));
      })
      .then(function(registration) {
        console.log('service with id %d registered.', registration.id);
      })
      .catch(function(err) {
        console.log('cannot register service!');
        process.exit(2);
      })
      .done();
  };

  serviceA.onclose = function(reason) {
    console.log('service closed', reason);
    process.exit(2);
  };

  setTimeout(function() {
    serviceA.open();
  }, 500);

  // Create an example service which will populate the
  // current datetime every two secundes.
  // Clients can subscribe to this topic in the same manner.
  var serviceB = new autobahn.Connection({
    url: 'ws://localhost:8080/secure-nightlife',
    realm: 'com.example.inge'
  });

  serviceB.onopen = function(session) {
    session.subscribe('com.example.time', function() {})
      .then(function(subscription) {
        console.log('subscribed to topic.', subscription.id);

        setInterval(function() {
          session.publish('com.example.time', [new Date().getTime()]);
        }, 1927);
      })
      .catch(function(err) {
        console.log('cannot subscribe to topic!', err);
      })
      .done();
  };

  serviceB.onclose = function(reason) {
    console.log('service closed', reason);
    process.exit(2);
  };

  setTimeout(function() {
    serviceB.open();
  }, 500);
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

  wampStuff();
});

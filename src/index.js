import './app.css'

console.log("hello world!");
const io = require('socket.io-client');
var socket = io();
socket.on('news', function (data) {
  console.log(data);
});
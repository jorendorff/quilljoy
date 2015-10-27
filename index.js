"use strict";

var app = require('express')();
var server = require('http').Server(app);
var io = require('slow.io')(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var text = "";

io.on('connection', function (socket) {
  // When we receive a delta from the user, broadcast it to all other users.
  socket.on('edit', function (delta, fullText) {
    socket.broadcast.emit('edit', delta);
    text = fullText;  // yes, this is a super lame hack
  });

  // Send the current document to the newly connected user.
  socket.emit('init', text);
});

var port = Number(process.env.PORT) || 3001;
server.listen(port, function () {
  console.log('listening on *:' + port);
});

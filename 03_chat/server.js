var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8080;
var users = [];

app.use(express.static(path.join(__dirname, "public")));
app.use('/bower_components',express.static(__dirname+'/bower_components'));

io.on('connection', function(socket) {
  console.log('new connection made');

  // Show all users when first logged on
  socket.on('get-users',function(){
  	socket.emit('all-users',users);
  });

  // When new socket joins
  socket.on('join',function(data){
  	socket.nickname = data.nickname;
  	users[socket.nickname]=socket;
  	var userObj = {
  		nickname:data.nickname,
  		socketid:socket.id
  	};
  	users.push(userObj);
  	io.emit('all-users', users);
  });
  // Broadcast the message
socket.on('send-message',function(data){
  // socket.broadcast.emit('message-received',data);
  io.emit('message-received',data)
});

  // Send a 'like' to the user of my choice
  socket.on('send-like', function(data){
    console.log(data);
    socket.broadcast.to(data.like).emit('user-liked',data);
  })
  // Disconnect from socket
  socket.on('disconnect',function(){
    users = users.filter(function(item){
      return item.nickname!==socket.nickname;


    })
    io.emit('all-users', users)
  })

});



server.listen(port, function() {
  console.log("Listening on port " + port);
});
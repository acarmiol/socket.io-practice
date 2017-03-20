const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var port = 8001;


app.use(express.static(path.join(__dirname,'public')));

io.on('connection',socket=>{
	console.log('new connection made');

	socket.emit('message-from-server',{
		greeting:'Hello from 🏄'
	});
	socket.on('message-from-client',msg=>{
		console.log(msg);
	});

});

server.listen(port,function(){
	console.log(`running on port ${port}`);
});
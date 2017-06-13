const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(3000).sockets;


// conecting to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function(err,db){

	if (err) {
		throw err
	}
	
	client.on("connection", function(socket){

		let chat = db.collection('chats');//coneccting to the chats collection in mongo
		sendStatus = function(s){
			socket.emit('status', s);
		
		};

		chat.find().limit(100).sort({_id:1}).toArray(function(err,res) {
			if (err) {
				throw err;
			}
			socket.emit('output', res);
		});
			socket.on('input', function(data) {
				var name = data.name;
				var message = data.message;

				if (name == '' || message == '') {
					sendStatus('Please fill in the name and message');
				} else {
					chat.insert({name: name, message: message}, function(){
						client.emit('output', [data]);

						sendStatus({
							message: 'Message Sent',
							clear:true
						});
					});

				}
			});	

			socket.on('clear', function(data){
				chat.remove({}, function(){
					socket.emit('cleared')
				
				});
			});
	});
});
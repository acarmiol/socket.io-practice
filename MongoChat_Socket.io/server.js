const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(3000).sockets;


// conecting to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', (err,db) =>{

	if (err) {
		throw err;
	}
	console.log("Listening  & Mongo DB Connected...");
	client.on("connection", (socket) => {
		let chat = db.collection('chats');//coneccting to the chats collection in mongo

		sendStatus = (s) => {
			socket.emit('status', s);
		}

		chat.find().limit(100).sort({_id:1}).toArray((err,res) =>{
			if (err) {
				throw err;
			}
			socket.emit('output', res);
		});
			socket.on('input', (data) => {
				const name = data.name;
				const message = data.message;

				if (name == '' || message == '') {
					sendStatus('Please fill in the name and message');
				} else {
					chat.insert({name: name, message:message},()=>{
						client.emit('output', [data]);

						sendStatus({
							message: 'Message Sent',
							clear:true
						});
					});

				}
			});	

			socket.on('clear', ()=> {
				chat.remove({}, ()=>{
					socket.emit('cleared')
				});
			});

	});
});
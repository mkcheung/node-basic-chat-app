const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const PORT = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connection established');



	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)){
			callback('Name and Room Name are needed');
		}

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('newMessage', generateMessage("admin", "Welcome to the chat app"));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage("admin", `${params.name} has joined`));

		callback();
	});

	socket.on('createMessage', (msgToCreate, callback) => {
		let user = users.getUser(socket.id);

		if(user && isRealString(msgToCreate.text)){
			io.to(user.room).emit('newMessage', generateMessage(user.name,  msgToCreate.text));
		}

		callback('This is from the server');
	});

	socket.on('createLocationMessage', (coords) => {
		let user = users.getUser(socket.id);
		if(user && isRealString(msgToCreate.text)){
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});

	socket.on('disconnect', () => {
		let user = users.removeUser(socket.id);

		if(user){
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
		console.log('disconnected to server');
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});


module.exports.app = app;
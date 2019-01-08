const socketIO = require('socket.io');
const game = require('./game.js');
const env = {
	map: {
		width: 2001,
		height: 1001
	}
};

const gameData = {
	players: {},
	food: {
		data: {},
		limit: Math.floor((env.map.width * env.map.height) / 50000),
		count: 0
	},
	viruses: {},
	stats: {},
	env,
};

function listen(server) {
	io = socketIO(server, {
		pingTimeout: 1000
	});

	io.on('connection', socket => {
		socket.on('newConnectionData', data => {
			addClient(socket.id, data);
			console.log(`Client connected ${socket.id}`);
			console.log(gameData.players[socket.id]);
		});

		socket.on('clientMouseMove', data => {
			gameData.players[socket.id].mouse = {
				x: data.x,
				y: data.y
			};
		});

		socket.on('chatSend', data => {
			io.emit('chat', data);
		});

		socket.on('clientResize', data => {
			gameData.players[socket.id].canvas = data;
		});

		socket.on('disconnect', () => {
			delete gameData.players[socket.id];
			console.log('client disconnected', socket.id);
		});
	});

	startHeartbeat();

	return io;
}

function startHeartbeat() {
	heartbeat();
	setInterval(heartbeat, 1000 / 60);
}

function heartbeat() {
	newData = game.update(gameData, env);

	sendGameData(gameData);

}

function sendGameData(newData) {
	// console.log('newData', newData);
	io.emit('sendGameDataToClients', newData);
}

function addClient(socketID, data) {
	gameData.players[socketID] = generateNewClient();

	for(let value in data) {
		if(data.hasOwnProperty(value)) {
			gameData.players[socketID][value] = data[value];
		}
	}
}

function generateNewClient() {
	const newClient = {
		x: 20,
		y: 20,
		color: randomColor(),
		mass: 10,
		radius: 10,
		mouse: {
			x: 0,
			y: 0
		}
	};
	return newClient;
}

function randomColor() {
	colors = [
		'red',
		'blue',
		'green',
		'yellow',
		'orange',
		'pink',
		'purple'
	];

	return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = {
	listen
};
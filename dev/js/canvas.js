const canvas = document.querySelector('canvas#gameArea');
const ctx = canvas.getContext('2d');
const DOM = {
	score: document.querySelector('#score .data'),
	leaderboard: document.querySelector('#leaderboard ol'),
};
const foodColors = [
	'#AAC0AA',
	'#4E6E5D',
	'#4DA167',
	'#3BC14A'
];

function update(data, socketID) {
	// console.log('====  update  ====');
	// console.log(socketID)
	// console.log('data', data);
	// console.log('players', data.players);
	console.log('food', data.food);
	// console.log('viruses', data.viruses);
	// console.log('stats', data.stats);
	
	if(Object.keys(data.players).length !== 0) {
		const currentUser = getCurrentUser(data.players, socketID);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.translate(-currentUser.x, -currentUser.y);
		drawMap(data.env);
		// drawViruses(data.viruses);
		drawFood(data.food.data);
		drawPlayers(data.players, socketID);
		updateLeaderboard(data.players);
		updateScore(data.players[socketID]);
		ctx.restore();
	}
}

function getCurrentUser(players, socketID) {
	return players[socketID];
}

function drawMap(env) {
	ctx.fillStyle = 'rgb(245,245,245)';
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#ccc';
	ctx.fillRect(0, 0, env.map.width, env.map.height);
	for(let i = 0; i < env.map.width; i += 50) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, env.map.height);
		ctx.stroke();
	}
	for(let i = 0; i < env.map.height; i += 50) {
		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(env.map.width, i);
		ctx.stroke();
	}
}

function drawViruses(viruses) {
	// console.log('drawing viruses');
}

function drawFood(food) {
	for(let key in food) {
		if(food.hasOwnProperty(key)) {
			ctx.fillStyle = foodColors[food[key].c];
			ctx.beginPath();
			ctx.arc(
				food[key].x,
				food[key].y,
				20,
				0,
				2 * Math.PI
			);
			ctx.fill();
		}
	}
}

function drawPlayers(players, socketID) {
	for(let player in players) {
		if(players.hasOwnProperty(player)) {
			const cp = players[player];
			if(player === socketID) {
				continue;
			}
			ctx.beginPath();
			ctx.arc(
				cp.x,
				cp.y,
				cp.radius,
				0,
				2 * Math.PI
			);
			ctx.fillStyle = cp.color;
			ctx.fill();
		}
	}
	ctx.beginPath();
	ctx.arc(
		players[socketID].x,
		players[socketID].y,
		players[socketID].radius,
		0,
		2 * Math.PI
	);
	ctx.fillStyle = players[socketID].color;
	ctx.fill();
}

function updateLeaderboard(players) {
	const stats = [];
	let html = '';
	for(let player in players) {
		if(players.hasOwnProperty(player)) {
			cp = players[player];
			stats.push({
				name: players[player].name,
				radius: players[player].radius
			});
		}
	}
	for(let i = 0; i < stats.length; i++) {
		html += `<li>${stats[i].name} - ${stats[i].radius}</li>`;
	}
	DOM.leaderboard.innerHTML = html;
}

function updateScore(player) {
	DOM.score.innerHTML = player.radius;
}
module.exports = {
	update
};
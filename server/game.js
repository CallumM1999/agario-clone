function update(data, env) {
	let cp, radius, speed = {},
		target = {},
		dist, factor, newX, newY;
	const oSpeed = 4;

	if(Object.keys(data).length !== 0) {
		for(let player in data.players) {
			if(data.players.hasOwnProperty(player)) {
				cp = data.players[player]; // current player 

				radius = cp.radius;

				target.x = cp.mouse.x - (cp.canvas.width / 2);
				target.y = cp.mouse.y - (cp.canvas.height / 2);

				dist = Math.sqrt(Math.pow(target.x, 2) + Math.pow(target.y, 2));

				factor = dist / oSpeed;

				speed.x = target.x / factor;
				speed.y = target.y / factor;

				newX = cp.x + speed.x;
				newY = cp.y + speed.y;

				// map boundaries
				if(newX - radius <= 0 && target.x < 0) {
					newX = radius;
				} else if(newX + radius + 1 > env.map.width && target.x > 0) {
					newX = env.map.width - radius;
				}

				if(newY - radius <= 0 && target.y < 0) {
					newY = radius;
				} else if(newY + radius + 1 > env.map.height && target.y > 0) {
					newY = env.map.height - radius;
				}

				data.players[player].x = newX;
				data.players[player].y = newY;

				// check all food
				for(let key in data.food.data) {
					if(data.food.data.hasOwnProperty(key)) {
						if(eats(cp, data.food.data[key])) {

							delete data.food.data[key];

							data.players[player].radius += 1;
						}
					}
				}
			}
		}

		//replenish food 
		if(Object.keys(data.food.data).length < data.food.limit) {
			let coords, blocked;

			coords = generateNewCoords(env.map);
			blocked = tryNewCoords(coords, data.food.data);

			while(blocked) {
				coords = generateNewCoords(env.map);
				blocked = tryNewCoords(coords, data.food.data);
			}

			data.food.data[data.food.count] = {
				x: coords.x,
				y: coords.y,

				c: Math.floor(Math.random() * 4)
			};
			data.food.count++;
		}
	}

}

function generateNewCoords(env) {
	return {
		x: Math.floor(Math.random() * (env.width - 40)) + 20,
		y: Math.floor(Math.random() * (env.height - 40)) + 20
	};
}

function tryNewCoords(coords, foodArr) {
	const x = coords.x,
		y = coords.y,
		spacing = 10;
	let foodx, foody;

	for(let item in foodArr) {
		if(foodArr.hasOwnProperty(item)) {
			foodx = foodArr[item].x;
			foody = foodArr[item].y;

			if(
				(foodx > x - 32 - spacing &&
					foodx < x + 32 + spacing) &&
				(foody > y - 32 - spacing &&
					foody < y + 32 + spacing)
			) {
				return true;
			}
		}
	}
	return false;
}

function eats(player, food) {
	const a = player.x - food.x,
		b = player.y - food.y,
		d = parseInt(Math.sqrt(a * a + b * b));

	if(d < player.radius - 8) {
		return true;
	} else {
		return false;
	}
}

module.exports = {
	update
};
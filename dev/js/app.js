const io = require('../../node_modules/socket.io-client'),
	canvas = require('./canvas'),
	chat = require('./chat'),
	name = require('./utils').getUrlVars().name;
const socket = io.connect('/');
const gameData = {
	players: {},
	food: {},
	viruses: {},
	stats: {}
};
const DOM = {
	chat: {
		main: document.querySelector('#chat .input .input-container'),
		input: document.querySelector('#chat .input .input-container input'),
	},
	canvas: document.querySelector('canvas#gameArea'),
	menu: document.querySelector('.modal#modal-menu')
};
socket.on('connect', () => {
	socket.emit('newConnectionData', {
		name,
		canvas: {
			width: window.innerWidth,
			height: window.innerHeight
		}
	});
	socket.on('sendGameDataToClients', data => {
		for(let property in data) {
			if(data.hasOwnProperty(property)) {
				gameData[property] = data[property];
			}
		}
	});
	socket.on('chat', data => {
		chat.update(data);
		chat._render();
	});
});

function openMenu() {
	menuOpen = true;
	DOM.menu.classList.remove('hide');
}

function closeMenu() {
	menuOpen = false;
	DOM.menu.classList.add('hide');
}

function openChat() {
	chatOpen = true;
	DOM.chat.main.classList.remove('hide');
	DOM.chat.input.focus();
}

function closeChat() {
	chatOpen = false;
	DOM.chat.main.classList.add('hide');
}

function chatSendMessage() {
	let message = DOM.chat.input.value;
	if(message !== '') {
		DOM.chat.input.value = '';
		socket.emit('chatSend', {
			message,
			name
		});
	}
	closeChat();
}

function submitW() {
	socket.emit('playerPressW');
}

function submitSpace() {
	socket.emit('playerPressSpace');
}
let menuOpen = false;
let chatOpen = false;

function mainEventHandler(e) {
	switch(e.key) {
		case 'w':
		case 'W':
			if(!menuOpen && !chatOpen) {
				submitW();
			}
			break;
		case ' ':
			if(!menuOpen && !chatOpen) {
				submitSpace();
			}
			break;
		case 't':
		case 'T':
			if(!menuOpen && !chatOpen) {
				openChat();
			}
			break;
		case 'Escape':
			if(menuOpen) {
				closeMenu();
			} else if(chatOpen) {
				closeChat();
			} else {
				openMenu();
			}
			break;
		case 'Enter':
			if(chatOpen) {
				chatSendMessage();
			}
			break;
	}
}

function chatBlurHandler() {
	if(chatOpen) {
		closeChat();
	}
}
window.addEventListener('keyup', mainEventHandler);
DOM.chat.input.addEventListener('blur', chatBlurHandler);
window.addEventListener('mousemove', mouseMoveHandler);
window.addEventListener('resize', windowResize);

function windowResize(e) {
	socket.emit('clientResize', {
		width: window.innerWidth,
		height: window.innerHeight
	});
	DOM.canvas.width = window.innerWidth;
	DOM.canvas.height = window.innerHeight;
}

function mouseMoveHandler(e) {
	if(!menuOpen) {
		emitMouseCoords(e);
	}
}

function emitMouseCoords(e) {
	// console.log('mouse', e.clientX, e.clientY);
	socket.emit('clientMouseMove', {
		x: e.clientX,
		y: e.clientY
	});
}
start();

function start(frameRate = 1000 / 60) {
	updateCanvas();
	setInterval(updateCanvas, frameRate);
}

function updateCanvas() {
	canvas.update(gameData, socket.id);
}
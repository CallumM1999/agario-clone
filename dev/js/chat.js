const chatArr = [];
const DOM = {
	chat: {
		output: document.querySelector('#chat .output'),
		// ul: document.querySelector('#chat .output ul'),
	}
};

function update(data) {
	chatArr.push(data);
}

function _render() {
	const length = chatArr.length;
	let html, newLine;
	if(length < 6) {
		for(let i = 0; i < length; i++) {
			newLine = `<li><span class="name">${chatArr[i].name}</span><span class="message">${chatArr[i].message}</span></li>`;
			html += newLine;
		}
	} else {
		for(let i = length - 6; i < length; i++) {
			newLine = `<li><span class="name">${chatArr[i].name}</span><span class="message">${chatArr[i].message}</span></li>`;
			html += newLine;
		}
	}
	html = `<ul>${html}</ul>`;
	DOM.chat.output.innerHTML = html;
	// document.querySelector('#chat .output ul').style.opacity = 1;
	setTimeout(chatFadeOut, 2000);
}

function chatFadeOut() {
	document.querySelector('#chat .output ul').classList.add('chat-fade');
	// DOM.chat.ul.classList.add('chat-fade');
}
module.exports = {
	update,
	_render
};
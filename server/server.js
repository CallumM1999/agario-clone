const express = require('express'),
	http = require('http'),
	path = require('path'),
	compression = require('compression'),
	app = express(),
	server = http.createServer(app),
	io = require('./sockets.js').listen(server), // loading to socket.js
	port = process.env.PORT || 3000;

app.use(compression());
app.use(express.static(`${__dirname}/../public`));

viewsPath = path.join(`${__dirname}/../views`);

server.listen(port, () => console.log(`Server started on PORT ${port}`));

app.get('/', (req, res) => {
	res.sendFile(`${viewsPath}/index.html`);
});

app.get('/play', (req, res) => {
	let name = req.query.name;

	res.sendFile(`${viewsPath}/play.html`);
});
const path = require('path');
const fs = require('fs');
const express = require('express');
const cpen322 = require('./cpen322-tester.js');
const ws = require('ws');
const e = require('express');
const { escape } = require('querystring');

function logRequest(req, res, next){
	console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
	next();
}

const host = 'localhost';
const port = 3000;
const clientApp = path.join(__dirname, 'client');

// express app
let app = express();

//ws stuff
let broker = new ws.Server({port: 8000});
let clients = [];
broker.binaryType = "blob";

broker.on('connection', function connection(ws) {

	ws.onmessage = function(inp) {
	  console.log(inp.data);
	  for(const e of broker.clients){
		if(e === ws){
			continue;
		}
		console.log((e === ws));
		 e.send(inp.data);
	  }

	  console.log(inp.data);
	  console.log(typeof inp.data);
	  let parsed = JSON.parse(inp.data);

	  if(!parsed.roomId in messages){
		message[parsed.roomId] = [];
	  }
	  messages[parsed.roomId].push(parsed);
	}


  });


app.use(express.json()) 						// to parse application/json
app.use(express.urlencoded({ extended: true })) // to parse application/x-www-form-urlencoded
app.use(logRequest);							// logging for debug

// serve static files (client-side)
app.use('/', express.static(clientApp, { extensions: ['html'] }));
app.listen(port, () => {
	console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

var chatrooms = [];
chatrooms[0] = {
	id: "0", 
	name: "math100groupchat",
	image: "assets/everyone-icon.png"
}
chatrooms[1] = {
	id: "1", 
	name: "math101groupchat",
	image: "assets/everyone-icon.png"
}

var messages = {};

for(let i = 0; i < chatrooms.length; i++){
	let roomId = chatrooms[i].id;
	messages[roomId] = [];
}

//var myapp = express();

app.get('/chat', (req, res) => {
	let result = [];

	for(let q = 0; q < chatrooms.length; q++){
		let room = {
			id: chatrooms[q].id,
			name: chatrooms[q].name,
			image: chatrooms[q].image,
			messages: messages[chatrooms[q].id]
		}
		result.push(room);
	}

	 res.status(200).send(result);
})

app.post('/chat', (req, res) =>{
	let request = req.body;
	if("name" in request && request.name.trim()){
		let uniqueID = request.name;
		while(uniqueID in messages){
			uniqueID = request.name;
			uniqueID += Date.now;
		}

		let room = {
			id: uniqueID,
			name: request.name,
			image: request.image
		}

		chatrooms.push(room);
		messages[uniqueID] = [];

		res.status(200).send(JSON.stringify(room));
		
	} 
	else{
		console.log("malformed");
		res.status(400).send("malformed request");
		return;
	}
})

cpen322.connect('http://52.43.220.29/cpen322/test-a3-server.js');
cpen322.export(__filename, { app, chatrooms, messages, broker });

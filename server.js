const path = require('path');
const fs = require('fs');
const express = require('express');
const cpen322 = require('./cpen322-tester.js');
const ws = require('ws');
const e = require('express');
const { escape } = require('querystring');
const crypto = require('crypto');

let messageBlockSize = 10;

function logRequest(req, res, next){
	console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
	next();
}

//db stuff
const Database = require('./Database.js');
const { resolve, parse } = require('path');
const SessionManager = require('./SessionManager.js');
const { request } = require('http');

let db = new Database("mongodb://localhost:27017", "cpen322-messenger");

let sessionManager = new SessionManager();

const host = 'localhost';
const port = 3000;
const clientApp = path.join(__dirname, 'client');

// express app
let app = express();



//ws stuff
let broker = new ws.Server({port: 8000});
let clients = [];
broker.binaryType = "blob";

broker.on('connection', function connection(ws, incoming) {

	//parse cookies

	let successParse = true;
	let cookieObj = ""

	if(incoming.headers.cookie == null){
		ws.close();
	}
	try{
		 cookieObj = parseCookie(incoming.headers.cookie.toString());
	} catch (error) {
		successParse = false;
		ws.close();
	}
	if(successParse && sessionManager.getUsername(cookieObj[`cpen322-session`]) == null){
		ws.close();
	}


	ws.onmessage = function(inp) {
	  for(const e of broker.clients){
		if(e === ws){
			continue;
		}

		let obj = JSON.parse(inp.data);

		obj.text = sanitize(obj.text);
		console.log(obj);

		obj.username = sessionManager.getUsername(cookieObj[`cpen322-session`]);
		console.log(JSON.stringify(obj));
		e.send(JSON.stringify(obj));
	  }

	  let parsed = JSON.parse(inp.data);
	  parsed.text = sanitize(parsed.text);
	  parsed.username = sessionManager.getUsername(cookieObj[`cpen322-session`]);


	  if(!parsed.roomId in messages){
		messages[parsed.roomId] = [];
	  }
	  messages[parsed.roomId].push(parsed);
	  console.log("pushed");

	  if(messages[parsed.roomId].length == messageBlockSize){
		db.addConversation({"room_id": parsed.roomId, "timestamp": Date.now(), "messages": messages[parsed.roomId]}).then(() =>{
			messages[parsed.roomId] = [];
		});
	  }
	}


  });


app.use(express.json()) 						// to parse application/json
app.use(express.urlencoded({ extended: true })) // to parse application/x-www-form-urlencoded
app.use(logRequest);							// logging for debug

// serve static files (client-side)

app.listen(port, () => {
	console.log(`${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`);
});

// var chatrooms = [];
// chatrooms[0] = {
// 	id: "0", 
// 	name: "math100groupchat",
// 	image: "assets/everyone-icon.png"
// }
// chatrooms[1] = {
// 	id: "1", 
// 	name: "math101groupchat",
// 	image: "assets/everyone-icon.png"
// }

var messages = {};
db.getRooms().then((fetchedRooms) =>{
	for(let i = 0; i < fetchedRooms.length; i++){
		let roomId = fetchedRooms[i]._id;
		messages[roomId] = [];
	}
});

app.get("/chat/:room_id/messages", sessionManager.middleware, (req, res) =>{
	let rmId = req.params.room_id.toString();
	let time = parseInt(req.query.before);


	db.getLastConversation(rmId, time).then((convo) =>{
		if(convo != null){
			res.status(200).send(JSON.stringify(convo));
		} else {
			res.status(200).send("");
		}
	})
});


app.get("/chat/:room_id", sessionManager.middleware, (req, res) =>{
	let rmId = req.params.room_id;

	db.getRoom(rmId).then((room) => {
		if(room != null){
			res.status(200).send(room);
		}
		else{
			res.status(404).send("Room " + rmId + " was not found");
		}
	});
});


app.get('/chat', sessionManager.middleware, (req, res) => {
	let result = [];

	db.getRooms().then((fetchedRooms) => {
		for(let q = 0; q < fetchedRooms.length; q++){
			let room = {
				_id: fetchedRooms[q]._id,
				name: fetchedRooms[q].name,
				image: fetchedRooms[q].image,
				messages: messages[fetchedRooms[q]._id]
			}
			result.push(room);
		}
		res.status(200).send(JSON.stringify(result));
	});
})

app.post('/chat', sessionManager.middleware, (req, res) =>{
	let request = req.body;
	if("name" in request && request.name.trim()){
		let uniqueID = request.name;
		while(uniqueID in messages){
			uniqueID = request.name;
			uniqueID += Date.now();
		}

		let room = {
			_id: uniqueID,
			name: request.name,
			image: request.image
		}

	
		db.addRoom(room).then((addedroom) =>{
			messages[addedroom._id] = [];
			res.status(200).send(JSON.stringify(addedroom));
		});
		return;
		
	} 
	else{
		res.status(400).send("malformed request");
		return;
	}
})

app.get("/profile", sessionManager.middleware, (req, res) =>{
	res.status(200).send(JSON.stringify({"username": req.username}));
});


app.use("/app.js", sessionManager.middleware);
app.use("/index.html", sessionManager.middleware);
app.use("/index", sessionManager.middleware);


app.get("/logout", (req, res) =>{
	sessionManager.deleteSession(req);
	res.redirect("/login");
});



//session stuff
//let sessionManager = new SessionManager();

app.post('/login', (req, res) =>{
	let user = req.body.username;
	
	if(user == null){
		res.redirect('/login');
		res.send();
	}
	else {
		db.getUser(user).then((userdoc) => {
			if(userdoc == null){
				res.redirect("/login");
				res.send();
			}
			//compute password
			else if (!isCorrectPassword(req.body.password, userdoc.password)){
				res.redirect("/login");
				res.send();
			}
			else {
				sessionManager.createSession(res, user);
				res.redirect("/");
				res.send();
			}
		})
	}
})

app.use('/login', express.static(clientApp+'/login.html', { extensions: ['html'] }));
app.use('/', sessionManager.middleware, express.static(clientApp, { extensions: ['html'] }));



function isCorrectPassword(password, saltedHash){
	let salt = saltedHash.slice(0, 20);
	let hash = crypto.createHash('sha256').update(password + salt).digest('base64');
	let compare = salt + hash;

	return compare == saltedHash;
}

app.use((err, req, res, next) => {
	if(err instanceof SessionManager.Error){
		if(req.headers.accept == "application/json"){
			res.status(401).send(err);
		} else{
			res.redirect("/login");
		}
		
	}
	else {
		res.status(500).send("Not SessionError Object");
	}
  });

  const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});


  function sanitize(string) {
	let tmp = string.replaceAll('<', " ");
	tmp = tmp.replaceAll(">", " ");
	return tmp;
  }
  




cpen322.connect('http://52.43.220.29/cpen322/test-a5-server.js');
cpen322.export(__filename, {ws, app, messages, broker, db, messageBlockSize, sessionManager, isCorrectPassword});

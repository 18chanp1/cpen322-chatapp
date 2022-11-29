const { Console } = require('console');
const crypto = require('crypto');
const { parse } = require('path');

class SessionError extends Error {};

function SessionManager (){
	// default session length - you might want to
	// set this to something small during development
	const CookieMaxAgeMs = 600000;

	// keeping the session data inside a closure to keep them protected
	const sessions = {};

	// might be worth thinking about why we create these functions
	// as anonymous functions (per each instance) and not as prototype methods
	this.createSession = (response, username, maxAge = CookieMaxAgeMs) => {
		/* To be implemented */
		let token = crypto.randomBytes(128).toString('base64url');
		let time = Date.now();

		setTimeout(() => {delete sessions[token]; console.log(sessions[token])}, maxAge);
		
		sessions[token] = 
		{
			"username": username,
			"timestamp": time,
			"expiry": time+maxAge
		};

		response.cookie("cpen322-session", token, {maxAge: maxAge});
		
	};

	this.deleteSession = (request) => {
		/* To be implemented */
	

		delete sessions[request.session];
		delete request.username;
		delete request.session;
		console.log("deletion done");
		return;
	};

	this.middleware = (request, response, next) => {
		/* To be implemented */
		let ck = request.headers.cookie

		if(ck == null) {
			next(new SessionError);
			return;
		}

		
		let cookieObject = parseCookie(ck);
		if(!(cookieObject[`cpen322-session`] in sessions)){
			next(new SessionError);
			return;
		}

		//assigning usernames and shit
		let cookieID = cookieObject[`cpen322-session`];

		request.username = sessions[cookieID].username;
		request.session = cookieID;

		next();

		
	};



	// this function is used by the test script.
	// you can use it if you want.
	this.getUsername = (token) => ((token in sessions) ? sessions[token].username : null);
};



// SessionError class is available to other modules as "SessionManager.Error"
SessionManager.Error = SessionError;

module.exports = SessionManager;

//cookie parsing

const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
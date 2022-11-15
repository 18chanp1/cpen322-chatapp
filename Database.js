const { MongoClient, ObjectID, ObjectId } = require('mongodb');	// require the mongodb driver

/**
 * Uses mongodb v4.2+ - [API Documentation](http://mongodb.github.io/node-mongodb-native/4.2/)
 * Database wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our cpen322 app.
 */
function Database(mongoUrl, dbName){
	if (!(this instanceof Database)) return new Database(mongoUrl, dbName);
	this.connected = new Promise((resolve, reject) => {
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			(err, client) => {
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to ' + mongoUrl + '/' + dbName);
					resolve(client.db(dbName));
				}
			}
		)
	});
	this.status = () => this.connected.then(
		db => ({ error: null, url: mongoUrl, db: dbName }),
		err => ({ error: err })
	);
}

Database.prototype.getRooms = function(){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			/* TODO: read the chatrooms from `db`
			 * and resolve an array of chatrooms */
			resolve(db.collection('chatrooms').find().toArray());
		})
	)
}

Database.prototype.getRoom = function(room_id){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			/* TODO: read the chatroom from `db`
			 * and resolve the result */

			let flag = false;
			try{
				ObjectId(room_id);
			} catch(err) {
				flag = true;
			}

			let objID = flag ? null : db.collection("chatrooms").findOne({_id: ObjectId(room_id)});
			let regID = db.collection("chatrooms").findOne({_id: room_id});

			Promise.all([objID, regID]).then((values) =>{
				if(values[0] != null){
					resolve(values[0]);
				} else {
					resolve(values[1]);
				}
			})

			

		})
	);
}

Database.prototype.addRoom = function(room){
	return this.connected.then(db => 
		new Promise((resolve, reject) => {
			/* TODO: insert a room in the "chatrooms" collection in `db`
			 * and resolve the newly added room */

			if(!("name" in room)){
				reject(new Error("No name provided"));
				return;
			} else{
				db.collection("chatrooms").insertOne(room).then((doc) =>{
					room._id = doc.insertedId;

					db.collection("chatrooms").findOne(room).then((treasure) => {
						if(treasure == null){
							reject(new Error("added failed, cannot find"));
						} else {
							resolve(treasure);
						}
					}, (err) => {
						reject(new Error("added failed, cannot find"));
					})
					//resolve(room);
				});


			}
			
			
			
		})
	);
}

Database.prototype.getLastConversation = function(room_id, before){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			/* TODO: read a conversation from `db` based on the given arguments
			 * and resolve if found */
		})
	)
}

Database.prototype.addConversation = function(conversation){
	return this.connected.then(db =>
		new Promise((resolve, reject) => {
			/* TODO: insert a conversation in the "conversations" collection in `db`
			 * and resolve the newly added conversation */
		})
	)
}

module.exports = Database;
const __tester = {
    listeners: [],
    timers: [],
    exports: new Map,
    defaults: {
        testRoomId: "room-1",
        image: "assets/everyone-icon.png",
        webSocketServer: "ws://localhost:8000"
    },
    oldAddEventListener: HTMLElement.prototype.addEventListener,
    newAddEventListener: function(e, t, ...o) {
        return __tester.listeners.push({
            node: this,
            type: e,
            listener: t,
            invoke: e => t.call(this, e)
        }), __tester.oldAddEventListener.call(this, e, t, ...o)
    },
    oldSetInterval: window.setInterval,
    newSetInterval: function(e, t, ...o) {
        return __tester.timers.push({
            type: "Interval",
            func: e,
            delay: t
        }), __tester.oldSetInterval.call(this, e, t, ...o)
    },
    export: (e, t) => {
        __tester.exports.has(e) || __tester.exports.set(e, {}), Object.assign(__tester.exports.get(e), t)
    },
    setDefault: (e, t) => {
        __tester.defaults[e] = t
    }
};
HTMLElement.prototype.addEventListener = __tester.newAddEventListener, WebSocket.prototype.addEventListener = __tester.newAddEventListener, window.setInterval = __tester.newSetInterval, window.cpen322 = {
    export: __tester.export,
    setDefault: __tester.setDefault
}, window.addEventListener("load", () => {
    const e = window.fetch,
        t = (t, o) => e(t, o).then(e => 200 === e.status ? e.text().then(e => e ? JSON.parse(e) : e) : e.text().then(e => Promise.reject(new Error(e)))),
        o = ["Alligator", "Alpaca", "Ant", "Antelope", "Ape", "Armadillo", "Badger", "Beaver", "Beetle", "Buffalo", "Camel", "Cattle", "Cheetah", "Chimpanzee", "Chinchilla", "Clam", "Crab", "Crocodile", "Deer", "Dog", "Dolphin", "Donkey", "Ferret", "Fox", "Giraffe", "Gnat", "Goldfish", "Gorilla", "Grasshopper", "Hamster", "Hare", "Hedge Dog", "Hornet", "Hound", "Jackal", "Jellyfish", "Kangaroo", "Lizard", "Llama", "Manatee", "Marten", "Mole", "Moose", "Mosquito", "Muskrat", "Octopus", "Ox", "Oyster", "Pig", "Platypus", "Porcupine", "Puppy", "Rabbit", "Rat", "Reindeer", "Sardine", "Snake", "Spider", "Squirrel", "Swan", "Trout", "Turtle", "Wasp", "Water Buffalo", "Weasel", "Woodchuck", "Yak", "Zebra"],
        s = e => e[Math.floor(e.length * Math.random())],
        n = () => ({
            username: s(o),
            text: Math.random().toString()
        }),
        a = () => new Room(Math.random().toString(), "Team " + s(o), __tester.defaults.image, [{
            username: Math.random().toString(),
            text: Math.random().toString()
        }, {
            username: Math.random().toString(),
            text: Math.random().toString()
        }]),
        r = (e, t) => ({
            room_id: e,
            timestamp: t,
            messages: Array.from({
                length: 10
            }, e => n())
        }),
        i = (e, ...o) => t("cpen322/a4", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                func: e,
                args: o
            })
        }),
        d = (e, t) => {
            if (void 0 === e) return void 0 === t;
            if (null === e) return null === t;
            let o = Object.getPrototypeOf(e);
            if (o === Object.getPrototypeOf(t)) {
                if (o === Boolean.prototype || o === Number.prototype || o === String.prototype) return e === t;
                if (o === Array.prototype) return e.length === t.length && e.reduce((e, o, s) => e && d(o, t[s]), !0); {
                    let o = Object.keys(e).sort();
                    return d(o, Object.keys(t).sort()) && o.reduce((o, s, n) => o && d(e[s], t[s]), !0)
                }
            }
            return !1
        },
        c = [{
            id: "1",
            description: "Setting up Database",
            maxScore: 1,
            run: async () => {
                let e = {
                    id: 1,
                    score: 0,
                    comments: []
                };
                p('(Server) Checking if "mongodb" NPM module is installed');
                let t = await i("checkRequire", "mongodb");
                if (t.error) e.comments.push(v('"mongodb" module was not installed at the server: ' + t.error));
                else {
                    e.score += .25, u('require("mongodb") worked');
                    try {
                        if (p('(Server) Trying to access "db" in server.js'), await i("getGlobalObject", "db")) {
                            if (p('(Server) Checking if "db" is a Database instance'), await i("checkObjectType", "db", "./Database.js/")) {
                                e.score += .25, u('"db" is a Database instance'), p('(Server) Checking if "db" is connected');
                                let t = await i("callObjectByString", "db.status");
                                null !== t.error ? e.comments.push(v('"db" is not connected to a MongoDB service: ' + t.error.message)) : (e.score += .5, u('"db" is connected to a MongoDB service at ' + t.url + "/" + t.db))
                            } else e.comments.push(v('"db" object is not a "Database" instance'))
                        } else e.comments.push(v('"db" object in server.js was not found/exported'))
                    } catch (t) {
                        e.comments.push(v(t.message))
                    }
                }
                return e
            }
        }, {
            id: "2",
            description: "Reading Chat Rooms from the Database",
            maxScore: 5,
            run: async () => {
                let o = {
                    id: 2,
                    score: 0,
                    comments: []
                };
                try {
                    p('(Server) Checking "Database.prototype.getRooms" implementation (by calling "db.getRooms")');
                    let e = await i("callObjectByString", "db.getRooms");
                    if (o.score += .5, e instanceof Array)
                        if (o.score += .5, u('"db.getRooms" resolved to an Array'), p('(Server) Checking signature of objects returned by "db.getRooms" (expecting at least 2 rooms to exist in the database)'), e.length > 1) {
                            e.slice(0, 2).reduce((e, t) => {
                                if (t._id)
                                    if (t.name) {
                                        if (t.image) return e && !0;
                                        o.comments.push(v('The object in the array returned by "db.getRooms" is missing "image" property'))
                                    } else o.comments.push(v('The object in the array returned by "db.getRooms" is missing "name" property'));
                                else o.comments.push(v('The object in the array returned by "db.getRooms" is missing "_id" property'));
                                return !1
                            }, !0) && (o.score += .5, u("The objects in the array has the right properties"));
                            try {
                                p('(Server) Checking if "messages" was initialized after calling "db.getRooms"');
                                let s = await i("getGlobalObject", "messages");
                                if (e.reduce((e, t) => e && s[t._id] && s[t._id] instanceof Array, !0)) {
                                    o.score += .5, u('"messages" has an array for each room in the database'), p('(Server) Checking if "/chat" GET endpoint was updated to use the database');
                                    try {
                                        let n = await t("/chat"),
                                            a = e.map(e => Object.assign({
                                                messages: s[e._id]
                                            }, e));
                                        d(a, n) ? (o.score += .5, u('GET "/chat" endpoint returns the objects from "db.getRooms", combined with the "messages" object (as per A3 specs)')) : o.comments.push(v('Array returned at the GET "/chat" endpoint should be the result of "db.getRooms" combined with the "messages" object (as per A3 specs)'))
                                    } catch (e) {
                                        o.comments.push(v('Error while checking GET "/chat" endpoint: ' + e.message))
                                    }
                                } else o.comments.push(v('"messages" in server.js was not initialized as expected'))
                            } catch (e) {
                                o.comments.push(v('Error while checking "messages" in server.js: ' + e.message))
                            }
                        } else o.comments.push(v("Test script expects at least 2 rooms for testing"));
                    else null === e ? o.comments.push(v('"db.getRooms" should resolve to an Array. Test script got: null')) : void 0 === e ? o.comments.push(v('"db.getRooms" should resolve to an Array. Test script got: undefined')) : o.comments.push(v('"db.getRooms" should resolve to an Array. Test script got: ' + Object.getPrototypeOf(e).constructor.name))
                } catch (e) {
                    e.message.indexOf("timed out") > -1 ? o.comments.push(v('"db.getRooms" did not resolve to anything (test timed out after waiting for 5 seconds)')) : o.comments.push(v('Error upon calling "db.getRooms" in server.js: ' + e.message))
                }
                try {
                    p('(Server) Checking "Database.prototype.getRoom" implementation (by calling "db.getRoom")');
                    let s = await i("callObjectByString", "db.getRoom", __tester.defaults.testRoomId);
                    if (o.score += .5, u('"db.getRoom" resolved to an object'), p('(Server) Checking signature of object returned by "db.getRoom"'), s._id)
                        if (s._id !== __tester.defaults.testRoomId) o.comments.push(v('The "_id" of the object returned by "db.getRoom" does not match the requested room id'));
                        else if (s.name)
                        if (s.image) {
                            o.score += .5, u("The object has the right properties"), p('(Server) Checking if "/chat/:room_id" GET endpoint was defined');
                            try {
                                let e = await t("/chat/" + __tester.defaults.testRoomId);
                                d(s, e) ? (o.score += 1, u('GET "/chat/:room_id" endpoint returns the object from "db.getRoom(room_id)"')) : o.comments.push(v('Object returned by "db.getRoom" is not equivalent to the object returned at the GET "/chat/:room_id" endpoint'))
                            } catch (e) {
                                o.comments.push(v('Error while checking GET "/chat/:room_id" endpoint: ' + e.message))
                            }
                            p('(Server) Checking if "/chat/:room_id" GET endpoint returns HTTP error code');
                            try {
                                404 !== (await e("/chat/" + Math.random())).status ? o.comments.push(v('GET "/chat/:room_id" endpoint should return HTTP Status 404 if the requested room does not exist')) : (o.score += .5, u('GET "/chat/:room_id" endpoint returns HTTP 404 if room does not exist'))
                            } catch (e) {
                                o.comments.push(v('Unexpected error while checking GET "/chat/:room_id" endpoint error handling: ' + e.message))
                            }
                        } else o.comments.push(v('The object returned by "db.getRoom" is missing "image" property'));
                    else o.comments.push(v('The object returned by "db.getRoom" is missing "name" property'));
                    else o.comments.push(v('The object returned by "db.getRoom" is missing "_id" property'))
                } catch (e) {
                    e.message.indexOf("timed out") > -1 ? o.comments.push(v('"db.getRoom" did not resolve to anything (test timed out after waiting for 5 seconds)')) : o.comments.push(v('Error upon calling "db.getRoom" in server.js: ' + e.message))
                }
                return o
            }
        }, {
            id: "3",
            description: "Writing Chat Room to the Database",
            maxScore: 3,
            run: async () => {
                let o = {
                    id: 3,
                    score: 0,
                    comments: []
                };
                try {
                    let s = a();
                    p('(Server) Checking "Database.prototype.addRoom" implementation (by calling "db.addRoom")');
                    let n = await i("callObjectByString", "db.addRoom", {
                        name: s.name,
                        image: s.image
                    });
                    if (o.score += .25, u('"db.addRoom" resolved to an object'), p('(Server) Checking signature of object returned by "db.addRoom"'), n._id)
                        if (n.name)
                            if (n.name !== s.name) o.comments.push(v('The "name" of the object returned by "db.addRoom" does not match the "name" requested to be added'));
                            else if (n.image)
                        if (n.image !== s.image) o.comments.push(v('The "image" of the object returned by "db.addRoom" does not match the "image" requested to be added'));
                        else {
                            o.score += .5, u("The object has the right properties"), p('(Server) Checking if the test room was added to the database (by calling "db.getRoom")');
                            let r = await i("callObjectByString", "db.getRoom", n._id);
                            d(r, n) ? (o.score += .5, u('Got the room object added by "db.addRoom" by calling "db.getRoom"'), await i("setObjectByString", `messages["${n._id}"]`, [])) : o.comments.push(v('The object returned by "db.getRoom" is different from the object added by "db.addRoom"', "Added:", n, "Got:", r));
                            try {
                                await i("callObjectByString", "db.addRoom", {}), o.comments.push(v('"db.addRoom" should reject if "name" field is missing'))
                            } catch (e) {
                                o.score += .25, u('"db.addRoom" rejects with Error when given invalid argument')
                            }
                            p('(Server) Checking if "/chat" POST endpoint was updated to use the database'), s = a(), n = await t("/chat/", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    name: s.name,
                                    image: s.image
                                })
                            }), u('POST "/chat" returned an object'), p('(Server) Checking if the test room was added to the database (by calling "db.getRoom")'), r = await i("callObjectByString", "db.getRoom", n._id), d(r, n) ? (o.score += .5, u('Got the room object added via POST "/chat" endpoint by calling "db.getRoom"')) : o.comments.push(v('The object returned by "db.getRoom" is different from the object added by POST /chat')), p("(Server) Checking if the `messages` object is still updated");
                            let c = await i("getObjectByString", 'messages["' + n._id + '"]');
                            d(c, []) ? (o.score += .5, u('messages["' + n._id + '"] was assigned an empty array')) : o.comments.push(v('An empty array should be assigned to messages["' + n._id + '"] in server.js', "You have: ", c)), p('(Server) Checking if "/chat" POST endpoint returns HTTP 400 on bad request (already done in A3, but the behaviour should be kept)'), 400 !== (n = await e("/chat/", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    image: s.image
                                })
                            })).status ? o.comments.push(v("Server should return HTTP status 400 when request is not formatted properly")) : (o.score += .5, u('POST "/chat" endpoint returns HTTP 400 if the request body does not have required fields'))
                        }
                    else o.comments.push(v('The object returned by "db.addRoom" is missing "image" property'));
                    else o.comments.push(v('The object returned by "db.addRoom" is missing "name" property'));
                    else o.comments.push(v('The object returned by "db.addRoom" is missing "_id" property'))
                } catch (e) {
                    e.message.indexOf("timed out") > -1 ? o.comments.push(v('"db.addRoom" did not resolve to anything (test timed out after waiting for 5 seconds)')) : o.comments.push(v('Error upon calling "db.addRoom" in server.js: ' + e.message))
                }
                return o
            }
        }, {
            id: "4",
            description: "Reading/Writing Message Blocks",
            maxScore: 7,
            run: async () => {
                let e = {
                    id: 4,
                    score: 0,
                    comments: []
                };
                try {
                    p('(Server) Checking "Database.prototype.addConversation" implementation (by calling "db.addConversation")');
                    let o = r(__tester.defaults.testRoomId, Date.now() - 864e5),
                        s = await i("callObjectByString", "db.addConversation", o);
                    if (e.score += .25, s._id) {
                        let a = s._id;
                        delete s._id;
                        let r = d(o, s);
                        if (s._id = a, r) {
                            e.score += .5, u('"db.addConversation" resolves to the conversation object added');
                            try {
                                await i("callObjectByString", "db.addConversation", {
                                    timestamp: o.timestamp,
                                    messages: o.messages
                                }), e.comments.push(v('"db.addConversation" should reject if "room_id" field is missing'))
                            } catch (t) {
                                e.score += .25, u('"db.addConversation" rejects with Error when "room_id" field is missing')
                            }
                            try {
                                await i("callObjectByString", "db.addConversation", {
                                    room_id: o.room_id,
                                    messages: o.messages
                                }), e.comments.push(v('"db.addConversation" should reject if "timestamp" field is missing'))
                            } catch (t) {
                                e.score += .25, u('"db.addConversation" rejects with Error when "timestamp" field is missing')
                            }
                            try {
                                await i("callObjectByString", "db.addConversation", {
                                    room_id: o.room_id,
                                    timestamp: o.timestamp
                                }), e.comments.push(v('"db.addConversation" should reject if "messages" field is missing'))
                            } catch (t) {
                                e.score += .25, u('"db.addConversation" rejects with Error when "messages" field is missing')
                            }
                            try {
                                if (p('(Server) Checking "Database.prototype.getLastConversation" implementation (by calling "db.getLastConversation")'), s = await i("callObjectByString", "db.getLastConversation", __tester.defaults.testRoomId, o.timestamp + 2e3), e.score += .25, o._id = a, d(o, s)) {
                                    e.score += .75, u('"db.getLastConversation" resolves to the object added by "db.addConversation"'), p('(Server) Checking if "db.getLastConversation" returns a conversation with timestamp strictly less than "before"');
                                    let t = await i("callObjectByString", "db.getLastConversation", s.room_id, s.timestamp);
                                    d(t, s) || t.timestamp === s.timestamp ? e.comments.push(v('Object returned by "db.getLastConversation" has the same timestamp as the "before" query parameter')) : e.score += .25
                                } else e.comments.push(v('Object returned by "db.getLastConversation" is not equivalent to the object added by "db.addConversation"', "\nAdded: ", o, "Got: ", s));
                                try {
                                    p('(Server) Trying to access "messageBlockSize" in server.js');
                                    let t = await i("getGlobalObject", "messageBlockSize");
                                    if ("number" != typeof t) throw new Error('"messageBlockSize" should be a number');
                                    e.score += .5, u('"messageBlockSize" is ' + t), p('(Server) Checking if "message" event handler for "WebSocket" was updated to add message blocks');
                                    let o = await i("getObjectByString", `messages['${__tester.defaults.testRoomId}']`),
                                        s = Array.from({
                                            length: t - o.length
                                        }, e => Object.assign({
                                            roomId: __tester.defaults.testRoomId
                                        }, n())),
                                        a = [],
                                        r = new WebSocket(__tester.defaults.webSocketServer),
                                        c = new WebSocket(__tester.defaults.webSocketServer),
                                        l = {},
                                        m = {};
                                    if (r.addEventListener("message", e => l.resolve(JSON.parse(e.data))), c.addEventListener("message", e => m.resolve(JSON.parse(e.data))), await g(500), p("(Server) Sending " + s.length + " test messages"), await b.call(s, async (e, t) => {
                                            let o = await new Promise((o, s) => {
                                                t % 2 == 0 ? (m.resolve = o, m.reject = s, r.send(JSON.stringify(e))) : (l.resolve = o, l.reject = s, c.send(JSON.stringify(e)))
                                            });
                                            a.push(o)
                                        }, null, 25), d(s, a)) {
                                        e.score += .25, u('"broker" still working correctly');
                                        let t = await i("callObjectByString", "db.getLastConversation", __tester.defaults.testRoomId);
                                        t && t.messages instanceof Array ? d(s, t.messages.slice(o.length).map(e => Object.assign(e, {
                                            roomId: __tester.defaults.testRoomId
                                        }))) ? (e.score += 1, u('"message" event handler for "WebSocket" adds conversation object when the "messages["' + __tester.defaults.testRoomId + '"]" cache grows to "messageBlockSize"'), (o = await i("getObjectByString", `messages['${__tester.defaults.testRoomId}']`)).length > 0 ? e.comments.push(v('messages["' + __tester.defaults.testRoomId + '"] array should be cleared after the messages are saved in the database')) : (e.score += .5, u('messages["' + __tester.defaults.testRoomId + '"]" array is cleared'))) : e.comments.push(v(`The ${s.length} test messages sent by the test WebSocket client does not match the messages in the last conversation object`)) : e.comments.push(v("Could not retrieve the last conversation added for room " + __tester.defaults.testRoomId))
                                    } else e.comments.push(v(`The ${s.length} test messages sent by the test WebSocket client does not match the ${a.length} messages received`, "\nSent:", s, "\nReceived:", a))
                                } catch (t) {
                                    e.comments.push(v(t.message))
                                }
                                p('(Server) Checking if "/chat/:room_id/messages" GET endpoint was defined');
                                let r = await t("/chat/" + __tester.defaults.testRoomId + "/messages?before=" + (2e3 + o.timestamp));
                                if (d(s, r) ? (e.score += 1, u("GET /chat/:room_id/messages returns the same object as db.getLastConversation")) : e.comments.push(v('Object returned at the GET "/chat/:room_id/messages" endpoint is not equivalent to the object returned by "db.getLastConversation"', "\nfrom GET endpoint:", r, "\nfrom db.getLastConversation:", s)), p('(Client) Checking "Service.getLastConversation" in app.js'), Service.getLastConversation && Service.getLastConversation instanceof Function) {
                                    let t = await Service.getLastConversation(__tester.defaults.testRoomId, 2e3 + o.timestamp);
                                    d(s, t) ? (e.score += 1, u('"Service.getLastConversation" returns the same object as "db.getLastConversation"')) : e.comments.push(v('Object returned by "Service.getLastConversation" is not equivalent to the object returned by "db.getLastConversation"'))
                                } else e.comments.push(v('"Service.getLastConversation" is not defined'))
                            } catch (t) {
                                t.message.indexOf("timed out") > -1 ? e.comments.push(v('"db.getLastConversation" did not resolve to anything (test timed out after waiting for 5 seconds)')) : e.comments.push(v('Error upon calling "db.getLastConversation" in server.js: ' + t.message))
                            }
                        } else e.comments.push(v('Object returned by "db.addConversation" is not equivalent to the Object passed to it', "\nAdded: ", o, "\nReturned: ", s))
                    } else e.comments.push(v('The object returned by "db.addConversation" is missing "_id" property'))
                } catch (t) {
                    t.message.indexOf("timed out") > -1 ? e.comments.push(v('"db.addConversation" did not resolve to anything (test timed out after waiting for 5 seconds)')) : e.comments.push(v('Error upon calling "db.addConversation" in server.js: ' + t.message))
                }
                return e
            }
        }, {
            id: "5.1",
            description: "Generator function",
            maxScore: 5,
            run: async () => {
                let e = {
                    id: 5.1,
                    score: 0,
                    comments: []
                };
                if (p('(Client) Checking "addConversation" method of "Room"'), Room.prototype.addConversation && Room.prototype.addConversation instanceof Function) {
                    e.score += .25;
                    let t = r(Math.random().toString(), Date.now()),
                        o = a();
                    o.messages = [], await new Promise((s, n) => {
                        let a = 0;
                        o.onFetchConversation = (o => {
                            0 === a ? (d(o, t) ? (e.score += .5, u('"onFetchConversation" was called inside "addConversation" method')) : e.comments.push(v('Object passed to "onFetchConversation" callback is not equivalent to the object passed to "addConversation"', "\naddConversation was called with: ", t, "\nonFetchConversation got: ", o)), s(), a++) : (e.comments.push(v('"onFetchConversation" was called more than once inside "addConversation" method')), e.score += -.25)
                        }), o.addConversation(t), n(new Error('"onFetchConversation" was never invoked'))
                    }), d(t.messages, o.messages) ? (e.score += .5, u('Messages in the conversation object were added to "messages"')) : e.comments.push(v('"messages" passed to "addConversation" method does not match the "messages" in the test room instance', "\nIn conversation:", t.messages, "\nIn room:", o.messages))
                } else e.comments.push(v('"addConversation" function not found on "Room.prototype"'));
                if (p('(Client) Checking "makeConversationLoader"'), makeConversationLoader && makeConversationLoader instanceof Function) {
                    let t = function*() {
                            yield !0
                        },
                        o = Object.getPrototypeOf(t).constructor;
                    if (Object.getPrototypeOf(makeConversationLoader) !== o.prototype) e.comments.push(v('"makeConversationLoader" should be declared as a generator function'));
                    else {
                        e.score += .25, u('"makeConversationLoader" is a Generator Function');
                        let t = a();
                        t.messages = [];
                        let o = Service.getLastConversation,
                            s = {},
                            n = {},
                            i = 0;
                        Service.getLastConversation = ((e, t) => new Promise((o, n) => {
                            s.resolve = o, s.reject = n, s.args = {
                                room_id: e,
                                before: t
                            }, i += 1
                        })), t.addConversation = (e => {
                            s.conversation = e
                        }), p('(Client) Creating a Generator = "TestGen" by calling "makeConversationLoader" with a test room object');
                        let c = Date.now(),
                            l = makeConversationLoader(t);
                        await g(250), await (async () => {
                            p('(Client) Calling "TestGen.next" first time');
                            let o = l.next();
                            !1 !== t.canLoadConversation ? e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to false before calling Service.getLastConversation")) : (e.score += .25, u('"canLoadConversation" was set to false before calling Service.getLastConversation')), s.args.room_id !== t.id ? e.comments.push(v(`Expected Service.getLastConversation to be called with the given room's id. Given room id = ${t.id}, Service.getLastConversation was called with room id = ${s.args.room_id})`)) : (e.score += .25, u('"Service.getLastConversation" was called with the given room id')), s.args.before || (s.args.before = Date.now()), Math.abs(c - s.args.before) > 1 ? e.comments.push(v("When calling TestGen.next() for the first time, the 'before' query parameter should be a timestamp earlier than the first message of the given room (e.g., timestamp when the room instance was created).")) : (e.score += .25, u('"Service.getLastConversation" was called with the current timestamp'));
                            let a = r(t.id, s.args.before - 36e5);
                            s.resolve(a);
                            await o.value;
                            d(s.conversation, a) ? (e.score += .25, u('"room.addConversation" was called with the conversation resolved from Service.getLastConversation')) : e.comments.push(v("Expected room.addConversation to be called with the conversation object resolved from Service.getLastConversation")), !0 !== t.canLoadConversation ? e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to true after Service.getLastConversation resolves to a conversation object")) : (e.score += .25, u('"room.canLoadConversation" was set to true after Service.getLastConversation resolved')), o.done ? e.comments.push(v('"TestGen" should not be done yet because "Service.getLastConversation" resolved to a conversation object')) : (e.score += .25, u('"TestGen" can load more data as expected')), n.args = s.args, n.conversation = a
                        })(), await (async () => {
                            p('(Client) Calling "TestGen.next" second time');
                            let o = l.next();
                            !1 !== t.canLoadConversation && e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to false before calling Service.getLastConversation")), s.args.room_id !== t.id && e.comments.push(v("Expected Service.getLastConversation to be called with the given room's id")), s.args.before !== n.conversation.timestamp ? e.comments.push(v("Expected the 'before' query parameter to be the previous conversation's timestamp when calling for the second time")) : (e.score += .25, u('"Service.getLastConversation" was called with the previous conversation timestamp'));
                            let a = r(t.id, s.args.before - 36e5);
                            s.resolve(a);
                            await o.value;
                            d(s.conversation, a) || e.comments.push(v("Expected room.addConversation to be called with the conversation object resolved from Service.getLastConversation")), !0 !== t.canLoadConversation && e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to true after Service.getLastConversation resolves to a conversation object")), o.done ? e.comments.push(v('"TestGen" should not be done yet because "Service.getLastConversation" resolved to a conversation object')) : (e.score += .25, u('"TestGen" can load more data as expected')), n.args = s.args, n.conversation = a
                        })(), await (async () => {
                            p('(Client) Calling "TestGen.next" third time');
                            let o = l.next();
                            !1 !== t.canLoadConversation && e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to false before calling Service.getLastConversation")), s.args.room_id !== t.id && e.comments.push(v("Expected Service.getLastConversation to be called with the given room's id")), s.args.before !== n.conversation.timestamp ? e.comments.push(v("Expected the 'before' query parameter to be the previous conversation's timestamp when calling for the third time")) : (e.score += .25, u('"Service.getLastConversation" was called with the previous conversation timestamp'));
                            let a = r(t.id, s.args.before - 36e5);
                            s.resolve(a);
                            await o.value;
                            d(s.conversation, a) || e.comments.push(v("Expected room.addConversation to be called with the conversation object resolved from Service.getLastConversation")), !0 !== t.canLoadConversation && e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to true after Service.getLastConversation resolves to a conversation object")), o.done ? e.comments.push(v('"TestGen" should not be done yet because "Service.getLastConversation" resolved to a conversation object')) : (e.score += .25, u('"TestGen" can load more data as expected')), n.args = s.args, n.conversation = a
                        })(), await (async () => {
                            p('(Client) Calling "TestGen.next" fourth time');
                            let o = l.next();
                            !1 !== t.canLoadConversation && e.comments.push(v("Expected room object's 'canLoadConversation' property to be set to false before calling Service.getLastConversation")), s.args.room_id !== t.id && e.comments.push(v("Expected Service.getLastConversation to be called with the given room's id")), s.args.before !== n.conversation.timestamp ? e.comments.push(v("Expected the 'before' query parameter to be the previous conversation's timestamp when calling for the third time")) : u('"Service.getLastConversation" was called with the previous conversation timestamp'), s.resolve(null);
                            await o.value;
                            !1 !== t.canLoadConversation ? e.comments.push(v("Room object's 'canLoadConversation' property should remain false when Service.getLastConversation resolves to null")) : (e.score += .5, u('"room.canLoadConversation" remains false after Service.getLastConversation resolved to null')), (o = l.next()).done ? (e.score += .25, u('"TestGen" is done as expected'), 4 !== i ? e.comments.push(v('Expected "Service.getLastConversation" to be called 4 times in total, but was called ' + i + " times")) : e.score += .25) : e.comments.push(v('"TestGen" should be done after calling next() one last time, because "Service.getLastConversation" resolved to null'))
                        })(), Service.getLastConversation = o
                    }
                } else e.comments.push(v('"makeConversationLoader" is not defined in app.js (in the global context)'));
                return e
            }
        }, {
            id: "5.2",
            description: "Infinite scroll",
            maxScore: 3,
            run: async () => {
                let e = {
                    id: 5.2,
                    score: 0,
                    comments: []
                };
                p('(Client) Checking "Room" class constructor modifications');
                let t = a();
                if (p('(Client) Checking "canLoadConversation" property of a "Room" instance'), t.canLoadConversation && "boolean" == typeof t.canLoadConversation ? !0 !== t.canLoadConversation ? e.comments.push(v('"canLoadConversation" property of a "Room" instance should be set to true')) : (e.score += .25, u('"canLoadConversation" is true')) : e.comments.push(v('"canLoadConversation" property of a "Room" instance should be set to true')), p('(Client) Checking "getLastConversation" property of a "Room" instance'), t.getLastConversation)
                    if (Object.getPrototypeOf(t.getLastConversation) !== makeConversationLoader.prototype) e.comments.push(v('"getLastConversation" property of a "Room" should be a Generator returned by "makeConversationLoader"'));
                    else {
                        e.score += .25, u('"getLastConversation" is a Generator');
                        let o = Service.getLastConversation;
                        p('(Client) Checking if "makeConversationLoader" was called by passing the Room instance');
                        try {
                            let s = await new Promise((e, o) => {
                                Service.getLastConversation = ((t, o) => (e(t), Promise.resolve(null))), t.getLastConversation.next(), setTimeout(() => o(new Error('Timed out after calling "room.getLastConversation.next" and waiting for "Service.getLastConversation" to be called')), 1e3)
                            });
                            s === t.id ? (e.score += .25, u('"makeConversationLoader" was called with the Room instance')) : e.comments.push(v('"makeConversationLoader" was not called with the Room instance - Service.getLastConversation received room_id = ' + s))
                        } catch (t) {
                            e.comments.push(v(t.message))
                        } finally {
                            Service.getLastConversation = o
                        }
                    }
                else e.comments.push(v('"getLastConversation" property of a "Room" instance is not defined'));
                p('(Client) Checking "ChatView" class modifications - this requires "lobby" and "chatView" to be exported');
                let o = __tester.exports.get(main);
                if (o)
                    if (o.lobby)
                        if (o.chatView) {
                            let t = o.lobby.rooms[__tester.defaults.testRoomId],
                                s = o.chatView,
                                a = t.getLastConversation,
                                i = t.messages,
                                d = t.canLoadConversation;
                            t.messages = Array.from({
                                length: 20 + Math.round(15 * Math.random())
                            }, e => n());
                            let c = window.location.hash;
                            window.location.hash = "#/chat/" + __tester.defaults.testRoomId, c === window.location.hash && s.setRoom(t);
                            try {
                                p('(Client) Checking "wheel/mousewheel" event listener on "this.chatElem"');
                                let o = __tester.listeners.find(e => e.node === s.chatElem && ("wheel" === e.type || "mousewheel" === e.type));
                                if (o) {
                                    let n;
                                    e.score += .25, u('Found a "' + o.type + '" event listener');
                                    await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => (e(), {
                                                value: Promise.resolve(null),
                                                done: !0
                                            })
                                        }, s.chatElem.scrollTop = 0, t.canLoadConversation = !0, n = new WheelEvent("wheel", {
                                            deltaY: -1
                                        }), o.invoke(n), setTimeout(() => a(new Error('"room.getLastConversation" was not called')), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when scrollTop > 0'))
                                        }, s.chatElem.scrollTop = 1, t.canLoadConversation = !0, n = new WheelEvent("wheel", {
                                            deltaY: -1
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when "canLoadConversation" is false'))
                                        }, s.chatElem.scrollTop = 0, t.canLoadConversation = !1, n = new WheelEvent("wheel", {
                                            deltaY: -1
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when "canLoadConversation" is false'))
                                        }, s.chatElem.scrollTop = 1, t.canLoadConversation = !1, n = new WheelEvent("wheel", {
                                            deltaY: -1
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when WheelEvent deltaY >= 0'))
                                        }, s.chatElem.scrollTop = 0, t.canLoadConversation = !0, n = new WheelEvent("wheel", {
                                            deltaY: 0
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when WheelEvent deltaY >= 0'))
                                        }, s.chatElem.scrollTop = 1, t.canLoadConversation = !0, n = new WheelEvent("wheel", {
                                            deltaY: 0
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when WheelEvent deltaY >= 0'))
                                        }, s.chatElem.scrollTop = 0, t.canLoadConversation = !1, n = new WheelEvent("wheel", {
                                            deltaY: 0
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    }), await new Promise((e, a) => {
                                        t.getLastConversation = {
                                            next: () => a(new Error('"room.getLastConversation" should not be called when WheelEvent deltaY >= 0'))
                                        }, s.chatElem.scrollTop = 1, t.canLoadConversation = !1, n = new WheelEvent("wheel", {
                                            deltaY: 0
                                        }), o.invoke(n), setTimeout(() => e(), 100)
                                    });
                                    t.getLastConversation = a, e.score += .75
                                } else e.comments.push(v('Could not find a "wheel/mousewheel" event listener on the "chatElem" property of a ChatView instance'));
                                if (p('(Client) Checking if "setRoom" method of "ChatView" was updated'), t.onFetchConversation = void 0, s.room = null, s.setRoom(t), p('(Client) Checking if "onFetchConversation" callback is added to the "this.room" object'), t.onFetchConversation && t.onFetchConversation instanceof Function) {
                                    e.score += .25, u('"onFetchConversation" function was assigned to the room inside "setRoom" method'), p('(Client) Checking "onFetchConversation" implementation');
                                    let o = r(t.id, Date.now()),
                                        n = s.chatElem.scrollHeight;
                                    t.onFetchConversation(o);
                                    let a = Array.from(s.chatElem.querySelectorAll(".message"));
                                    o.messages.reduce((e, t, o) => e && a[o].innerText.includes(t.username) && a[o].innerText.includes(t.text), !0) ? (e.score += .5, u("The messages in the conversation object were rendered properly")) : e.comments.push(v("The messages in the conversation object were not rendered correctly", "\nMessages: ", o.messages, "\nHTML: ", a.slice(0, o.messages.length).map(e => ({
                                        innerHTML: e.innerHTML.trim(),
                                        node: e
                                    })))), p('(Client) Checking if "scrollTop" value is correct after added more messages in the view'), s.chatElem.scrollTop < s.chatElem.scrollHeight - n - 1 || s.chatElem.scrollTop > s.chatElem.scrollHeight - n + 1 ? e.comments.push(v('"scrollTop" has incorrect value: expected = ' + (s.chatElem.scrollHeight - n) + " ± 1.0, current = " + s.chatElem.scrollTop)) : (e.score += .5, u('"scrollTop" set to the right value'))
                                } else e.comments.push(v('"onFetchConversation" function was not assigned to the given "room" when "ChatView.prototype.setRoom" was called'))
                            } catch (t) {
                                e.comments.push(v("Error while checking ChatView modifications: " + t.message, t))
                            } finally {
                                t.messages = i, t.getLastConversation = a, t.canLoadConversation = d, s.setRoom(t), window.location.hash = c
                            }
                        } else e.comments.push(v('local variable "chatView" inside "main" was not found/exported'));
                else e.comments.push(v('local variable "lobby" inside "main" was not found/exported'));
                else e.comments.push(v('Unable to test: local variables inside "main" were not exported'));
                return e
            }
        }],
        l = String.fromCodePoint(128030),
        m = String.fromCodePoint(128077),
        h = (e, t) => {
            let o = document.createElement(e);
            return t && t.appendChild(o), o
        },
        g = e => new Promise((t, o) => setTimeout(t, e)),
        p = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m", e, ...t), e),
        v = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m %c Bug " + l + " ", "background-color: red; color: white; padding: 1px;", e, ...t), e),
        u = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m %c OK " + m + " ", "background-color: green; color: white; padding: 1px;", e, ...t), e);

    function b(e, t, o = 0) {
        let s = this,
            n = t || this,
            a = e.bind(n),
            r = async e => e === s.length ? null : (o > 0 && e > 0 && await g(o), await a(s[e], e, s), await r(e + 1));
        return r(0)
    }
    let C = window.localStorage.getItem("store_a4");
    C = C ? JSON.parse(C) : {
        options: {
            showLogs: !0
        },
        selection: {},
        results: {},
        lastTestAt: null
    };
    let f = {},
        w = h("div");
    w.style.position = "fixed", w.style.top = "0px", w.style.right = "0px";
    let y = h("button");
    y.textContent = "Test", y.style.backgroundColor = "red", y.style.color = "white", y.style.padding = "0.5em";
    let S = h("div");
    S.style.padding = "0.5em", S.style.position = "fixed", S.style.right = "0px", S.style.display = "flex", S.style.flexDirection = "column", S.style.backgroundColor = "white", S.style.visibility = "hidden";
    let L = h("div", S),
        j = h("label", L),
        T = h("input", j);
    T.type = "checkbox", T.checked = !("showLogs" in C.options) || C.options.showLogs, T.addEventListener("change", e => {
        C.options.showLogs = e.target.checked, window.localStorage.setItem("store_a4", JSON.stringify(C))
    }), j.appendChild(document.createTextNode(" Show logs during test"));
    let k = h("table", S);
    k.style.borderCollapse = "collapse";
    let x = h("thead", k);
    x.style.backgroundColor = "dimgray", x.style.color = "white";
    let _ = h("tr", x),
        E = h("th", _);
    E.textContent = "Task", E.style.padding = "0.25em";
    let R = h("th", _);
    R.textContent = "Description", R.style.padding = "0.25em";
    let O = h("th", _);
    O.textContent = "Run", O.style.padding = "0.25em";
    let G = h("input", O);
    G.type = "checkbox", G.checked = !!(C.selection && Object.keys(C.selection).length > 0) && Object.values(C.selection).reduce((e, t) => e && t, !0), G.addEventListener("change", e => {
        c.forEach(t => {
            f[t.id].checkBox.checked = e.target.checked, C.selection[t.id] = e.target.checked
        }), window.localStorage.setItem("store_a4", JSON.stringify(C))
    });
    let P = h("th", _);
    P.textContent = "Result", P.style.padding = "0.25em";
    let A = h("tbody", k),
        B = h("tfoot", k),
        I = h("tr", B);
    I.style.borderTop = "1px solid dimgray";
    let M = h("th", I);
    M.textContent = "Total", M.colSpan = 3;
    let D = h("th", I);
    D.textContent = "-";
    let W = () => {
            let e = 0,
                t = 0,
                o = [];
            return c.forEach(s => {
                let n = C.results[s.id];
                e += n.score, t += s.maxScore, n.comments.length > 0 && o.push("Task " + s.id + ":\n" + n.comments.map(e => "  - " + e).join("\n"))
            }), D.textContent = e + "/" + t, {
                sum: e,
                max: t,
                comments: o.join("\n")
            }
        },
        q = h("button", S);
    q.id = "test-button", q.textContent = "Run Tests";
    let F = h("div", S);
    F.style.fontSize = "0.8em", F.style.textAlign = "right", C.lastTestAt && (W(), F.textContent = "Last Run at: " + new Date(C.lastTestAt).toLocaleString()), c.forEach((e, t) => {
        let o = h("tr", A);
        o.style.backgroundColor = t % 2 == 0 ? "white" : "#eee";
        let s = h("td", o);
        s.textContent = e.id, s.style.textAlign = "center", h("td", o).textContent = e.description;
        let n = h("td", o);
        n.style.textAlign = "center";
        let a = h("input", n);
        a.type = "checkbox", a.checked = e.id in C.selection && C.selection[e.id], a.addEventListener("change", t => {
            C.selection[e.id] = t.target.checked, window.localStorage.setItem("store_a4", JSON.stringify(C))
        });
        let r = h("td", o);
        r.style.textAlign = "center", r.textContent = e.id in C.results ? C.results[e.id].skipped ? "-" : C.results[e.id].score + "/" + e.maxScore : "-", f[e.id] = {
            checkBox: a,
            resultCell: r
        }
    }), w.appendChild(y), w.appendChild(S), q.addEventListener("click", async e => {
        q.disabled = !0, await b.call(c, async e => {
            let t = f[e.id].checkBox,
                o = f[e.id].resultCell;
            if (t.checked) {
                let t;
                q.textContent = "Running Test " + e.id;
                try {
                    p("--- Starting Test " + e.id + " ---"), t = await e.run(), p("--- Test " + e.id + " Finished --- Score = " + Math.round(100 * t.score) / 100 + " / " + e.maxScore), t && t.comments.length > 0 && p("Task " + e.id + ":\n" + t.comments.map(e => "  - " + e).join("\n")), C.results[e.id] = {
                        skipped: !1,
                        score: t ? Math.round(100 * t.score) / 100 : 0,
                        comments: t ? t.comments : []
                    }
                } catch (t) {
                    C.results[e.id] = {
                        skipped: !1,
                        score: 0,
                        comments: ["Error while running tests: " + t.message]
                    }, console.log(t)
                }
                C.options.showLogs && console.log("")
            } else C.results[e.id] = {
                skipped: !0,
                score: 0,
                comments: []
            };
            o.textContent = C.results[e.id].skipped ? "Skipped" : Math.round(100 * C.results[e.id].score) / 100 + "/" + e.maxScore
        });
        let t = W();
        console.log("[34m[Tester][0m", "Total = " + t.sum + " / " + t.max), console.log(t.comments), C.lastTestAt = Date.now(), window.localStorage.setItem("store_a4", JSON.stringify(C)), F.textContent = "Last Run at: " + new Date(C.lastTestAt).toLocaleString(), q.textContent = "Run Tests", q.disabled = !1
    }), y.addEventListener("click", e => "hidden" == S.style.visibility ? S.style.visibility = "visible" : S.style.visibility = "hidden"), document.body.appendChild(w)
});
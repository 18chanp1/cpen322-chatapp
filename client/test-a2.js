const __tester = {
    listeners: [],
    timers: [],
    exports: new Map,
    defaults: {
        image: "assets/everyone-icon.png",
        webSocketServer: "ws://localhost:8000"
    },
    oldAddEventListener: HTMLElement.prototype.addEventListener,
    newAddEventListener: function(e, t, ...s) {
        return __tester.listeners.push({
            node: this,
            type: e,
            listener: t,
            invoke: e => t.call(this, e)
        }), __tester.oldAddEventListener.call(this, e, t, ...s)
    },
    oldSetInterval: window.setInterval,
    newSetInterval: function(e, t, ...s) {
        return __tester.timers.push({
            type: "Interval",
            func: e,
            delay: t
        }), __tester.oldSetInterval.call(this, e, t, ...s)
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
        t = "http://52.43.220.29:5000/",
        s = () => new Room(Math.random().toString(), Math.random().toString(), __tester.defaults.image, [{
            username: Math.random().toString(),
            text: Math.random().toString()
        }, {
            username: Math.random().toString(),
            text: Math.random().toString()
        }]),
        o = (t, ...s) => e("cpen322/a3", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                func: t,
                args: s
            })
        }).then(e => 200 === e.status ? e.json() : e.text().then(e => {
            throw new Error(e)
        })),
        r = [{
            id: "1",
            description: "Getting data via AJAX GET",
            maxScore: 5,
            run: async () => {
                let e = {
                    id: 1,
                    score: 0,
                    comments: []
                };
                if (c('Checking "Service"'), "undefined" == typeof Service) e.comments.push(d('global variable "Service" is not defined'));
                else if (e.score += .25, l('Found global variable named "Service"'), c('Checking "Service.origin"'), Service.origin && "string" == typeof Service.origin ? Service.origin !== window.location.origin ? e.comments.push(d('"Service.origin" is not set to window.location.origin')) : (e.score += .25, l('"Service.origin" is set to window.location.origin')) : e.comments.push(d('"Service.origin" is not defined')), c('Checking "Service.getAllRooms"'), Service.getAllRooms && Service.getAllRooms instanceof Function) {
                    e.score += .25, l('"Service.getAllRooms" is a function');
                    let s = Math.random().toString(),
                        o = Service.origin;
                    Service.origin = t + s;
                    try {
                        c('Calling "Service.getAllRooms" with "Service.origin" set to ' + Service.origin);
                        let t = Service.getAllRooms();
                        if (t && t instanceof Promise) {
                            e.score += .5, l('"getAllRooms" returns a Promise');
                            let o = await t;
                            if (o && o instanceof Array) {
                                e.score += .25, l('Promise returned by "getAllRooms" resolves to an Array'), o.map(e => e.id).join("") !== s.split(".")[1] ? e.comments.push(d('Promise returned by "getAllRooms" does not resolve to the Array returned by the test server')) : (e.score += .5, l('Promise returned by "getAllRooms" resolves to the Array returned by the test server'))
                            } else e.comments.push(d('Promise returned by "getAllRooms" does not resolve to an Array'))
                        } else e.comments.push(d('"getAllRooms" should return a Promise'))
                    } catch (t) {
                        e.comments.push(d('Unexpected error when calling "getAllRooms": ' + t.message)), c(t)
                    } finally {
                        Service.origin = o
                    }
                    s = Math.random().toString(), Service.origin = t + "error/" + s;
                    try {
                        c('Calling "Service.getAllRooms" with "Service.origin" set to ' + Service.origin);
                        let t = Service.getAllRooms();
                        if (t && t instanceof Promise) {
                            await t;
                            e.comments.push(d('Promise returned by "getAllRooms" should reject upon any server-side error'))
                        } else e.comments.push(d('"getAllRooms" should return a Promise'))
                    } catch (t) {
                        t instanceof Error && t.message === "Server Error 500: " + s ? (e.score += .5, l('Promise rejected by "getAllRooms" upon server-side error contains an Error object with the error message given by the server')) : e.comments.push(d('Promise rejected by "getAllRooms" upon server-side error should contain an Error object with the error message given by the server'))
                    } finally {
                        Service.origin = o
                    }
                    s = Math.random().toString(), Service.origin = "http://invalid-url";
                    try {
                        c('Calling "Service.getAllRooms" with "Service.origin" set to ' + Service.origin);
                        let t = Service.getAllRooms();
                        if (t && t instanceof Promise) {
                            await t;
                            e.comments.push(d('Promise returned by "getAllRooms" should reject upon any client-side error'))
                        } else e.comments.push(d('"getAllRooms" should return a Promise'))
                    } catch (t) {
                        t instanceof Error ? (e.score += .25, l('Promise rejected by "getAllRooms" upon client-side error contains an Error object')) : e.comments.push(d('Promise rejected by "getAllRooms" upon client-side error should contain an Error object'))
                    } finally {
                        Service.origin = o
                    }
                } else e.comments.push(d('"Service.getAllRooms" function is not defined'));
                c('Checking "refreshLobby"');
                let o = __tester.exports.get(main);
                if (o)
                    if (o.refreshLobby)
                        if (o.lobby) {
                            let t = o.lobby,
                                r = o.refreshLobby;
                            if (t instanceof Lobby)
                                if (r instanceof Function) {
                                    e.score += .25, l('"refreshLobby" is a function');
                                    let o = Service.getAllRooms,
                                        n = t.rooms,
                                        i = Lobby.prototype.addRoom,
                                        a = {},
                                        m = {};
                                    for (let e = 0; e < 4; e++) {
                                        let e = s();
                                        a[e.id] = e, m[e.id] = e
                                    }
                                    t.rooms = m;
                                    let h = Object.values(m).map(e => ({
                                            id: e.id,
                                            name: Math.random().toString(),
                                            image: Math.random().toString()
                                        })).concat([{
                                            id: Math.random().toString(),
                                            name: Math.random().toString(),
                                            image: Math.random().toString(),
                                            messages: [{
                                                username: Math.random().toString(),
                                                text: Math.random().toString()
                                            }, {
                                                username: Math.random().toString(),
                                                text: Math.random().toString()
                                            }]
                                        }]),
                                        g = [new Promise((t, s) => {
                                            c('Checking if "Service.getAllRooms" was called inside "refreshLobby"'), Service.getAllRooms = (async () => (t(!0), e.score += .25, l('"Service.getAllRooms" was called inside "refreshLobby"'), h)), setTimeout(() => s(new Error('"getAllRooms" was not called inside "refreshLobby"')), 500)
                                        }), new Promise((t, s) => {
                                            c('Checking if "lobby.addRoom" was called inside "refreshLobby" upon receiving a new room'), Lobby.prototype.addRoom = ((s, o, r, n) => {
                                                let i = new Room(s, o, r, n);
                                                m[String(i.id)] = i;
                                                let a = !!n && h[4].messages.reduce((e, t, s) => e && n[s] && t.username === n[s].username && t.text === n[s].text, !0);
                                                h[4].id !== s && e.comments.push(d(`lobby.addRoom was called with incorrect "id" - expected ${h[4].id} but got ${s}`)), h[4].name !== o && e.comments.push(d(`lobby.addRoom was called with incorrect "name" - expected ${h[4].name} but got ${o}`)), h[4].image !== r && e.comments.push(d(`lobby.addRoom was called with incorrect "image" - expected ${h[4].image} but got ${r}`)), a || e.comments.push(d('lobby.addRoom was called with incorrect "messages"')), h[4].id === s && h[4].name === o && h[4].image === r && a && (e.score += .25, l("lobby.addRoom was called correctly")), t(!0)
                                            }), setTimeout(() => s(new Error('Newly fetched room was not added using "lobby.addRoom" inside "refreshLobby"')), 500)
                                        })];
                                    try {
                                        r(), await Promise.all(g)
                                    } catch (t) {
                                        e.comments.push(d(t.message)), c(t)
                                    }
                                    Lobby.prototype.addRoom = i, t.rooms = n, Service.getAllRooms = o, c("Comparing the received rooms with lobby.rooms"), h.forEach((t, s) => {
                                        m[t.id] ? s < h.length - 1 && a[t.id] !== m[t.id] ? e.comments.push(d("Test room " + t.id + " instance was replaced with a new Room instance, instead of just updating the properties")) : m[t.id].name !== t.name ? e.comments.push(d("Test room " + t.id + ' "name" mismatch - expected name = ' + t.name)) : m[t.id].image !== t.image ? e.comments.push(d("Test room " + t.id + ' "image" mismatch - expected image = ' + t.image)) : (e.score += .25, l("Test room " + t.id + " OK")) : e.comments.push(d("Test room " + t.id + " not found"))
                                    })
                                } else e.comments.push(d('"refreshLobby" should be a function'));
                            else e.comments.push(d('"lobby" should be a Lobby instance'));
                            c('Checking if "refreshLobby" is called periodically');
                            let n = __tester.timers.find(e => e.func === r);
                            n ? n.delay < 5e3 ? e.comments.push(d("The interval given is too short - set it to at least 5 seconds or more")) : (e.score += .25, l('"refreshLobby" invoked periodically using setInterval')) : e.comments.push(d('"refreshLobby" not being invoked periodically using setInterval'))
                        } else e.comments.push(d('local variable "lobby" inside "main" was not found/exported'));
                else e.comments.push(d('local variable "refreshLobby" inside "main" was not found/exported'));
                else e.comments.push(d('Unable to test: local variables inside "main" were not exported'));
                return e
            }
        }, {
            id: "2",
            description: "Handling GET request at the Server",
            maxScore: 4,
            run: async () => {
                let t = {
                    id: 2,
                    score: 0,
                    comments: []
                };
                try {
                    c('Trying to access "chatrooms" in server.js');
                    let e = await o("getGlobalObject", "chatrooms");
                    if (e && e instanceof Array)
                        if (t.score += .25, l('Found "chatrooms" Array in server.js'), e.length < 2) t.comments.push(d('"chatrooms" Array in server.js should contain at least 2 rooms'));
                        else {
                            let s = {};
                            e.reduce((e, o) => o.id && "string" == typeof o.id ? o.id && "string" == typeof o.id && s[o.id] ? (t.comments.push(d('object inside chatrooms should have a unique "id"')), !1) : o.name && "string" == typeof o.name ? o.image && "string" == typeof o.image ? o.messages ? (t.comments.push(d('object inside chatrooms should not have a "messages" property')), !1) : (s[o.id] = o, e && !0) : (t.comments.push(d('object inside chatrooms should have a string "image"')), !1) : (t.comments.push(d('object inside chatrooms should have a string "name"')), !1) : (t.comments.push(d('object inside chatrooms should have a string "id"')), !1), !0) && (t.score += .5, l('"chatrooms" contains the right objects'));
                            try {
                                c('Trying to access "messages" in server.js');
                                let s = await o("getGlobalObject", "messages");
                                if (s) {
                                    t.score += .25, l('Found "messages" object in server.js'), e.reduce((e, o) => s[o.id] && s[o.id] instanceof Array ? e && !0 : (t.comments.push(d('"messages" object should contain an array for each room in "chatrooms". messages["' + o.id + '"] is currently ' + JSON.stringify(s[o.id]))), !1), !0) && (t.score += .5, l('"messages" object contains the right objects'))
                                } else t.comments.push(d('"messages" object in server.js was not found/exported'))
                            } catch (e) {
                                t.comments.push(d('Error while getting "messages" object from the server: ' + e.message)), c(e)
                            }
                        }
                    else t.comments.push(d('"chatrooms" Array in server.js was not found/exported'))
                } catch (e) {
                    t.comments.push(d('Error while getting "chatrooms" array from the server: ' + e.message)), c(e)
                }
                try {
                    c("Making a GET request to /chat");
                    let s = await e("/chat");
                    if (200 !== s.status) t.comments.push(d("Error while making GET request to /chat: Server did not respond with status 200"));
                    else {
                        t.score += .5, l("Server responded with status 200 when making GET request to /chat");
                        let e = await s.json();
                        if (e && e instanceof Array) {
                            t.score += .5, l("Server returned an Array at /chat"), e.length < 2 ? t.comments.push(d("Error while making GET request to /chat: Server should return at least 2 rooms")) : e.slice(0, 2).forEach(e => {
                                e.id && "string" == typeof e.id ? e.name && "string" == typeof e.name ? e.image && "string" == typeof e.image ? e.messages && e.messages instanceof Array ? (t.score += .5, l(`Room ${e.id} looks OK`)) : t.comments.push(d('Error while making GET request to /chat: room should contain "messages" (Array)')) : t.comments.push(d('Error while making GET request to /chat: room should contain "image" (string)')) : t.comments.push(d('Error while making GET request to /chat: room should contain "name" (string)')) : t.comments.push(d('Error while making GET request to /chat: room should contain "id" (string)'))
                            });
                            try {
                                c('Checking if "chatrooms" was modified in server.js');
                                let e = await o("getGlobalObject", "chatrooms");
                                if (e && e instanceof Array)
                                    if (e.length < 2) t.comments.push(d('"chatrooms" Array in server.js should contain at least 2 rooms'));
                                    else {
                                        e.reduce((e, t) => e && !t.messages, !0) ? (t.score += .5, l('The room objects in "chatrooms" was not modified')) : t.comments.push(d('The room objects in "chatrooms" was modified'))
                                    }
                                else t.comments.push(d('"chatrooms" Array in server.js was not found/exported'))
                            } catch (e) {
                                t.comments.push(d('Error while getting "chatrooms" array from the server: ' + e.message)), c(e)
                            }
                        } else t.comments.push(d("Error while making GET request to /chat: Server should return an Array object"))
                    }
                } catch (e) {
                    t.comments.push(d("Error while making GET request to /chat: " + e.message)), c(e)
                }
                return t
            }
        }, {
            id: "3",
            description: "AJAX POST",
            maxScore: 4,
            run: async () => {
                let s = {
                    id: 3,
                    score: 0,
                    comments: []
                };
                if ("undefined" == typeof Service) s.comments.push(d('global variable "Service" is not defined'));
                else if (c('Checking "Service.addRoom"'), Service.addRoom && Service.addRoom instanceof Function) {
                    s.score += .25, l('"Service.addRoom" is a function');
                    let r = Math.random().toString(),
                        n = Service.origin;
                    Service.origin = t + r;
                    try {
                        let e = {
                            name: Math.random().toString(),
                            image: Math.random().toString()
                        };
                        c('Calling "Service.addRoom" with "Service.origin" set to ' + Service.origin);
                        let t = Service.addRoom(e);
                        if (t && t instanceof Promise) {
                            s.score += .25, l('"addRoom" returns a Promise');
                            let o = await t;
                            o ? o.id && o.id === r ? o.name && o.name === e.name ? o.image && o.image === e.image ? (s.score += .5, l('Promise returned by "addRoom" resolves to the object returned by the server')) : s.comments.push(d('Promise returned by "addRoom" does not resolve to the object returned by the server: "image" mismatch')) : s.comments.push(d('Promise returned by "addRoom" does not resolve to the object returned by the server: "name" mismatch')) : s.comments.push(d('Promise returned by "addRoom" does not resolve to the object returned by the server: "id" mismatch')) : s.comments.push(d('Promise returned by "addRoom" does not resolve to an object'))
                        } else s.comments.push(d('"addRoom" should return a Promise'))
                    } catch (e) {
                        s.comments.push(d('Unexpected error when calling "addRoom": ' + e.message)), c(e)
                    } finally {
                        Service.origin = n
                    }
                    r = Math.random().toString(), Service.origin = t + "error/" + r;
                    try {
                        let e = {
                            name: Math.random().toString(),
                            image: Math.random().toString()
                        };
                        c('Calling "Service.addRoom" with "Service.origin" set to ' + Service.origin);
                        let t = Service.addRoom(e);
                        if (t && t instanceof Promise) {
                            await t;
                            s.comments.push(d('Promise returned by "addRoom" should reject upon any server-side error'))
                        } else s.comments.push(d('"addRoom" should return a Promise'))
                    } catch (e) {
                        e instanceof Error && e.message === "Server Error 500: " + r ? (s.score += .5, l('Promise rejected by "addRoom" upon server-side error contains an Error object with the error message given by the server')) : s.comments.push(d('Promise rejected by "addRoom" upon server-side error should contain an Error object with the error message given by the server'))
                    } finally {
                        Service.origin = n
                    }
                    r = Math.random().toString(), Service.origin = "http://invalid-url";
                    try {
                        let e = {
                            name: Math.random().toString(),
                            image: Math.random().toString()
                        };
                        c('Calling "Service.addRoom" with "Service.origin" set to ' + Service.origin);
                        let t = Service.addRoom(e);
                        if (t && t instanceof Promise) {
                            await t;
                            s.comments.push(d('Promise returned by "addRoom" should reject upon any client-side error'))
                        } else s.comments.push(d('"addRoom" should return a Promise'))
                    } catch (e) {
                        e instanceof Error ? (s.score += .25, l('Promise rejected by "addRoom" upon client-side error contains an Error object')) : s.comments.push(d('Promise rejected by "addRoom" upon client-side error should contain an Error object'))
                    } finally {
                        Service.origin = n
                    }
                    try {
                        let t = __tester.exports.get(main).lobby,
                            r = await o("getGlobalObject", "chatrooms"),
                            n = {
                                name: Math.random().toString(),
                                image: __tester.defaults.image
                            };
                        c('Calling "Service.addRoom" with "Service.origin" set to ' + Service.origin);
                        let i = await Service.addRoom(n);
                        if (i && "string" == typeof i.id) {
                            s.score += .25, l("Found an id in the new room object returned by the server"), c('Checking if "chatrooms" and "messages" were updated in server.js');
                            let e = await o("getGlobalObject", "chatrooms"),
                                a = await o("getGlobalObject", "messages"),
                                m = e.find(e => e.id === i.id);
                            m ? (s.score += .25, l('Newly added room was added to "chatrooms" in server.js'), m.name !== n.name ? s.comments.push(d('Newly added room in "chatrooms" does not have the "name" given by the client')) : m.image !== n.image ? s.comments.push(d('Newly added room in "chatrooms" does not have the "image" given by the client')) : (s.score += .25, l('Newly added room in "chatrooms" has the properties set by the client'))) : s.comments.push(d('Newly added room was not added to "chatrooms" in server.js'));
                            let h = a[i.id];
                            h && h instanceof Array && 0 === h.length ? (s.score += .25, l('An empty array was added to messages["' + i.id + '"] in server.js')) : s.comments.push(d('An empty array should be added to messages["' + i.id + '"] in server.js')), t.rooms[i.id] && delete t.rooms[i.id], await o("callObjectByString", "chatrooms.splice", 0, e.length, ...r)
                        } else s.comments.push(d("Could not find an id in the new room object returned by the server"));
                        try {
                            c("Checking if server handles malformed request gracefully");
                            let t = new AbortController,
                                o = setTimeout(() => t.abort(), 5e3),
                                r = await e(Service.origin + "/chat", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: "",
                                    signal: t.signal
                                });
                            if (clearTimeout(o), 400 !== r.status) s.comments.push(d("Server should return HTTP status 400 when request is not formatted properly"));
                            else {
                                s.score += .25, l("Server returns HTTP status 400 when request is not formatted properly"), await r.text() ? (s.score += .25, l("Server returns some error message with HTTP status 400")) : s.comments.push(d("Server should return some error message with HTTP status 400"))
                            }
                        } catch (e) {
                            if ("AbortError" !== e.name) throw e;
                            s.comments.push(d("Request timed out because server did not return any response to a malformed request"))
                        }
                    } catch (e) {
                        s.comments.push(d("Error while testing POST endpoint on the server: " + e.message)), c(e)
                    }
                } else s.comments.push(d('"Service.addRoom" function is not defined'));
                c("Checking click event handler of lobbyView.buttonElem");
                let r = new Lobby,
                    n = new LobbyView(r),
                    i = {
                        id: Math.random().toString(),
                        name: Math.random().toString(),
                        image: __tester.defaults.image
                    },
                    a = Service.addRoom;
                try {
                    await new Promise((e, t) => {
                        Service.addRoom = (async t => (e(), t && t.name ? (s.score += .25, l('"Service.addRoom" was invoked and the argument has a property "name"')) : s.comments.push(d('"Service.addRoom" was invoked, but the argument did not have a property "name"')), {
                            id: i.id,
                            name: t.name,
                            image: t.image
                        })), n.inputElem.value = i.name, n.buttonElem.click(), setTimeout(() => t(new Error('"Service.addRoom" was not invoked when clicking lobbyView.buttonElem')), 200)
                    }), r.rooms[i.id] ? (s.score += .25, l("Newly added room was added to the lobby after Service.addRoom resolved successfully")) : s.comments.push(d("Newly added room was not added to the lobby after Service.addRoom resolved successfully"))
                } catch (e) {
                    s.comments.push(d('Error while testing buttonElem "click" event listener: ' + e.message)), c(e)
                }
                try {
                    r.rooms = {}, await new Promise((e, t) => {
                        Service.addRoom = (async t => {
                            throw e(), new Error("Unknown Error (intentionally thrown by the test script)")
                        }), n.inputElem.value = i.name, n.buttonElem.click(), setTimeout(() => t(new Error('"Service.addRoom" was not invoked when clicking lobbyView.buttonElem')), 200)
                    }), Object.keys(r.rooms).length > 0 ? s.comments.push(d("No room should be added to the lobby if Service.addRoom rejects")) : (s.score += .25, l("No room was added to the lobby when Service.addRoom rejected"))
                } catch (e) {
                    s.comments.push(d('Error while testing buttonElem "click" event listener: ' + e.message)), c(e)
                }
                return Service.addRoom = a, s
            }
        }, {
            id: "4",
            description: "WebSocket Client",
            maxScore: 3,
            run: async () => {
                let e = {
                        id: 4,
                        score: 0,
                        comments: []
                    },
                    t = __tester.exports.get(main);
                if (t)
                    if (c('Checking if "socket" is a WebSocket instance'), t.socket) {
                        let o = t.socket;
                        o instanceof WebSocket ? (e.score += .25, l('"socket" is a WebSocket instance')) : e.comments.push(d('"socket" should be a WebSocket instance')), c('Checking "message" event listener on "socket"');
                        let r = __tester.listeners.find(e => e.node === o && "message" === e.type);
                        if (r) {
                            e.score += .5, l('Found a "message" event listener on "socket"');
                            let o = t.lobby;
                            if (o instanceof Lobby) {
                                let t = o.rooms,
                                    n = Room.prototype.addMessage,
                                    i = {},
                                    a = s();
                                i[a.id] = a, o.rooms = i;
                                let m = {
                                        roomId: a.id,
                                        username: Math.random().toString(),
                                        text: Math.random().toString()
                                    },
                                    h = new MessageEvent("message", {
                                        data: JSON.stringify(m)
                                    }),
                                    g = new Promise((t, s) => {
                                        Room.prototype.addMessage = ((s, o) => {
                                            e.score += .5, l('"addMessage" was invoked'), s === m.username && o === m.text ? (e.score += .5, l('"addMessage" was invoked with correct arguments.')) : e.comments.push(d(`"addMessage" was invoked with incorrect arguments. Expecting: username = ${m.username}, text = ${m.text}; but got: username = ${s}, text = ${o}`)), t()
                                        }), c('Emitting test "message" event'), r.invoke(h), setTimeout(() => s(new Error('"addMessage" was not called upon "message" event')), 200)
                                    });
                                try {
                                    await g
                                } catch (t) {
                                    e.comments.push(d('Error while testing "message" event listener: ' + t.message)), c(t)
                                } finally {
                                    Room.prototype.addMessage = n, o.rooms = t
                                }
                            } else e.comments.push(d('"lobby" should be a Lobby instance'))
                        } else e.comments.push(d('Could not find a "message" event listener on "socket"'))
                    } else e.comments.push(d('local variable "socket" inside "main" was not found/exported'));
                else e.comments.push(d('Unable to test: local variables inside "main" were not exported'));
                if (c('Checking changes in "ChatView"'), "undefined" == typeof ChatView) e.comments.push(d('Could not find "ChatView"'));
                else {
                    let o = {
                            value: Math.random()
                        },
                        r = new ChatView(o);
                    if (r.socket !== o) e.comments.push(d('"ChatView" constructor should accept a single argument "socket" and assign it to the "socket" property'));
                    else {
                        if (e.score += .25, l('"ChatView" constructor accepts a single argument "socket" and assigns it to the "socket" property'), t.socket)
                            if (t.chatView) {
                                let s = t.socket;
                                t.chatView.socket !== s ? e.comments.push(d('"chatView" should be initialized with the "socket" object created inside "main"')) : (e.score += .25, l('"chatView" is initialized with the "socket" object created inside "main"'))
                            } else e.comments.push(d('local variable "chatView" inside "main" was not found/exported'));
                        else e.comments.push(d('local variable "socket" inside "main" was not found/exported'));
                        let n = s(),
                            i = Math.random().toString();
                        r.room = n, r.inputElem.value = i;
                        let a = new Promise((t, s) => {
                            o.send = (s => {
                                if ("string" != typeof s) e.comments.push(d('"send" expects a JSON string. Got: ' + typeof s));
                                else {
                                    let t;
                                    e.score += .25, l('"send" received a string as the argument');
                                    try {
                                        (t = JSON.parse(s)).roomId !== n.id ? e.comments.push(d('"roomId" in the message does not match the expected value. Expected: ' + n.id + " but got " + t.roomId)) : t.username !== profile.username ? e.comments.push(d('"username" in the message does not match the expected value. Expected: ' + profile.username + " but got " + t.username)) : t.text !== i ? e.comments.push(d('"text" in the message does not match the expected value. Expected: ' + i + " but got " + t.text)) : (e.score += .5, l("The JSON string contains the correct values"))
                                    } catch (t) {
                                        e.comments.push(d('Error while parsing the serialized object passed to "send" - expecting JSON format.')), c(t)
                                    }
                                }
                                t()
                            }), c('Checking "chatView.sendMessage"'), r.sendMessage(), setTimeout(() => s(new Error('WebSocket "send" was not called inside "sendMessage"')), 200)
                        });
                        try {
                            await a
                        } catch (t) {
                            e.comments.push(d('Error while testing "send" invocation inside "sendMessage": ' + t.message)), c(t)
                        }
                    }
                }
                return e
            }
        }, {
            id: "5",
            description: "WebSocket Server",
            maxScore: 4,
            run: async () => {
                let e = {
                    id: 5,
                    score: 0,
                    comments: []
                };
                try {
                    c('Checking if "ws" NPM module was installed in the server');
                    let t = await o("checkRequire", "ws");
                    if (t.error) e.comments.push(d('"ws" module was not installed: ' + t.error));
                    else {
                        e.score += .5, l('"ws" was installed');
                        try {
                            c('Trying to access "broker" in server.js');
                            let t = await o("checkObjectType", "broker", "ws/Server");
                            t.error ? e.comments.push(d('Error while checking "broker" type: ' + t.error)) : t.value ? (e.score += .5, l('"broker" is a "ws.Server" instance')) : e.comments.push(d('"broker" is not a "ws.Server" instance')), c("Starting end-to-end WebSocket test with 3 test clients A, B, and C");
                            let s = await o("getObjectByString", "broker.clients"),
                                r = s.length,
                                n = new WebSocket(__tester.defaults.webSocketServer),
                                i = new WebSocket(__tester.defaults.webSocketServer),
                                a = new WebSocket(__tester.defaults.webSocketServer),
                                h = [],
                                g = [],
                                u = [];
                            if (n.addEventListener("message", e => h.push(JSON.parse(e.data))), i.addEventListener("message", e => g.push(JSON.parse(e.data))), a.addEventListener("message", e => u.push(JSON.parse(e.data))), await m(500), (s = await o("getObjectByString", "broker.clients")).length !== r + 3) e.comments.push(d("Could not find newly added WebSocket clients at the server."));
                            else {
                                let t = __tester.exports.get(main).lobby,
                                    s = Object.keys(t.rooms)[0],
                                    r = t.rooms[s].messages.splice(0, t.rooms[s].messages.length),
                                    p = await o("getObjectByString", 'messages["' + s + '"]'),
                                    b = {
                                        roomId: s,
                                        username: Math.random().toString(),
                                        text: Math.random().toString()
                                    };
                                c("Client A sending a message"), n.send(JSON.stringify(b)), await m(250), 0 === h.length && 1 === g.length && 1 === u.length ? g[0].roomId !== b.roomId || g[0].username !== b.username || g[0].text !== b.text ? e.comments.push(d("Test client B did not receive the message sent by test client A")) : u[0].roomId !== b.roomId || u[0].username !== b.username || u[0].text !== b.text ? e.comments.push(d("Test client C did not receive the message sent by test client A")) : g[0].roomId === b.roomId && g[0].username === b.username && g[0].text === b.text && u[0].roomId === b.roomId && u[0].username === b.username && u[0].text === b.text ? (e.score += .5, l("Test clients received messages as expected when sending with test client A")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client A")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client A. Expected message count A = 0, B = 1, C = 1, but have " + `A = ${h.length}, B = ${g.length}, C = ${u.length}`)), c('checking if the message sent by client A was added in the "messages" object');
                                let y = await o("getObjectByString", 'messages["' + s + '"]');
                                if (y.length !== p.length + 1) y.length - p.length > 1 ? e.comments.push(d('Too many messages were added in messages["' + s + '"] in server.js')) : e.comments.push(d('The test message was not added in messages["' + s + '"] in server.js'));
                                else {
                                    let t = y[y.length - 1];
                                    t.username !== b.username ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same username as the test message')) : t.text !== b.text ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same text as the test message')) : (e.score += .5, l('The message added in messages["' + s + '"] has the same text as the test message'))
                                }
                                b = {
                                    roomId: s,
                                    username: Math.random().toString(),
                                    text: Math.random().toString()
                                }, c("Client B sending a message"), i.send(JSON.stringify(b)), await m(250), 1 === h.length && 1 === g.length && 2 === u.length ? h[0].roomId !== b.roomId || h[0].username !== b.username || h[0].text !== b.text ? e.comments.push(d("Test client A did not receive the message sent by test client B")) : u[1].roomId !== b.roomId || u[1].username !== b.username || u[1].text !== b.text ? e.comments.push(d("Test client C did not receive the message sent by test client B")) : h[0].roomId === b.roomId && h[0].username === b.username && h[0].text === b.text && u[1].roomId === b.roomId && u[1].username === b.username && u[1].text === b.text ? (e.score += .5, l("Test clients received messages as expected when sending with test client B")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client B")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client A. Expected message count A = 1, B = 1, C = 2, but have " + `A = ${h.length}, B = ${g.length}, C = ${u.length}`)), c('checking if the message sent by client B was added in the "messages" object');
                                let v = await o("getObjectByString", 'messages["' + s + '"]');
                                if (v.length !== p.length + 2) v.length - p.length > 2 ? e.comments.push(d('Too many messages were added in messages["' + s + '"] in server.js')) : e.comments.push(d('The test message was not added in messages["' + s + '"] in server.js'));
                                else {
                                    let t = v[v.length - 1];
                                    t.username !== b.username ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same username as the test message')) : t.text !== b.text ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same text as the test message')) : (e.score += .5, l('The message added in messages["' + s + '"] has the same text as the test message'))
                                }
                                b = {
                                    roomId: s,
                                    username: Math.random().toString(),
                                    text: Math.random().toString()
                                }, c("Client C sending a message"), a.send(JSON.stringify(b)), await m(250), 2 === h.length && 2 === g.length && 2 === u.length ? h[1].roomId !== b.roomId || h[1].username !== b.username || h[1].text !== b.text ? e.comments.push(d("Test client A did not receive the message sent by test client C")) : g[1].roomId !== b.roomId || g[1].username !== b.username || g[1].text !== b.text ? e.comments.push(d("Test client C did not receive the message sent by test client A")) : h[1].roomId === b.roomId && h[1].username === b.username && h[1].text === b.text && g[1].roomId === b.roomId && g[1].username === b.username && g[1].text === b.text ? (e.score += .5, l("Test clients received messages as expected when sending with test client C")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client C")) : e.comments.push(d("Test clients did not receive messages as expected when sending with test client A. Expected message count A = 2, B = 2, C = 2, but have " + `A = ${h.length}, B = ${g.length}, C = ${u.length}`)), c('checking if the message sent by client C was added in the "messages" object');
                                let w = await o("getObjectByString", 'messages["' + s + '"]');
                                if (w.length !== p.length + 3) w.length - p.length > 3 ? e.comments.push(d('Too many messages were added in messages["' + s + '"] in server.js')) : e.comments.push(d('The test message was not added in messages["' + s + '"] in server.js'));
                                else {
                                    let t = w[w.length - 1];
                                    t.username !== b.username ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same username as the test message')) : t.text !== b.text ? e.comments.push(d('The message added in messages["' + s + '"] does not have the same text as the test message')) : (e.score += .5, l('The message added in messages["' + s + '"] has the same text as the test message'))
                                }
                                await o("setObjectByString", "messages." + s, p), t.rooms[s].messages.splice(0, t.rooms[s].messages.length, ...r)
                            }
                            n.close(), i.close(), a.close()
                        } catch (t) {
                            e.comments.push(d('Error while checking "broker" object on the server: ' + t.message)), c(t)
                        }
                    }
                } catch (t) {
                    e.comments.push(d('Error while testing require("ws"). ' + t.message)), c(t)
                }
                return e
            }
        }],
        n = String.fromCodePoint(128030),
        i = String.fromCodePoint(128077),
        a = (e, t) => {
            let s = document.createElement(e);
            return t && t.appendChild(s), s
        },
        m = e => new Promise((t, s) => setTimeout(t, e)),
        c = (e, ...t) => (h.options.showLogs && console.log("[34m[Tester][0m", e, ...t), e),
        d = (e, ...t) => (h.options.showLogs && console.log("[34m[Tester][0m %c Bug " + n + " ", "background-color: red; color: white; padding: 1px;", e, ...t), e),
        l = (e, ...t) => (h.options.showLogs && console.log("[34m[Tester][0m %c OK " + i + " ", "background-color: green; color: white; padding: 1px;", e, ...t), e);
    let h = window.localStorage.getItem("store_a3");
    h = h ? JSON.parse(h) : {
        options: {
            showLogs: !0
        },
        selection: {},
        results: {},
        lastTestAt: null
    };
    let g = {},
        u = a("div");
    u.style.position = "fixed", u.style.top = "0px", u.style.right = "0px";
    let p = a("button");
    p.textContent = "Test", p.style.backgroundColor = "red", p.style.color = "white", p.style.padding = "0.5em";
    let b = a("div");
    b.style.padding = "0.5em", b.style.position = "fixed", b.style.right = "0px", b.style.display = "flex", b.style.flexDirection = "column", b.style.backgroundColor = "white", b.style.visibility = "hidden";
    let y = a("div", b),
        v = a("label", y),
        w = a("input", v);
    w.type = "checkbox", w.checked = !("showLogs" in h.options) || h.options.showLogs, w.addEventListener("change", e => {
        h.options.showLogs = e.target.checked, window.localStorage.setItem("store_a3", JSON.stringify(h))
    }), v.appendChild(document.createTextNode(" Show logs during test"));
    let S = a("table", b);
    S.style.borderCollapse = "collapse";
    let f = a("thead", S);
    f.style.backgroundColor = "dimgray", f.style.color = "white";
    let x = a("tr", f),
        k = a("th", x);
    k.textContent = "Task", k.style.padding = "0.25em";
    let j = a("th", x);
    j.textContent = "Description", j.style.padding = "0.25em";
    let T = a("th", x);
    T.textContent = "Run", T.style.padding = "0.25em";
    let E = a("input", T);
    E.type = "checkbox", E.checked = !!(h.selection && Object.keys(h.selection).length > 0) && Object.values(h.selection).reduce((e, t) => e && t, !0), E.addEventListener("change", e => {
        r.forEach(t => {
            g[t.id].checkBox.checked = e.target.checked, h.selection[t.id] = e.target.checked
        }), window.localStorage.setItem("store_a3", JSON.stringify(h))
    });
    let R = a("th", x);
    R.textContent = "Result", R.style.padding = "0.25em";
    let A = a("tbody", S),
        C = a("tfoot", S),
        M = a("tr", C);
    M.style.borderTop = "1px solid dimgray";
    let _ = a("th", M);
    _.textContent = "Total", _.colSpan = 3;
    let L = a("th", M);
    L.textContent = "-";
    let P = () => {
            let e = 0,
                t = 0,
                s = [];
            return r.forEach(o => {
                let r = h.results[o.id];
                e += r.score, t += o.maxScore, r.comments.length > 0 && s.push("Task " + o.id + ":\n" + r.comments.map(e => "  - " + e).join("\n"))
            }), L.textContent = e + "/" + t, {
                sum: e,
                max: t,
                comments: s.join("\n")
            }
        },
        O = a("button", b);
    O.id = "test-button", O.textContent = "Run Tests";
    let I = a("div", b);
    I.style.fontSize = "0.8em", I.style.textAlign = "right", h.lastTestAt && (P(), I.textContent = "Last Run at: " + new Date(h.lastTestAt).toLocaleString()), r.forEach((e, t) => {
        let s = a("tr", A);
        s.style.backgroundColor = t % 2 == 0 ? "white" : "#eee";
        let o = a("td", s);
        o.textContent = e.id, o.style.textAlign = "center", a("td", s).textContent = e.description;
        let r = a("td", s);
        r.style.textAlign = "center";
        let n = a("input", r);
        n.type = "checkbox", n.checked = e.id in h.selection && h.selection[e.id], n.addEventListener("change", t => {
            h.selection[e.id] = t.target.checked, window.localStorage.setItem("store_a3", JSON.stringify(h))
        });
        let i = a("td", s);
        i.style.textAlign = "center", i.textContent = e.id in h.results ? h.results[e.id].skipped ? "-" : h.results[e.id].score + "/" + e.maxScore : "-", g[e.id] = {
            checkBox: n,
            resultCell: i
        }
    }), u.appendChild(p), u.appendChild(b), O.addEventListener("click", async e => {
        O.disabled = !0, await
        function(e, t, s = 0) {
            let o = this,
                r = t || this,
                n = e.bind(r),
                i = async e => e === o.length ? null : (s > 0 && e > 0 && await m(s), await n(o[e], e, o), await i(e + 1));
            return i(0)
        }.call(r, async e => {
            let t = g[e.id].checkBox,
                s = g[e.id].resultCell;
            if (t.checked) {
                let t;
                O.textContent = "Running Test " + e.id;
                try {
                    c("--- Starting Test " + e.id + " ---"), t = await e.run(), c("--- Test " + e.id + " Finished --- Score = " + Math.round(100 * t.score) / 100 + " / " + e.maxScore), t && t.comments.length > 0 && c("Task " + e.id + ":\n" + t.comments.map(e => "  - " + e).join("\n")), h.results[e.id] = {
                        skipped: !1,
                        score: t ? Math.round(100 * t.score) / 100 : 0,
                        comments: t ? t.comments : []
                    }
                } catch (t) {
                    h.results[e.id] = {
                        skipped: !1,
                        score: 0,
                        comments: ["Error while running tests: " + t.message]
                    }, console.log(t)
                }
                h.options.showLogs && console.log("")
            } else h.results[e.id] = {
                skipped: !0,
                score: 0,
                comments: []
            };
            s.textContent = h.results[e.id].skipped ? "Skipped" : Math.round(100 * h.results[e.id].score) / 100 + "/" + e.maxScore
        });
        let t = P();
        console.log("[34m[Tester][0m", "Total = " + t.sum + " / " + t.max), console.log(t.comments), h.lastTestAt = Date.now(), window.localStorage.setItem("store_a3", JSON.stringify(h)), I.textContent = "Last Run at: " + new Date(h.lastTestAt).toLocaleString(), O.textContent = "Run Tests", O.disabled = !1
    }), p.addEventListener("click", e => "hidden" == b.style.visibility ? b.style.visibility = "visible" : b.style.visibility = "hidden"), document.body.appendChild(u)
});
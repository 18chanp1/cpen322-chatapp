const __tester = {
    listeners: [],
    exports: new Map,
    defaults: {
        image: "assets/everyone-icon.png",
        testRoomId: "room-1"
    },
    oldAddEventListener: HTMLElement.prototype.addEventListener,
    newAddEventListener: function(type, listener, ...options) {
        __tester.listeners.push({
            node: this,
            type: type,
            listener: listener,
            invoke: evt => listener.call(this, evt)
        });
        return __tester.oldAddEventListener.call(this, type, listener, ...options)
    },
    export: (scope, dict) => {
        if (!__tester.exports.has(scope)) __tester.exports.set(scope, {});
        Object.assign(__tester.exports.get(scope), dict)
    },
    setDefault: (key, val) => {
        __tester.defaults[key] = val
    }
};
HTMLElement.prototype.addEventListener = __tester.newAddEventListener;
Window.prototype.addEventListener = __tester.newAddEventListener;
window["cpen322"] = {
    export: __tester.export,
    setDefault: __tester.setDefault
};
window.addEventListener("load", () => {
    const a = "a2";
    const pageChecks = {
        "#/": (pageView, result, score = 1) => {
            let pageContent = pageView.querySelector("div.content");
            if (!pageContent) {
                return result.comments.push(printError("Could not observe Lobby Page: could not find div.content"))
            } else {
                let roomList = pageContent.querySelector("ul.room-list");
                if (!roomList) {
                    return result.comments.push(printError("Could not observe Lobby Page: could not find ul.room-list"))
                } else {
                    let chatLinks = roomList.querySelectorAll("li a");
                    if (!chatLinks.length === 0) {
                        return result.comments.push(printError("Could not observe Lobby Page: could not find link to /#/chat/${roomId}"))
                    } else {
                        let chatLink = Array.from(chatLinks).find(node => node.attributes.href.nodeValue.indexOf("#/chat") === 0 || node.attributes.href.nodeValue.indexOf("/#/chat") === 0);
                        if (!chatLink) {
                            return result.comments.push(printError("Could not observe Lobby Page: could not find link to /#/chat/${roomId}"))
                        }
                    }
                }
                let pageControl = pageContent.querySelector("div.page-control");
                if (!pageControl) {
                    return result.comments.push(printError("Could not observe Lobby Page: could not find div.page-control"))
                } else {
                    let roomInput = pageControl.querySelector("input[type=text]");
                    if (!roomInput) {
                        return result.comments.push(printError("Could not observe Lobby Page: could not find text input in div.page-control"))
                    }
                    let roomBtn = pageControl.querySelector("button");
                    if (!roomBtn) {
                        return result.comments.push(printError("Could not observe Lobby Page: could not find button in div.page-control"))
                    }
                }
            }
            result.score += score;
            printOK('Lobby Page was loaded when the hash was "#/"');
            return
        },
        "#/chat": (pageView, result, score = 1) => {
            let pageContent = pageView.querySelector("div.content");
            if (!pageContent) {
                return result.comments.push(printError("Could not observe Chat Page: could not find div.content"))
            } else {
                let roomName = pageContent.querySelector("h4.room-name");
                if (!roomName) {
                    result.comments.push(printError("Could not observe Chat Page: Could not find h4.room-name"))
                }
                let messageList = pageContent.querySelector("div.message-list");
                if (!messageList) {
                    return result.comments.push(printError("Could not observe Chat Page: could not find div.message-list"))
                } else {
                    if (!(typeof Room !== "undefined" && typeof Lobby !== "undefined" && typeof LobbyView !== "undefined" && LobbyView.prototype.redrawList && typeof ChatView !== "undefined" && ChatView.prototype.setRoom)) {
                        let otherMessage = messageList.querySelector(".message:not(.my-message)");
                        if (!otherMessage) {
                            return result.comments.push(printError("Could not observe Chat Page: could not find at least 1 div.message that is not div.my-message"))
                        } else {
                            let otherUsername = otherMessage.querySelector("span.message-user");
                            if (!otherUsername) {
                                return result.comments.push(printError("Could not observe Chat Page: could not find span.message-user inside div.message"))
                            }
                            let otherText = otherMessage.querySelector("span.message-text");
                            if (!otherText) {
                                return result.comments.push(printError("Could not observe Chat Page: could not find span.message-text inside div.message"))
                            }
                        }
                        let myMessage = messageList.querySelector(".my-message");
                        if (!myMessage) {
                            return result.comments.push(printError("Could not observe Chat Page: could not find at least 1 div.my-message"))
                        } else {
                            let myUsername = myMessage.querySelector("span.message-user");
                            if (!myUsername) {
                                return result.comments.push(printError("Could not observe Chat Page: could not find span.message-user inside div.my-message"))
                            }
                            let myText = myMessage.querySelector("span.message-text");
                            if (!myText) {
                                return result.comments.push(printError("Could not observe Chat Page: could not find span.message-text inside div.my-message"))
                            }
                        }
                    }
                }
                let pageControl = pageContent.querySelector("div.page-control");
                if (!pageControl) {
                    return result.comments.push(printError("Could not observe Chat Page: could not find div.page-control"))
                } else {
                    let chatInput = pageControl.querySelector("textarea");
                    if (!chatInput) {
                        return result.comments.push(printError("Could not observe Chat Page: could not find textarea in div.page-control"))
                    }
                    let sendBtn = pageControl.querySelector("button");
                    if (!sendBtn) {
                        return result.comments.push(printError("Could not observe Chat Page: could not find button in div.page-control"))
                    }
                }
            }
            result.score += score;
            printOK('Chat Page was loaded when the hash was "#/chat"');
            return
        },
        "#/profile": (pageView, result, score = 1) => {
            let pageContent = pageView.querySelector("div.content");
            if (!pageContent) {
                return result.comments.push(printError("Could not observe Profile Page: could not find div.content"))
            } else {
                let form = pageContent.querySelector("div.profile-form");
                if (!form) {
                    return result.comments.push(printError("Could not observe Profile Page: could not find div.profile-form"))
                } else {
                    let fields = pageContent.querySelectorAll("div.form-field");
                    if (fields.length < 1) {
                        return result.comments.push(printError("Could not observe Profile Page: could not find at least 1 div.form-field inside div.profile-form"))
                    } else {
                        let fieldLabel = fields[0].querySelector("label");
                        if (!fieldLabel) {
                            return result.comments.push(printError("Could not observe Profile Page: could not find label inside div.form-field"))
                        }
                        let fieldInput = fields[0].querySelector("input");
                        if (!fieldInput) {
                            return result.comments.push(printError("Could not observe Profile Page: could not find input inside div.form-field"))
                        }
                    }
                }
                let pageControl = pageContent.querySelector("div.page-control");
                if (!pageControl) {
                    return result.comments.push(printError("Could not observe Profile Page: could not find div.page-control"))
                } else {
                    let saveBtn = pageControl.querySelector("button");
                    if (!saveBtn) {
                        return result.comments.push(printError("Could not observe Profile Page: could not find button in div.page-control"))
                    }
                }
            }
            result.score += score;
            printOK('Profile Page was loaded when the hash was "#/profile"');
            return
        }
    };
    const makeTestRoom = () => ({
        id: Math.random().toString(),
        name: Math.random().toString(),
        image: __tester.defaults.image,
        messages: [{
            username: Math.random().toString(),
            text: Math.random().toString()
        }, {
            username: Math.random().toString(),
            text: Math.random().toString()
        }]
    });
    const tests = [{
        id: "1",
        description: "Main function",
        maxScore: 1,
        run: async () => {
            let result = {
                id: 1,
                score: 0,
                comments: []
            };
            let scriptTag = document.querySelector('script[src="app.js"],script[src="/app.js"],script[src="./app.js"]');
            if (!scriptTag) {
                scriptTag = document.querySelector('script[src="http://localhost:3000/app.js"],script[src="https://localhost:3000/app.js"],script[src="//localhost:3000/app.js"]');
                if (scriptTag) {
                    result.comments.push(printError("app.js is included using absolute URL"))
                } else {
                    result.comments.push(printError("app.js script not found"))
                }
            } else {
                if (!main) {
                    result.comments.push(printError('Could not find "main"'))
                } else {
                    result.score += .5;
                    printOK('Found "main" function');
                    let found = __tester.listeners.find(elem => elem.node === window && elem.type === "load" && elem.listener === main);
                    if (!found) {
                        result.comments.push(printError('"main" not added as a listener on window "load" event'))
                    } else {
                        result.score += .5;
                        printOK('"main" was added as a listener on window "load" event')
                    }
                }
            }
            return result
        }
    }, {
        id: "2",
        description: "Client-side Routing",
        maxScore: 4,
        run: async () => {
            let result = {
                id: 2,
                score: 0,
                comments: []
            };
            if (!main) {
                result.comments.push(printError('Could not find "main"'))
            } else {
                let mainScope = __tester.exports.get(main);
                if (!mainScope) {
                    result.comments.push(printError('Unable to test: local variables inside "main" were not exported'))
                } else {
                    if (!mainScope["renderRoute"]) {
                        result.comments.push(printError('local variable "renderRoute" inside "main" was not found/exported'))
                    } else {
                        let renderRoute = mainScope["renderRoute"];
                        if (!(renderRoute instanceof Function)) {
                            result.comments.push(printError('"renderRoute" should be a function'))
                        } else {
                            result.score += .5;
                            printOK('Found "renderRoute" inside "main"');
                            let found = __tester.listeners.find(elem => elem.node === window && elem.type === "popstate" && elem.listener === renderRoute);
                            if (!found) {
                                result.comments.push(printError('"renderRoute" not added as a listener on window "popstate" event'))
                            } else {
                                result.score += .5;
                                printOK('"renderRoute" was added as a listener on window "popstate" event')
                            }
                        }
                    }
                }
            }
            let pages = ["#/", "#/chat/" + __tester.defaults.testRoomId, "#/profile"];
            let pageView = document.querySelector("div#page-view");
            if (!pageView) {
                result.comments.push(printError("Could not find div#page-view"));
                return result
            }
            let originalHash = window.location.hash;
            let originalPage = pageView.innerHTML;
            let prevPage = originalPage;
            let pageIndex = pages.indexOf(originalHash);
            if (pageIndex < 0) pageIndex = 2;
            else pageIndex = (pageIndex + 1) % 3;
            for (let i = 0; i < 3; i++) {
                console.log(window.location.hash);
                window.location.hash = pages[pageIndex];
                console.log(window.location.hash);
                await delay(10);
                if (pageView.innerHTML === prevPage) {
                    result.comments.push(printError("Could not observe content change when routing to " + pages[pageIndex]))
                } else {
                    pageChecks[pages[pageIndex].split("/").slice(0, 2).join("/")](pageView, result)
                }
                prevPage = pageView.innerHTML;
                pageIndex = (pageIndex + 1) % 3
            }
            window.location.hash = originalHash;
            return result
        }
    }, {
        id: "3",
        description: "View Model",
        maxScore: 4,
        run: async () => {
            let result = {
                id: 3,
                score: 0,
                comments: []
            };
            if (!LobbyView) {
                result.comments.push(printError("Could not find LobbyView"))
            } else {
                if (!(LobbyView instanceof Function)) {
                    result.comments.push(printError("LobbyView should be a class or a function"))
                } else {
                    let testRoom = makeTestRoom();
                    let view = new LobbyView({
                        rooms: [testRoom]
                    });
                    if (!(view.elem instanceof HTMLElement)) {
                        result.comments.push(printError('"elem" property of a LobbyView instance should be an HTMLElement'))
                    } else {
                        let dummy = document.createElement("template");
                        dummy.appendChild(view.elem);
                        pageChecks["#/"](dummy, result, 1 / 3)
                    }
                }
            }
            if (!ChatView) {
                result.comments.push(printError("Could not find ChatView"))
            } else {
                if (!(ChatView instanceof Function)) {
                    result.comments.push(printError("ChatView should be a class or a function"))
                } else {
                    let view = new ChatView;
                    if (!(view.elem instanceof HTMLElement)) {
                        result.comments.push(printError('"elem" property of a ChatView instance should be an HTMLElement'))
                    } else {
                        let dummy = document.createElement("template");
                        dummy.appendChild(view.elem);
                        pageChecks["#/chat"](dummy, result, 1 / 3)
                    }
                }
            }
            if (!ProfileView) {
                result.comments.push(printError("Could not find ProfileView"))
            } else {
                if (!(ProfileView instanceof Function)) {
                    result.comments.push(printError("ProfileView should be a class or a function"))
                } else {
                    let view = new ProfileView;
                    if (!(view.elem instanceof HTMLElement)) {
                        result.comments.push(printError('"elem" property of a ProfileView instance should be an HTMLElement'))
                    } else {
                        let dummy = document.createElement("template");
                        dummy.appendChild(view.elem);
                        pageChecks["#/profile"](dummy, result, 1 / 3)
                    }
                }
            }
            let viewClasses = {
                lobbyView: LobbyView,
                chatView: ChatView,
                profileView: ProfileView
            };
            let viewModels = {};
            let mainScope = __tester.exports.get(main);
            if (!mainScope) {
                result.comments.push(printError('Unable to test: local variables inside "main" were not exported'))
            } else {
                Object.keys(viewClasses).forEach(name => {
                    if (!mainScope[name]) {
                        result.comments.push(printError('local variable "' + name + '" inside "main" was not found/exported'))
                    } else {
                        viewModels[name] = mainScope[name];
                        if (!(mainScope[name] instanceof viewClasses[name])) {
                            result.comments.push(printError('"' + name + '" should be an instance of ' + viewClasses[name].name))
                        } else {
                            result.score += .5;
                            printOK(`"${name}" is an instance of "${viewClasses[name].name}"`)
                        }
                    }
                })
            }
            let pages = [
                ["#/", "lobbyView"],
                ["#/chat/" + __tester.defaults.testRoomId, "chatView"],
                ["#/profile", "profileView"]
            ];
            let pageView = document.querySelector("div#page-view");
            if (!pageView) {
                result.comments.push(printError("Could not find div#page-view"));
                return result
            }
            let originalHash = window.location.hash;
            let originalPage = pageView.firstChild;
            let prevPage = originalPage;
            let pageIndex = pages.findIndex(item => item[0] === originalHash);
            if (pageIndex < 0) pageIndex = 2;
            else pageIndex = (pageIndex + 1) % 3;
            for (let i = 0; i < 3; i++) {
                window.location.hash = pages[pageIndex][0];
                await delay(10);
                if (pageView.firstChild === prevPage) {
                    result.comments.push(printError("Could not observe content change when routing to " + pages[pageIndex][0]))
                } else {
                    if (!viewModels[pages[pageIndex][1]]) {
                        result.comments.push(printError('local variable "' + pages[pageIndex][1] + '" inside "main" was not found/exported'))
                    } else {
                        if (pageView.firstChild === viewModels[pages[pageIndex][1]].elem) {
                            result.score += .5;
                            printOK("Element rendered in " + pages[pageIndex][0] + " is the same as " + pages[pageIndex][1] + ".elem")
                        } else {
                            result.comments.push(printError("Element rendered in " + pages[pageIndex][0] + " is not the same as " + pages[pageIndex][1] + ".elem"))
                        }
                    }
                }
                prevPage = pageView.firstChild;
                pageIndex = (pageIndex + 1) % 3
            }
            window.location.hash = originalHash;
            return result
        }
    }, {
        id: "4",
        description: "Element binding",
        maxScore: 2,
        run: async () => {
            let result = {
                id: 4,
                score: 0,
                comments: []
            };
            if (!ChatView) {
                result.comments.push(printError("Could not find ChatView"))
            } else {
                if (!(ChatView instanceof Function)) {
                    result.comments.push(printError("ChatView should be a class or a function"))
                } else {
                    let view = new ChatView;
                    if (!(view.elem instanceof HTMLElement)) {
                        result.comments.push(printError('"elem" property of a ChatView instance should be an HTMLElement'))
                    } else {
                        if (!view.titleElem) {
                            result.comments.push(printError('Could not find "titleElem" property on a ChatView instance'))
                        } else {
                            if (view.elem.querySelector("h4.room-name") !== view.titleElem) {
                                result.comments.push(printError('"titleElem" property of a ChatView instance should be a reference to h4.room-name'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"titleElem" property of a ChatView instance is a reference to h4.room-name')
                            }
                        }
                        if (!view.chatElem) {
                            result.comments.push(printError('Could not find "chatElem" property on a ChatView instance'))
                        } else {
                            if (view.elem.querySelector("div.message-list") !== view.chatElem) {
                                result.comments.push(printError('"chatElem" property of a ChatView instance should be a reference to div.message-list'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"chatElem" property of a ChatView instance is a reference to div.message-list')
                            }
                        }
                        if (!view.inputElem) {
                            result.comments.push(printError('Could not find "inputElem" property on a ChatView instance'))
                        } else {
                            if (view.elem.querySelector(".page-control textarea") !== view.inputElem) {
                                result.comments.push(printError('"inputElem" property of a ChatView instance should be a reference to the textarea inside div.page-control'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"inputElem" property of a ChatView instance is a reference to the textarea inside div.page-control')
                            }
                        }
                        if (!view.buttonElem) {
                            result.comments.push(printError('Could not find "buttonElem" property on a ChatView instance'))
                        } else {
                            if (view.elem.querySelector(".page-control button") !== view.buttonElem) {
                                result.comments.push(printError('"buttonElem" property of a ChatView instance should be a reference to the button inside div.page-control'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"buttonElem" property of a ChatView instance is a reference to the button inside div.page-control')
                            }
                        }
                    }
                }
            }
            if (!LobbyView) {
                result.comments.push(printError("Could not find LobbyView"))
            } else {
                if (!(LobbyView instanceof Function)) {
                    result.comments.push(printError("LobbyView should be a class or a function"))
                } else {
                    let testRoom = makeTestRoom();
                    let view = new LobbyView({
                        rooms: {
                            [testRoom.id]: testRoom
                        }
                    });
                    if (!(view.elem instanceof HTMLElement)) {
                        result.comments.push(printError('"elem" property of a LobbyView instance should be an HTMLElement'))
                    } else {
                        if (!view.listElem) {
                            result.comments.push(printError('Could not find "listElem" property on a LobbyView instance'))
                        } else {
                            if (view.elem.querySelector("ul.room-list") !== view.listElem) {
                                result.comments.push(printError('"listElem" property of a LobbyView instance should be a reference to ul.room-list'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"listElem" property of a LobbyView instance is a reference to ul.room-list')
                            }
                        }
                        if (!view.inputElem) {
                            result.comments.push(printError('Could not find "inputElem" property on a LobbyView instance'))
                        } else {
                            if (view.elem.querySelector(".page-control input[type=text]") !== view.inputElem) {
                                result.comments.push(printError('"inputElem" property of a LobbyView instance should be a reference to the input[type=text] inside div.page-control'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"inputElem" property of a LobbyView instance is a reference to the input[type=text] inside div.page-control')
                            }
                        }
                        if (!view.buttonElem) {
                            result.comments.push(printError('Could not find "buttonElem" property on a LobbyView instance'))
                        } else {
                            if (view.elem.querySelector(".page-control button") !== view.buttonElem) {
                                result.comments.push(printError('"buttonElem" property of a LobbyView instance should be a reference to the button inside div.page-control'))
                            } else {
                                result.score += 2 / 7;
                                printOK('"buttonElem" property of a LobbyView instance is a reference to the button inside div.page-control')
                            }
                        }
                    }
                }
            }
            return result
        }
    }, {
        id: "5",
        description: "Object-Oriented Programming",
        maxScore: 7,
        run: async () => {
            let result = {
                id: 5,
                score: 0,
                comments: []
            };
            if (typeof Room === "undefined") {
                result.comments.push(printError("Could not find Room"))
            } else {
                if (!(Room instanceof Function)) {
                    result.comments.push(printError("Room should be a class or a function"))
                } else {
                    result.score += .5;
                    printOK("Room is a function");
                    let data = {
                        id: Math.random(),
                        name: Math.random(),
                        image: Math.random(),
                        messages: [{
                            username: Math.random().toString(),
                            text: Math.random().toString()
                        }, {
                            username: Math.random().toString(),
                            text: Math.random().toString()
                        }]
                    };
                    let room = new Room(data.id, data.name, data.image, data.messages);
                    Object.keys(data).forEach(key => {
                        if (room[key] !== data[key]) {
                            result.comments.push(printError('Room constructor does not assign the given "' + key + '" argument to the "' + key + '" property of the Room instance'))
                        } else {
                            result.score += .25;
                            printOK('Room constructor assigns the given "' + key + '" argument to the "' + key + '" property of the Room instance')
                        }
                    });
                    let room2 = new Room(data.id, data.name);
                    if (room2.image !== __tester.defaults.image) {
                        result.comments.push(printError('Room constructor does not assign a default image url to the "image" property of the Room instance'))
                    } else {
                        result.score += .25;
                        printOK('Room constructor assigns a default image url to the "image" property of the Room instance')
                    }
                    if (!(room2.messages instanceof Array && room2.messages.length === 0)) {
                        result.comments.push(printError('Room constructor does not assign a default empty array to the "messages" property of the Room instance'))
                    } else {
                        result.score += .25;
                        printOK('Room constructor assigns a default empty array to the "messages" property of the Room instance')
                    }
                    if (!Room.prototype.addMessage) {
                        result.comments.push(printError('Could not find a "addMessage" method (prototype function) in Room'))
                    } else {
                        if (!(Room.prototype.addMessage instanceof Function)) {
                            result.comments.push(printError('"addMessage" should be a function'))
                        } else {
                            result.score += .5;
                            printOK('"addMessage" is a function');
                            let testMessages = [];
                            for (let i = 0; i < 5; i++) {
                                testMessages.push({
                                    username: Math.random().toString(),
                                    text: Math.random().toString()
                                })
                            }
                            let room = new Room(data.id, data.name);
                            room.messages = [];
                            try {
                                room.addMessage(testMessages[0].username, testMessages[0].text);
                                if (room.messages.length === 0) {
                                    result.comments.push(printError("No message was added to the Room instance after calling addMessage"))
                                } else {
                                    for (let i = 1; i < testMessages.length; i++) {
                                        room.addMessage(testMessages[i].username, testMessages[i].text)
                                    }
                                    if (room.messages.length !== testMessages.length) {
                                        result.comments.push(printError("called addMessage " + testMessages.length + " times but the Room instance contains only " + room.messages.length + " messages"))
                                    } else {
                                        let ordered = testMessages.reduce((acc, item, index) => acc && item.username === room.messages[index].username && item.text === room.messages[index].text, true);
                                        if (!ordered) {
                                            result.comments.push(printError("addMessage is either adding messages out of order, adding the wrong values, or creating message objects incorrectly"))
                                        } else {
                                            result.score += 1;
                                            printOK("addMessage behaving as expected")
                                        }
                                    }
                                }
                                room.messages = [];
                                room.addMessage(testMessages[0].username, "");
                                if (room.messages.length !== 0) {
                                    result.comments.push(printError("addMessage should not add any message if given an empty text"))
                                } else {
                                    result.score += .25;
                                    printOK("addMessage does not add any message if given an empty text")
                                }
                                room.messages = [];
                                room.addMessage(testMessages[0].username, "    \t  \n  \t");
                                if (room.messages.length !== 0) {
                                    result.comments.push(printError("addMessage should not add any message if given a sequence of whitespaces"))
                                } else {
                                    result.score += .25;
                                    printOK("addMessage does not add any message if given a sequence of whitespaces")
                                }
                            } catch (err) {
                                result.comments.push(printError("Unexpected error when calling addMessage: " + err.message))
                            }
                        }
                    }
                    if (typeof Lobby === "undefined") {
                        result.comments.push(printError("Could not find Lobby"))
                    } else {
                        if (!(Lobby instanceof Function)) {
                            result.comments.push(printError("Lobby should be a class or a function"))
                        } else {
                            result.score += .5;
                            printOK("Lobby is a function");
                            let lobby = new Lobby;
                            let rooms;
                            if (!(lobby.rooms && Object.keys(lobby.rooms).length > 0)) {
                                result.comments.push(printError('Lobby constructor does not initialize a "rooms" property storing an Associative Array'))
                            } else {
                                rooms = Object.entries(lobby.rooms);
                                let hasRooms = rooms.reduce((acc, item) => acc && item[1] instanceof Room, true);
                                if (!hasRooms) {
                                    result.comments.push(printError('"rooms" property of a Lobby instance should contain an Associative Array of Room instances'))
                                } else {
                                    result.score += .5;
                                    printOK('"rooms" property of a Lobby instance contains an Associative Array of Room instances')
                                }
                            }
                            if (!Lobby.prototype.getRoom) {
                                result.comments.push(printError('Could not find a "getRoom" method (prototype function) in Lobby'))
                            } else {
                                if (!(Lobby.prototype.getRoom instanceof Function)) {
                                    result.comments.push(printError('"getRoom" should be a function'))
                                } else {
                                    result.score += .5;
                                    printOK('"getRoom" is a function');
                                    try {
                                        let found = lobby.getRoom(rooms[0][0]);
                                        if (!(found && found instanceof Room)) {
                                            result.comments.push(printError('"getRoom" should return a Room'))
                                        } else {
                                            if (found.id !== rooms[0][1].id) {
                                                result.comments.push(printError('"getRoom" not returning the correct Room instance'))
                                            } else {
                                                result.score += .5;
                                                printOK('"getRoom" returns the correct Room instance')
                                            }
                                        }
                                    } catch (err) {
                                        result.comments.push(printError("Unexpected error when calling getRoom: " + err.message))
                                    }
                                }
                                if (!(Lobby.prototype.addRoom instanceof Function)) {
                                    result.comments.push(printError('"addRoom" should be a function'))
                                } else {
                                    result.score += .5;
                                    printOK('"addRoom" is a function');
                                    try {
                                        let testRoom = makeTestRoom();
                                        lobby.addRoom(testRoom.id, testRoom.name, testRoom.image, testRoom.messages);
                                        let found = lobby.rooms[testRoom.id];
                                        if (!(found && found instanceof Room)) {
                                            result.comments.push(printError('"addRoom" not adding a Room object to the "rooms" Associative Array'))
                                        } else {
                                            result.score += .5;
                                            printOK('"addRoom" adds a Room object to the "rooms" Associative Array')
                                        }
                                    } catch (err) {
                                        result.comments.push(printError("Unexpected error when calling addRoom: " + err.message))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result
        }
    }, {
        id: "6",
        description: "Dynamic HTML with MVC (Control-Model)",
        maxScore: 5,
        run: async () => {
            let result = {
                id: 6,
                score: 0,
                comments: []
            };
            let mainScope = __tester.exports.get(main);
            if (!mainScope) {
                result.comments.push(printError('Unable to test: local variables inside "main" were not exported'))
            } else {
                if (!mainScope["lobby"]) {
                    result.comments.push(printError('local variable "lobby" inside "main" was not found/exported'))
                } else {
                    let lobby = mainScope["lobby"];
                    let lobbyOnNewRoom = lobby.onNewRoom;
                    if (!(lobby instanceof Lobby)) {
                        result.comments.push(printError('"lobby" should be a Lobby instance'))
                    } else {
                        result.score += .25;
                        printOK('"lobby" is a Lobby instance')
                    }
                    let fakeView = new LobbyView(lobby);
                    if (fakeView.lobby !== lobby) {
                        result.comments.push(printError('LobbyView constructor does not assign the given "lobby" argument to the "lobby" property of the Lobby instance'))
                    } else {
                        result.score += .25;
                        printOK('LobbyView constructor assigns the given "lobby" argument to the "lobby" property of the Lobby instance')
                    }
                    let lobbyView = mainScope["lobbyView"];
                    if (!(lobbyView instanceof LobbyView)) {
                        result.comments.push(printError('"lobbyView" should be a LobbyView instance'))
                    } else {
                        if (lobbyView.lobby !== lobby) {
                            result.comments.push(printError('"lobby" should be passed as argument during "lobbyView" instantiation'))
                        } else {
                            result.score += .25;
                            printOK('"lobby" is passed as argument during "lobbyView" instantiation')
                        }
                    }
                    lobby.onNewRoom = lobbyOnNewRoom;
                    if (!LobbyView.prototype.redrawList) {
                        result.comments.push(printError('Could not find a "redrawList" method (prototype function) in LobbyView'))
                    } else {
                        if (!(LobbyView.prototype.redrawList instanceof Function)) {
                            result.comments.push(printError('"redrawList" should be a function'))
                        } else {
                            result.score += .5;
                            printOK('"redrawList" is a function');
                            let testLobby = new Lobby;
                            fakeView.lobby = testLobby;
                            testLobby.rooms = {};
                            for (let i = 0; i < 5; i++) {
                                let room = makeTestRoom();
                                testLobby.rooms[room.id] = room
                            }
                            fakeView.redrawList();
                            let listItems = fakeView.listElem.querySelectorAll("li");
                            if (listItems.length !== Object.keys(testLobby.rooms).length) {
                                result.comments.push(printError('"redrawList" not rendering the right number of list items'))
                            } else {
                                result.score += .25;
                                printOK('"redrawList" renders the right number of list items');
                                let hasLinks = Object.values(testLobby.rooms).reduce((acc, item) => acc && !!fakeView.listElem.querySelector('a[href="#/chat/' + item.id + '"],a[href="/#/chat/' + item.id + '"]'), true);
                                if (!hasLinks) {
                                    result.comments.push(printError('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms'))
                                } else {
                                    result.score += .5;
                                    printOK('list items rendered by "redrawList" contains hyperlinks to each of the rooms');
                                    fakeView.redrawList();
                                    let listItems = fakeView.listElem.querySelectorAll("li");
                                    if (listItems.length !== Object.keys(testLobby.rooms).length) {
                                        result.comments.push(printError('"redrawList" not rendering the right number of list items'))
                                    } else {
                                        result.score += .25;
                                        printOK('"redrawList" renders the right number of list items');
                                        let hasLinks = Object.values(testLobby.rooms).reduce((acc, item) => acc && !!fakeView.listElem.querySelector('a[href="#/chat/' + item.id + '"],a[href="/#/chat/' + item.id + '"]'), true);
                                        if (!hasLinks) {
                                            result.comments.push(printError('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms'))
                                        } else {
                                            result.score += 1;
                                            printOK('list items rendered by "redrawList" contains hyperlinks to each of the rooms')
                                        }
                                    }
                                }
                            }
                            fakeView = new LobbyView(testLobby);
                            listItems = fakeView.listElem.querySelectorAll("li");
                            if (listItems.length !== Object.keys(testLobby.rooms).length) {
                                result.comments.push(printError('"redrawList" not called inside constructor'))
                            } else {
                                let hasLinks = Object.values(testLobby.rooms).reduce((acc, item) => acc && !!fakeView.listElem.querySelector('a[href="#/chat/' + item.id + '"],a[href="/#/chat/' + item.id + '"]'), true);
                                if (!hasLinks) {
                                    result.comments.push(printError('list items rendered by "redrawList" does not contain hyperlinks to each of the rooms'))
                                } else {
                                    result.score += .5;
                                    printOK('list items rendered by "redrawList" contains hyperlinks to each of the rooms')
                                }
                            }
                            let clickHandler = __tester.listeners.find(elem => elem.node === fakeView.buttonElem && elem.type === "click");
                            if (!clickHandler) {
                                result.comments.push('Could not find a "click" event listener on "buttonElem"')
                            } else {
                                result.score += .5;
                                printOK('Found a "click" event listener on "buttonElem"');
                                let testName = Math.random().toString();
                                fakeView.inputElem.value = testName;
                                fakeView.buttonElem.click();
                                let added = Object.values(testLobby.rooms).find(item => item.name === testName);
                                if (!added) {
                                    result.comments.push(printError('Clicking "buttonElem" should add a new room in the "lobby" property of a LobbyView instance'))
                                } else {
                                    result.score += .5;
                                    printOK('Clicking "buttonElem" adds a new room in the "lobby" property of a LobbyView instance')
                                }
                                if (fakeView.inputElem.value !== "") {
                                    result.comments.push(printError("The input should be cleared after adding the room"))
                                } else {
                                    result.score += .25;
                                    printOK("The input was cleared after adding the room")
                                }
                            }
                        }
                    }
                }
            }
            return result
        }
    }, {
        id: "7",
        description: "Dynamic HTML with MVC (Model-View)",
        maxScore: 2,
        run: async () => {
            let result = {
                id: 7,
                score: 0,
                comments: []
            };
            let testRoom = makeTestRoom();
            let testListener;
            let testLobby = new Lobby;
            testLobby.rooms = {};
            await new Promise((resolve, reject) => {
                testListener = (room => {
                    if (room.id === testRoom.id && room.name === testRoom.name && room.image === testRoom.image) {
                        result.score += 1;
                        printOK("onNewRoom is called with the newly created Room instance")
                    } else {
                        result.comments.push(printError("onNewRoom should be called by passing the newly created Room instance"))
                    }
                    resolve()
                });
                testLobby.onNewRoom = testListener;
                testLobby.addRoom(testRoom.id, testRoom.name, testRoom.image, testRoom.messages);
                reject(new Error("onNewRoom event listener not invoked inside addRoom"))
            });
            testLobby.onNewRoom = null;
            testLobby.rooms = {};
            let fakeView = new LobbyView(testLobby);
            if (!testLobby.onNewRoom) {
                result.comments.push(printError('Inside LobbyView constructor, the "onNewRoom" property of the "lobby" object should be assigned a callback function'))
            } else {
                if (!(testLobby.onNewRoom instanceof Function)) {
                    result.comments.push(printError('"onNewRoom" should be assigned a function'))
                } else {
                    let testRooms = [];
                    for (let i = 0; i < 5; i++) {
                        testRooms.push(makeTestRoom());
                        testLobby.addRoom(testRooms[i].id, testRooms[i].name, testRooms[i].image, testRooms[i].messages)
                    }
                    let listItems = fakeView.listElem.querySelectorAll("li");
                    if (listItems.length !== Object.keys(testLobby.rooms).length) {
                        result.comments.push(printError("LobbyView not rendering the right number of list items "))
                    } else {
                        let hasLinks = Object.values(testLobby.rooms).reduce((acc, item) => acc && !!fakeView.listElem.querySelector('a[href="#/chat/' + item.id + '"],a[href="/#/chat/' + item.id + '"]'), true);
                        if (!hasLinks) {
                            result.comments.push(printError("list items rendered by LobbyView does not contain hyperlinks to each of the rooms"))
                        } else {
                            result.score += 1;
                            printOK("list items rendered by LobbyView contains hyperlinks to each of the rooms")
                        }
                    }
                }
            }
            return result
        }
    }, {
        id: "8",
        description: "Dynamic HTML with MVC (for ChatView)",
        maxScore: 10,
        run: async () => {
            let result = {
                id: 8,
                score: 0,
                comments: []
            };
            let data = makeTestRoom();
            let testMessage = {
                username: Math.random().toString(),
                text: Math.random().toString()
            };
            let testRoom = new Room(data.id, data.name, data.image, data.messages);
            let testListener;
            await new Promise((resolve, reject) => {
                testListener = (msg => {
                    if (msg.username === testMessage.username && msg.text === testMessage.text) {
                        result.score += .5;
                        printOK("onNewMessage was called with the newly created message object")
                    } else {
                        result.comments.push(printError("onNewMessage should be called by passing the newly created message object"))
                    }
                    resolve()
                });
                testRoom.onNewMessage = testListener;
                testRoom.addMessage(testMessage.username, testMessage.text);
                reject(new Error("onNewMessage event listener not invoked inside addMessage"))
            });
            let fakeView = new ChatView;
            if (fakeView.room !== null) {
                result.comments.push(printError('ChatView constructor does not assign "null" to the "room" property'))
            } else {
                result.score += .5;
                printOK('ChatView constructor assigns "null" to the "room" property')
            }
            fakeView.room = testRoom;
            if (!(ChatView.prototype.sendMessage && ChatView.prototype.sendMessage instanceof Function)) {
                result.comments.push(printError('Could not find a "sendMessage" method (prototype function) in ChatView'))
            } else {
                result.score += .5;
                printOK('Found a "sendMessage" method in ChatView');
                let testValue = Math.random().toString();
                await new Promise((resolve, reject) => {
                    testListener = (msg => {
                        if (msg.username === profile.username && msg.text === testValue) {
                            result.score += .5;
                            printOK("onNewMessage was called with the newly created message object")
                        } else {
                            result.comments.push(printError("onNewMessage should be called by passing the newly created message object"));
                            result.score += .25
                        }
                        resolve()
                    });
                    testRoom.onNewMessage = testListener;
                    fakeView.inputElem.value = testValue;
                    fakeView.sendMessage();
                    reject(new Error("onNewMessage event listener not invoked inside addMessage"))
                });
                let added = Object.values(testRoom.messages).find(item => item.text === testValue);
                if (!added) {
                    result.comments.push(printError('Clicking "buttonElem" should add a new message in the "room" object associated with the ChatView instance'))
                } else {
                    result.score += .5;
                    printOK('Clicking "buttonElem" adds a new message in the "room" object associated with the ChatView instance')
                }
                if (fakeView.inputElem.value !== "") {
                    result.comments.push(printError("The input should be cleared after adding the room"))
                } else {
                    result.score += .25;
                    printOK("The input was cleared after adding the room")
                }
                testRoom.onNewMessage = null;
                let clickHandler = __tester.listeners.find(elem => elem.node === fakeView.buttonElem && elem.type === "click");
                if (!clickHandler) {
                    result.comments.push(printError('Could not find a "click" event listener on "buttonElem" of the ChatView instance'))
                } else {
                    result.score += .25;
                    printOK('Found a "click" event listener on "buttonElem" of the ChatView instance');
                    let oldSendMessage = ChatView.prototype.sendMessage;
                    await new Promise((resolve, reject) => {
                        ChatView.prototype.sendMessage = (() => {
                            result.score += .5;
                            ChatView.prototype.sendMessage = oldSendMessage;
                            resolve();
                            printOK("Clicking buttonElem triggers sendMessage")
                        });
                        fakeView.buttonElem.click();
                        reject(new Error("Clicking buttonElem does not trigger sendMessage"))
                    });
                    ChatView.prototype.sendMessage = oldSendMessage
                }
                testRoom.onNewMessage = null;
                let keyupHandler = __tester.listeners.find(elem => elem.node === fakeView.inputElem && elem.type === "keyup");
                if (!keyupHandler) {
                    result.comments.push(printError('Could not find a "keyup" event listener on "inputElem" of the ChatView instance'))
                } else {
                    result.score += .25;
                    printOK('Found a "keyup" event listener on "inputElem" of the ChatView instance');
                    let oldSendMessage = ChatView.prototype.sendMessage;
                    await new Promise((resolve, reject) => {
                        ChatView.prototype.sendMessage = (() => {
                            reject(new Error("Keyup with key other than the enter key should not trigger sendMessage"))
                        });
                        keyupHandler.invoke(new KeyboardEvent("keyup", {
                            keyCode: 27,
                            shiftKey: false,
                            key: "Escape",
                            code: "Escape"
                        }));
                        resolve()
                    });
                    await new Promise((resolve, reject) => {
                        ChatView.prototype.sendMessage = (() => {
                            reject(new Error("Keyup with shift key pressed should not trigger sendMessage"))
                        });
                        keyupHandler.invoke(new KeyboardEvent("keyup", {
                            keyCode: 13,
                            shiftKey: true,
                            key: "Enter",
                            code: "Enter"
                        }));
                        resolve()
                    });
                    await new Promise((resolve, reject) => {
                        ChatView.prototype.sendMessage = (() => {
                            result.score += 1;
                            resolve();
                            printOK("Enter key without the shift key triggers sendMessage")
                        });
                        keyupHandler.invoke(new KeyboardEvent("keyup", {
                            keyCode: 13,
                            shiftKey: false,
                            key: "Enter",
                            code: "Enter"
                        }));
                        reject(new Error("Keyup with enter key without the shift key does not trigger sendMessage"))
                    });
                    ChatView.prototype.sendMessage = oldSendMessage
                }
            }
            if (!(ChatView.prototype.setRoom && ChatView.prototype.setRoom instanceof Function)) {
                result.comments.push(printError('Could not find a "setRoom" method (prototype function) in ChatView'))
            } else {
                result.score += .25;
                printOK('Found a "setRoom" method in ChatView');
                let data1 = makeTestRoom();
                let data2 = makeTestRoom();
                let testRoom1 = new Room(data1.id, data1.name, data1.image, data1.messages);
                let testRoom2 = new Room(data2.id, data2.name, data2.image, data2.messages);
                let testView = new ChatView;
                let runRoomTest = testRoom => {
                    if (testView.room !== testRoom) {
                        result.comments.push(printError('"setRoom" should assign the given room to the "room" property of the ChatView instance'))
                    } else {
                        result.score += .25;
                        printOK('"setRoom" assigns the given room to the "room" property of the ChatView instance')
                    }
                    if (testRoom.name !== testView.titleElem.textContent) {
                        result.comments.push(printError('"setRoom" should display the given room name in "titleElem"'))
                    } else {
                        result.score += .25;
                        printOK('"setRoom" displays the given room name in "titleElem"')
                    }
                    let chatUsers = testView.chatElem.querySelectorAll(".message .message-user");
                    let chatTexts = testView.chatElem.querySelectorAll(".message .message-text");
                    if (chatUsers.length !== testRoom.messages.length || chatTexts.length !== testRoom.messages.length) {
                        result.comments.push(printError("Chat list is not displaying the same number of messages as the messages in the Room instance"))
                    } else {
                        result.score += .25;
                        printOK("Chat list displays the same number of messages as the messages in the Room instance");
                        let hasChats = testRoom.messages.reduce((acc, item, index) => acc && chatUsers[index].textContent.trim() === item.username && chatTexts[index].textContent.trim() === item.text, true);
                        if (!hasChats) {
                            result.comments.push(printError("Chat list is not displaying the messages correctly - potentially displaying out of order or with incorrect values"))
                        } else {
                            result.score += .25;
                            printOK("Chat list displays the messages correctly")
                        }
                    }
                    let testValue = Math.random().toString();
                    testRoom.addMessage(profile.username, testValue);
                    let myMessage = testView.chatElem.querySelectorAll(".my-message");
                    if (myMessage.length !== 1) {
                        result.comments.push(printError("Expecting just 1 new message to be added, but found " + myMessage.length + " messages"))
                    } else {
                        result.score += .25;
                        printOK("Found 1 new message as expected");
                        let messageText = myMessage[0].querySelector(".message-text").textContent.trim();
                        if (messageText !== testValue) {
                            result.comments.push(printError("Newly added message has the incorrect text. Expected " + testValue + " but got " + messageText))
                        } else {
                            result.score += .25;
                            printOK("Newly added message has the correct text")
                        }
                    }
                };
                testView.setRoom(testRoom1);
                runRoomTest(testRoom1);
                testView.setRoom(testRoom2);
                runRoomTest(testRoom2);
                let mainScope = __tester.exports.get(main);
                if (!mainScope) {
                    result.comments.push(printError('Unable to test: local variables inside "main" were not exported'))
                } else {
                    if (!mainScope["lobby"]) {
                        result.comments.push(printError('local variable "lobby" inside "main" was not found/exported'))
                    } else {
                        let lobby = mainScope["lobby"];
                        let originalRooms = lobby.rooms;
                        let testRooms = {};
                        for (let i = 0; i < 4; i++) {
                            let room = makeTestRoom();
                            testRooms[room.id] = new Room(room.id, room.name, room.image, room.messages)
                        }
                        lobby.rooms = testRooms;
                        let pageView = document.querySelector("div#page-view");
                        if (!pageView) {
                            result.comments.push(printError("Could not find div#page-view"));
                            return result
                        }
                        let originalHash = window.location.hash;
                        let originalPage = pageView.firstChild;
                        let prevPage = originalPage;
                        for (let id in lobby.rooms) {
                            window.location.hash = "#/chat/" + id;
                            await delay(10);
                            let hasTitle = lobby.rooms[id].name === pageView.querySelector(".room-name").textContent.trim();
                            if (!hasTitle) {
                                result.comments.push(printError("The name of the Room instance is not shown in heading"))
                            } else {
                                result.score += .25;
                                printOK("The name of the Room instance is shown in heading")
                            }
                            let chatUsers = pageView.querySelectorAll(".message .message-user");
                            let chatTexts = pageView.querySelectorAll(".message .message-text");
                            if (chatUsers.length !== lobby.rooms[id].messages.length || chatTexts.length !== lobby.rooms[id].messages.length) {
                                result.comments.push(printError("Chat list is not displaying the same number of messages as the messages in the Room instance"))
                            } else {
                                let hasChats = lobby.rooms[id].messages.reduce((acc, item, index) => acc && chatUsers[index].textContent.trim() === item.username && chatTexts[index].textContent.trim() === item.text, true);
                                if (!hasChats) {
                                    result.comments.push(printError("Chat list is not displaying the messages correctly - potentially displaying out of order or with incorrect values"))
                                } else {
                                    result.score += .25;
                                    printOK("Chat list displays the messages correctly")
                                }
                            }
                            prevPage = pageView.firstChild
                        }
                        lobby.rooms = originalRooms;
                        window.location.hash = originalHash
                    }
                }
            }
            return result
        }
    }];
    const emoji = {
        bug: String.fromCodePoint(128030),
        like: String.fromCodePoint(128077)
    };
    const elem = (tagName, parent) => {
        let e = document.createElement(tagName);
        if (parent) parent.appendChild(e);
        return e
    };
    const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));
    const print = (text, ...extra) => (store.options.showLogs && console.log("[34m[Tester][0m", text, ...extra), text);
    const printError = (text, ...extra) => (store.options.showLogs && console.log("[34m[Tester][0m %c Bug " + emoji.bug + " ", "background-color: red; color: white; padding: 1px;", text, ...extra), text);
    const printOK = (text, ...extra) => (store.options.showLogs && console.log("[34m[Tester][0m %c OK " + emoji.like + " ", "background-color: green; color: white; padding: 1px;", text, ...extra), text);

    function forEachAsync(asyncCallback, thisArg, delayMs = 0) {
        let array = this;
        let self = thisArg || this;
        let boundCallback = asyncCallback.bind(self);
        let next = async index => {
            if (index === array.length) return null;
            if (delayMs > 0 && index > 0) await delay(delayMs);
            await boundCallback(array[index], index, array);
            return await next(index + 1)
        };
        return next(0)
    }
    let store = window.localStorage.getItem("store_" + a);
    if (store) store = JSON.parse(store);
    else store = {
        options: {
            showLogs: true
        },
        selection: {},
        results: {},
        lastTestAt: null
    };
    let ui = {};
    let dom = elem("div");
    dom.style.position = "fixed";
    dom.style.top = "0px";
    dom.style.right = "0px";
    let button = elem("button");
    button.textContent = "Test";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.padding = "0.5em";
    let menu = elem("div");
    menu.style.padding = "0.5em";
    menu.style.position = "fixed";
    menu.style.right = "0px";
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.backgroundColor = "white";
    menu.style.visibility = "hidden";
    let optionsDiv = elem("div", menu);
    let showLogs = elem("label", optionsDiv);
    let showLogsCheckbox = elem("input", showLogs);
    showLogsCheckbox.type = "checkbox";
    showLogsCheckbox.checked = "showLogs" in store.options ? store.options.showLogs : true;
    showLogsCheckbox.addEventListener("change", evt => {
        store.options.showLogs = evt.target.checked;
        window.localStorage.setItem("store_" + a, JSON.stringify(store))
    });
    showLogs.appendChild(document.createTextNode(" Show logs during test"));
    let table = elem("table", menu);
    table.style.borderCollapse = "collapse";
    let thead = elem("thead", table);
    thead.style.backgroundColor = "dimgray";
    thead.style.color = "white";
    let htr = elem("tr", thead);
    let th0 = elem("th", htr);
    th0.textContent = "Task";
    th0.style.padding = "0.25em";
    let th1 = elem("th", htr);
    th1.textContent = "Description";
    th1.style.padding = "0.25em";
    let th2 = elem("th", htr);
    th2.textContent = "Run";
    th2.style.padding = "0.25em";
    let checkBoxAll = elem("input", th2);
    checkBoxAll.type = "checkbox";
    checkBoxAll.checked = store.selection && Object.keys(store.selection).length > 0 ? Object.values(store.selection).reduce((acc, val) => acc && val, true) : false;
    checkBoxAll.addEventListener("change", evt => {
        tests.forEach(test => {
            ui[test.id].checkBox.checked = evt.target.checked;
            store.selection[test.id] = evt.target.checked
        });
        window.localStorage.setItem("store_" + a, JSON.stringify(store))
    });
    let th3 = elem("th", htr);
    th3.textContent = "Result";
    th3.style.padding = "0.25em";
    let tbody = elem("tbody", table);
    let tfoot = elem("tfoot", table);
    let ftr = elem("tr", tfoot);
    ftr.style.borderTop = "1px solid dimgray";
    let fth0 = elem("th", ftr);
    fth0.textContent = "Total";
    fth0.colSpan = 3;
    let fth1 = elem("th", ftr);
    fth1.textContent = "-";
    let renderResult = () => {
        let sum = 0;
        let maxScore = 0;
        let allComments = [];
        tests.forEach(test => {
            let result = store.results[test.id];
            sum += result.score;
            maxScore += test.maxScore;
            if (result.comments.length > 0) allComments.push("Task " + test.id + ":\n" + result.comments.map(comm => "  - " + comm).join("\n"))
        });
        fth1.textContent = sum + "/" + maxScore;
        return {
            sum: sum,
            max: maxScore,
            comments: allComments.join("\n")
        }
    };
    let runButton = elem("button", menu);
    runButton.id = "test-button";
    runButton.textContent = "Run Tests";
    let lastTested = elem("div", menu);
    lastTested.style.fontSize = "0.8em";
    lastTested.style.textAlign = "right";
    if (store.lastTestAt) {
        renderResult();
        lastTested.textContent = "Last Run at: " + new Date(store.lastTestAt).toLocaleString()
    }
    tests.forEach((test, i) => {
        let tr = elem("tr", tbody);
        tr.style.backgroundColor = i % 2 === 0 ? "white" : "#eee";
        let td0 = elem("td", tr);
        td0.textContent = test.id;
        td0.style.textAlign = "center";
        let td1 = elem("td", tr);
        td1.textContent = test.description;
        let td2 = elem("td", tr);
        td2.style.textAlign = "center";
        let checkBox = elem("input", td2);
        checkBox.type = "checkbox";
        checkBox.checked = test.id in store.selection ? store.selection[test.id] : false;
        checkBox.addEventListener("change", evt => {
            store.selection[test.id] = evt.target.checked;
            window.localStorage.setItem("store_" + a, JSON.stringify(store))
        });
        let td3 = elem("td", tr);
        td3.style.textAlign = "center";
        td3.textContent = test.id in store.results ? store.results[test.id].skipped ? "-" : store.results[test.id].score + "/" + test.maxScore : "-";
        ui[test.id] = {
            checkBox: checkBox,
            resultCell: td3
        }
    });
    dom.appendChild(button);
    dom.appendChild(menu);
    runButton.addEventListener("click", async evt => {
        runButton.disabled = true;
        await forEachAsync.call(tests, async test => {
            let input = ui[test.id].checkBox;
            let cell = ui[test.id].resultCell;
            if (input.checked) {
                runButton.textContent = "Running Test " + test.id;
                let result;
                try {
                    print("--- Starting Test " + test.id + " ---");
                    result = await test.run();
                    print("--- Test " + test.id + " Finished --- Score = " + Math.round(100 * result.score) / 100 + " / " + test.maxScore);
                    if (result && result.comments.length > 0) print("Task " + test.id + ":\n" + result.comments.map(comm => "  - " + comm).join("\n"));
                    store.results[test.id] = {
                        skipped: false,
                        score: result ? Math.round(100 * result.score) / 100 : 0,
                        comments: result ? result.comments : []
                    }
                } catch (err) {
                    store.results[test.id] = {
                        skipped: false,
                        score: 0,
                        comments: ["Error while running tests: " + err.message]
                    };
                    console.log(err)
                }
                if (store.options.showLogs) console.log("")
            } else {
                store.results[test.id] = {
                    skipped: true,
                    score: 0,
                    comments: []
                }
            }
            cell.textContent = store.results[test.id].skipped ? "Skipped" : Math.round(100 * store.results[test.id].score) / 100 + "/" + test.maxScore
        });
        let sum = renderResult();
        console.log("[34m[Tester][0m", "Total = " + sum.sum + " / " + sum.max);
        console.log(sum.comments);
        store.lastTestAt = Date.now();
        window.localStorage.setItem("store_" + a, JSON.stringify(store));
        lastTested.textContent = "Last Run at: " + new Date(store.lastTestAt).toLocaleString();
        runButton.textContent = "Run Tests";
        runButton.disabled = false
    });
    button.addEventListener("click", evt => menu.style.visibility == "hidden" ? menu.style.visibility = "visible" : menu.style.visibility = "hidden");
    document.body.appendChild(dom)
});
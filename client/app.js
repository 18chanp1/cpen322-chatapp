/**
 * Helper functions
 */

// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM (elem){
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
function createDOM (htmlString){
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

function* makeConversationLoader(room) {
      let date = room.createDate;
      let flag = true;
    
      while(flag){
        yield new Promise((resolve, reject) => {
          room.canLoadConversation = false;
          Service.getLastConversation(room.id, date).then((convo) => {
            if(convo == null){
              resolve(null);
              flag = false;
              return;
            }
            date = convo.timestamp;
            room.canLoadConversation = true;
            room.addConversation(convo);
            resolve(convo);
          }, (err) =>{
            flag = false;
            reject(null);
          } )
        })
      }
}


var Service = {
  origin: window.location.origin,
  getAllRooms: function() {
    let request = new Promise((resolve, reject) =>{
      let xhr = new XMLHttpRequest();
      xhr.open("GET", Service.origin + "/chat");
      xhr.send(null);

      xhr.timeout = 2000;

      xhr.ontimeout = function(){
        reject(new Error("timed out"));
      }

      xhr.onload = function(){
        console.log(xhr.status);
        if (xhr.status == 200){
          console.log(xhr.response);
          resolve(JSON.parse(xhr.response));
        } else{
          reject(new Error(xhr.response));
        }
      }

      xhr.onerror = function(err) {
        reject(new Error(err));
      }
    });

    return request;
  },
  addRoom: function(data){
    let request = new Promise((resolve, reject) =>{
      let xhr = new XMLHttpRequest();
      xhr.open("POST", Service.origin + "/chat");
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(data));

      xhr.onload = function(){
        if (xhr.status == 200){
          resolve(JSON.parse(xhr.response));
        } else{
          reject(new Error(xhr.response));
        }
      }

      xhr.onerror = function(err) {
        reject(new Error(err));
      }
    });
    return request;
  },

  getLastConversation: function(roomId, before){

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", Service.origin + "/chat/" + roomId + "/messages" + "?before=" + before);
      xhr.send(null);
  
      xhr.onload = function() {
        if (xhr.status == 200){
          console.log("now logging response");
          //console.log();
          resolve(JSON.parse(xhr.response));
        }
        else {
          reject(new Error("Failed to get last conversation, responded"));
        }
      }
  
      xhr.onerror = function() {
        reject(new Error("Failed to get last conversation"));
      }
  
    });
  },

  getProfile: function() {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", Service.origin + "/profile");
      xhr.send(null);
  
      xhr.onload = function() {
        if (xhr.status == 200){
          console.log("now logging response");
          //console.log();
          resolve(JSON.parse(xhr.response));
        }
        else {
          reject(new Error("Failed to get last conversation, responded"));
        }
      }
  
      xhr.onerror = function() {
        reject(new Error("Failed to get last conversation"));
      }
  
    });
  },

}

var profile = Service.getProfile().then((success) => {return success});




var p = window.addEventListener("load", main);
console.log(p);

function main() {
  let lobby = new Lobby();

  let socket = new WebSocket("ws://localhost:8000");
  socket.addEventListener("message", (msg) => {
    
    console.log("RCVD");
    let parsed = JSON.parse(msg.data);
    parsed.text = sanitize(parsed.text);
    let room = lobbyView.lobby.rooms[parsed.roomId];
    room.addMessage(parsed.username, parsed.text);
    
  })


  var lobbyView = new LobbyView(lobby);
  var profileView = new ProfileView();
  var chatView = new ChatView(socket);
  window.addEventListener("popstate", renderRoute);
  renderRoute();
  function renderRoute(){
    var hash = window.location.hash;
    var pageview = document.getElementById("page-view");
    

    if(hash == "#/"){
      emptyDOM(pageview);
      pageview.appendChild(lobbyView.elem, pageview);
    }
    else if(hash == "#/profile"){
      emptyDOM(pageview);
      pageview.appendChild(profileView.elem, pageview);
    }
    else if (hash.substring(0,6) == "#/chat"){
      emptyDOM(pageview);
      let id = hash.substring(7);
      ("id" + id);
      let ouroom = lobby.getRoom(id);
      ("roomno" + ouroom.name);

      if(typeof ouroom !== "undefined"){
        chatView.setRoom(ouroom);
        ("success" + ouroom.name);
      } else{
        (typeof ouroom);
      }


      pageview.appendChild(chatView.elem, pageview);
    }
  }
function refreshLobby(){
    Service.getAllRooms().then((result)=> {
      for(let i = 0; i < result.length; i++){
        
        let room = result[i];

        if(room.id in lobby.rooms){
          lobby.rooms[room._id].image = room.image;
          lobby.rooms[room._id].name = room.name;
        } else {
          lobby.addRoom(room._id, room.name, room.image, room.messages);
        }
        
      }
    });
  }
  

    refreshLobby();
    setInterval(refreshLobby, 6000);

    cpen322.export(arguments.callee, {lobby, chatView});

    profile = Service.getProfile().then((success) => {profile = success});

  }
  
class LobbyView{
  constructor(lobby){
    this.lobby = lobby;
    
    this.elem = createDOM(`
    <div id = "page-view">
        <div class = "content">
            <ul class = "room-list">
                <li>
                <a href = "#/chat/room-1">Chat1</a>
                </li>
                <li>
                <a href = "#/chat">Chat2</a>
                </li>
                <li>
                <a href = "#/chat">Chat3</a>
                </li>
            </ul>
            <div class = "page-control">
                <input type = "text">
                <button>Create Room</button>
            </div>
        </div>

    </div>`);
    this.listElem = this.elem.querySelector("ul.room-list");
    this.inputElem = this.elem.querySelector("input");
    this.buttonElem = this.elem.querySelector("button");

    this.redrawList();

    let bch = this.buttonclickhandler
    var thislobby = this;
    this.buttonElem.addEventListener("click", function(){bch(thislobby)});


    
    this.lobby.onNewRoom = function(room) {
      thislobby.redrawList();
    }



    

  }

  buttonclickhandler(theLobbyView) {
    let text = theLobbyView.inputElem.value;
    let roomToAdd = {
      name: theLobbyView.inputElem.value,
      image: "assets/everyone-icon.png"
    }
    Service.addRoom(roomToAdd).then( (result) => {
      theLobbyView.lobby.addRoom(result._id,result.name, result.image);
      console.log("added room");
    });
    //TODO fix promises and stuff
    
    theLobbyView.inputElem.value = "";
  }

  redrawList() {
    emptyDOM(this.listElem);
    (Object.keys(this.lobby.rooms));
    for(let i = 0; i < Object.keys(this.lobby.rooms).length; i++){
        var myid = Object.keys(this.lobby.rooms)[i];
        (this.lobby);
        let e = this.lobby.rooms[myid];

        if(typeof e === 'undefined'){
          continue;
        }

        (e.name);

       let roomElement = createDOM(`
          <li>
            <a href = "#/chat">chatPlaceholder</a>
          </li>
       `);
        let linkElement = roomElement.querySelector("li a");
        linkElement.textContent = e.name;
        linkElement.href = "#/chat/" + e.id; 

        (this.listElem);

      this.listElem.appendChild(roomElement);
    }

    // (this.lobby.rooms);
    // (this.listElem.childNodes.length);


    //TODO
  }

  
}

class ChatView {
  constructor(socket) {
    this.elem = createDOM(`
          <div id = "page-view">
          <div class = "content">
            <h4 class = "room-name">Test room TESTIFICATE</h4>
            <div class = "message-list">
              <div class = "message">
                <span class = "message-user">Test user</span>
                <span class = "message-text">I am a student</span>
              </div>
              <div class = "message my-message">
                <span class = "message-user">Test Prof</span>
                <span class = "message-text">Come to OH</span>
    
              </div>
            </div>
            <div class = "page-control">
              <textarea></textarea>
              <button>Send</button>
            </div>
          </div>
        `);

    this.titleElem = this.elem.querySelector("h4");
    this.chatElem = this.elem.querySelector("div.message-list");
    this.inputElem = this.elem.querySelector("textarea");
    this.buttonElem = this.elem.querySelector("button");
    this.socket = socket;

    this.room = null;

    let thisChatViewObject = this;

    this.buttonElem.addEventListener("click", function(){
      thisChatViewObject.sendMessage();
    }, false);

    this.inputElem.addEventListener("keyup", (event) =>{
      if(event.key === "Enter" && !event.shiftKey){
        thisChatViewObject.sendMessage();
      }
    }
    );

    let chatElementthingy = this.chatElem;

    this.chatElem.addEventListener("wheel", (event) => {
        let dUp = event.wheelDeltaY > 0;
        let loadable = this.room.canLoadConversation;
        let top = chatElementthingy.scrollTop <= 0;

        console.log("wheeling!");
        console.log(chatElementthingy.scrollTop);

        if (top && dUp && loadable){
          this.room.getLastConversation.next();
        }
    });
  }

  sendMessage(){
    let inputmessage = this.inputElem.value;
    this.room.addMessage(profile.username, inputmessage);
    this.inputElem.value = "";
    let message = {
      roomId: this.room.id,
      username: profile.username,
      text: inputmessage
    };

    this.socket.send(JSON.stringify(message));
  }

  setRoom(room){
    this.room = room;

    ("before title:" + this.titleElem.value);
    this.titleElem.textContent = room.name;
    ("title:" + this.titleElem.value);

    emptyDOM(this.chatElem);

    for(const e of this.room.messages){
      console.log("printing messages");
      console.log(e);
      let messageDOM = createDOM(`
        <div class = "message">
          <span class = "message-user"></span> <br>
          <span class = "message-text"></span> <br>
        </div>
      `)
      
      messageDOM.querySelector("span.message-user").textContent = e.username;
      messageDOM.querySelector("span.message-text").textContent = e.text;

      if(profile.username === e.username){
        messageDOM.className = "message my-message";
      }

      this.chatElem.appendChild(messageDOM);


    }

    let ourChatView = this;

    this.room.onNewMessage = function (message) {

      console.log("adding")

      let messageDOM = createDOM(`
        <div class = "message">
        <span class = "message-user"></span> <br>
        <span class = "message-text"></span> <br>
        </div>
      `)

      
    
      messageDOM.querySelector("span.message-user").textContent = message.username;
      messageDOM.querySelector("span.message-text").textContent = message.text;

      if(profile.username === message.username){
        messageDOM.className = "message my-message";
      }

      ourChatView.chatElem.appendChild(messageDOM);
    }

    let that = this;

    this.room.onFetchConversation = function (conversation) {
        let before = that.chatElem.scrollHeight;

        for(let i = conversation.messages.length - 1; i >=0; i--){
          let message = conversation.messages[i];
          let messageDOM = createDOM(`
          <div class = "message">
          <span class = "message-user"></span> <br>
          <span class = "message-text"></span> <br>
          </div>
        `)
          messageDOM.querySelector("span.message-user").textContent = message.username;
          messageDOM.querySelector("span.message-text").textContent = message.text;
  
          if(profile.username === message.username){
            messageDOM.className = "message my-message";
          }
  
          ourChatView.chatElem.insertBefore(messageDOM, ourChatView.chatElem.firstChild);

        }

        that.chatElem.scrollTop = that.chatElem.scrollHeight - before;

    }


  }


}

class ProfileView {
  constructor () {
    this.elem = createDOM(`
      <div id = "page-view">
      <div class = "content">
      <div class = "profile-form">
        <div class = "form-field">
          <label>Username</label>
          <input type = "text">
        </div>

        <div class = "form-field">
          <label>Password</label>
          <input type = "password">
        </div>

        <div class = "form-field">
          <label>Avatar Image</label>
          <input type = "file">
        </div>

        <div class = "page-control">
        <button>Save</button>
        </div>

      </div>
      </div>
      `);
  } 
}

class Room {
  constructor(id, name, image, messages){
    this.id = id;
    this.name = name;
    this.image = typeof image !== 'undefined' ? image: "assets/everyone-icon.png";
    this.messages = typeof messages !== 'undefined' ? messages :[];
    this.getLastConversation = makeConversationLoader(this);
    this.canLoadConversation = true;
    this.createDate = Date.now();
  }

  addMessage(username, text){
    if(text.trim().length === 0){
      return;
    }
    else {
      const aMessage = {
        username: username,
        text: text,
      };
      this.messages.push(aMessage);

      if(typeof this.onNewMessage === "function"){
        this.onNewMessage(aMessage);
      }

    }

    console.log("All messages");
    console.log(this.messages);
    
  }

  addConversation(conversation){
    let messagesToAdd = conversation.messages;


    for(let i = messagesToAdd.length - 1; i >=0; i--){
      this.messages.unshift(messagesToAdd[i]);
    }

    this.onFetchConversation(conversation);
  }

  
}

class Lobby{
  constructor(){
    this.rooms = {};

    // this.addRoom("room-1", "room1");
    // this.addRoom("2", "room2");
    // this.addRoom("3", "room3");
  }

  getRoom(roomId){
    return this.rooms[roomId];
  }

  addRoom(id, name, image, messages){
    this.rooms[id] = new Room(id, name, image, messages);

    if(typeof this.onNewRoom === 'function'){
      this.onNewRoom(this.rooms[id]);
    }
  }
}

function sanitize(string) {
	let tmp = string.replaceAll('<', " ");
	tmp = tmp.replaceAll(">", " ");
	return tmp;
  }



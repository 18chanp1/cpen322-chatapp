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




var profile = {username:"Alice"};

var p = window.addEventListener("load", main);
console.log(p);

function main() {
  let lobby = new Lobby();


  var lobbyView = new LobbyView(lobby);
  var profileView = new ProfileView();
  var chatView = new ChatView();
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
  cpen322.export(arguments.callee, { renderRoute, lobbyView, chatView, profileView, lobby });
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
    theLobbyView.lobby.addRoom(text,text);
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
  constructor() {
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
  }

  sendMessage(){
    ("sent");
    let inputmessage = this.inputElem.value;
    this.room.addMessage(profile.username, inputmessage);
    this.inputElem.value = "";
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
}

class Lobby{
  constructor(){
    this.rooms = {};

    //this.rooms = [new Room("0", "69", "", "")];
    this.addRoom("room-1", "room1");
    this.addRoom("2", "room2");
    this.addRoom("3", "room3");
    // this.addRoom("4", "room4");
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

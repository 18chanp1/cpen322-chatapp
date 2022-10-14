console.log("test");
var mainHander = window.addEventListener("load", main(), false);

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



// example usage
// var messageBox = createDOM(
//     `<div>
//         <span>Alice</span>
//         <span>Hello World</span>
//     </div>`
//     );



function main() {
    var popstateHandler = window.addEventListener("popstate", sample(), false);

    console.log("main");
    

    function sample(){
      console.log("popstate fired");
      renderRoute();
  }
    
    function renderRoute() {
        console.log("routing");
        var hash = window.location.hash;
        var pageView = document.getElementById("page-view");
        
        console.log(hash);
        console.log(pageView);

        


        if(hash == "#/"){
            emptyDOM(pageView);
            console.log("main");
            var newDOM = createDOM(`
            <div id = "page-view">
                <div class = "content">
                <ul class = "room-list">
                <li>
                    <a href = "#/chat">Chat1</a>
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
            </div>`
            );
            console.log(newDOM);
            pageView.parentNode.replaceChild(newDOM, pageView);
            
            
            
        }

        else if(hash == "#/chat"){
            emptyDOM(pageView);
            console.log("chat");
            var newDOM = createDOM(`
            <div id = "page-view">
            <h4 class = "room-name"></h4>
            <div class = "message-list">
              <div class = "message">
                <span class = "message-user"></span>
                <span class = "message-text"></span>
              </div>
              <div class = "message my-message">
                <span class = "message-user"></span>
                <span class = "message-text"></span>
    
              </div>
            </div>
            <div class = "page-control">
              <textarea></textarea>
              <button>Send</button>
            </div>
            </div>
            
            
            `);
            pageView.parentNode.replaceChild(newDOM, pageView);

        }

        else if (hash == "#/profile"){
            console.log("routing profile");
            emptyDOM(pageView);
            var newDOM = createDOM(`
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
      
              </div>
              <div class = "page-control">
                <button>Save</button>
              </div>
            </div>
      
          </div>
            `);

            pageView.parentNode.replaceChild(newDOM, pageView);

        }

        
    }
  }
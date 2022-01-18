import { ERROR_START, METHODS, SUCCESS, PLAYER_ID, SESSION_ID, WEBSOCKET_IP, getColor, INDEX_PAGE, LOBBY_PAGE, GAME_PAGE } from './constants.js';

//Handlers for buttons
document.getElementById("btn_copy").addEventListener("click", onClickCopy);
document.getElementById("btn_start").addEventListener("click", onClickStartGame);
document.getElementById("btn_leave").addEventListener("click", onClickLeave);

const ws = new WebSocket(WEBSOCKET_IP);

let moving_to_game = false;

document.addEventListener("unload", ()=>{
    if(!moving_to_game){
        let message = {method:METHODS.QUIT, session_id:sessionStorage.getItem(SESSION_ID)}
        ws.send(JSON.stringify(message));
    }
})

ws.addEventListener("open", () =>{
    let message = {method:METHODS.RECONNECT, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
    message = {method:METHODS.LOBBY_INFO, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
})
ws.addEventListener("close", () =>{
    console.log("Connection closed :(");
})
ws.addEventListener("message", ({data}) =>{
    const obj_message = JSON.parse(data);
    console.log(obj_message);
    if(obj_message.method == METHODS.SESSION_SHARE){
        if(!sessionStorage.getItem(SESSION_ID)){
            window.location.replace("index.html");
        }else{
            console.log("no capo yo ya tengo mi llave");
        }
    }
    else if(obj_message.method == METHODS.LOBBY_INFO){
        sessionStorage.setItem(PLAYER_ID, obj_message.player_number);
        show_lobby(obj_message);
        show_players(obj_message.users);
    }
    else if(obj_message.method == METHODS.OPERATION_STATUS){
        if(obj_message.status == SUCCESS){
            moving_to_game = true;
            window.location.replace("game.html");
        }else{
            console.log(ERROR_START);
        }
    }
    else if(obj_message.method == METHODS.GAME_STATE){
        //We are in game!
        window.location.replace("game.html");
    }
})

function onClickCopy(){
    let invite_url = document.getElementById("lobby_id_invite");

    invite_url.select();
    invite_url.setSelectionRange(0, 99999); //For mobile

    //Copy the text inside the text field
    navigator.clipboard.writeText(invite_url.value);

    let tooltiptext =  document.querySelector(".tooltiptext");
    tooltiptext.style.animation = "copy 2s";
    tooltiptext.addEventListener("animationend", () =>{tooltiptext.style.removeProperty("animation")});
}

function onClickStartGame(){
    let message = {method:METHODS.START, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickLeave(){
    console.log("Leaving");
    window.location.replace(INDEX_PAGE);
}

function show_lobby(lobby_info){
    //Show the lobby code
    document.getElementById("lobby_id").innerHTML = lobby_info.lobby_id;

    //Updates the lobby code for copy link
    document.getElementById("lobby_id_invite").value = INDEX_PAGE + "?lobby=" + lobby_info.lobby_id;
}
function show_players(players){
    let lobby_players = document.getElementById("lobby_players");

    //Eliminates the players from the list
    lobby_players.textContent = ''; 

    //Use DocumentFragment for performance, do not create elemet and node and then appendChild
    //in a for loop because the DOM is refreshed every time.
    const fragment = document.createDocumentFragment();

    for(let id = 0; id < players.length; id++){
        let container = document.createElement("div");
        container.classList.add("player_container");
        container.style.backgroundColor =  getColor(id);
        container.innerHTML = `
            <img id="img_user" src="../resources/img_user.png"> 
            <h5>${players[id].name}</h5>
        `;
        //container.appendChild(document.createTextNode(player.name));
        fragment.appendChild(container);
    }
    lobby_players.appendChild(fragment);

    //Enable the start button only for the owner
    if(sessionStorage.getItem(PLAYER_ID) == 0){
        document.getElementById("btn_start").disabled = false;
    }
}


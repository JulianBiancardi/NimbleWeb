import { ERROR_START, METHODS, SUCCESS, PLAYER_ID, SESSION_ID, WEBSOCKET_IP} from './constants.js';

//Handlers for buttons
document.getElementById("btn_start").addEventListener("click", onClickStartGame);

const ws = new WebSocket(WEBSOCKET_IP);

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
            window.location.href = "index.html";
        }else{
            console.log("no capo yo ya tengo mi llave");
        }
    }
    else if(obj_message.method == METHODS.LOBBY_INFO){
        sessionStorage.setItem(PLAYER_ID, obj_message.player_number);
        show_lobby(obj_message);
    }
    else if(obj_message.method == METHODS.OPERATION_STATUS){
        if(obj_message.status == SUCCESS){
            window.location.href = "game.html";
        }else{
            console.log(ERROR_START);
        }
    }
})


function onClickStartGame(){
    let message = {method:METHODS.START, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function show_lobby(lobby_info){
    //Show the lobby code
    document.getElementById("lobby_id").innerHTML = lobby_info.lobby_id;
    show_players(lobby_info.users);
}
function show_players(players){
    let lobby_players = document.getElementById("lobby_players");

    //Eliminates the players from the list
    lobby_players.textContent = ''; 

    //Use DocumentFragment for performance, do not create elemet and node and then appendChild
    //in a for loop because the DOM is refreshed every time.
    const fragment = document.createDocumentFragment();

    players.forEach(player => {
        let container = document.createElement("div");
        container.classList.add("player_container");
        container.innerHTML = `
            <img id="img_user" src="../resources/img_user.png"> 
            <h5>${player.name}</h5>
        `;
        //container.appendChild(document.createTextNode(player.name));
        fragment.appendChild(container);
    });

    lobby_players.appendChild(fragment);

    //Enable the start button only for the owner
    if(sessionStorage.getItem(PLAYER_ID) == 0){
        document.getElementById("btn_start").disabled = false;
    }
}

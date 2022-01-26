import { METHODS, SESSION_ID, WEBSOCKET_IP, getColor, geturl, MAX_PLAYERS} from './constants.js';

document.addEventListener("load", () => {
    let id = sessionStorage.getItem(SESSION_ID);
    if(!id){
        console.log("missing session id");
        window.location.replace(geturl("index.html"));
    }
})


//Handlers for buttons
document.getElementById("btn_copy").addEventListener("click", onClickCopy);
document.getElementById("btn_start").addEventListener("click", onClickStartGame);
document.getElementById("btn_leave").addEventListener("click", onClickLeave);
document.getElementById("btn_open_settings").addEventListener("click", onClickOpenSettings);
document.getElementById("btn_close_settings").addEventListener("click", onClickCloseSettings);

const ws = new WebSocket(WEBSOCKET_IP);
let moving_to_game = false;


ws.addEventListener("open", () =>{
    let message = {method:METHODS.RECONNECT, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
})
ws.addEventListener("close", () =>{
    console.log("Connection closed :(");
})
ws.addEventListener("message", ({data}) =>{
    const playload = JSON.parse(data);

    console.log(playload);
    
    if(playload.method == METHODS.LOBBY_INFO){
        show_lobby(playload);
    }
    else if(playload.method == METHODS.ENTERING_GAME){
        moving_to_game = true;
        window.location.replace(geturl("game.html"));
    }
    else if(playload.method == METHODS.GAME_STATE){
        //We are in game!
        window.location.replace(geturl("game.html"));
    }
    else if(playload.method == METHODS.START_ERROR){
        console.log("Cant start the game");
    }
    else{
        //Unknow method message
        console.log("Unknow method message");                
    }
})
window.addEventListener("beforeunload", ()=>{
    if(!moving_to_game){
        let message = {method:METHODS.QUIT, session_id:sessionStorage.getItem(SESSION_ID)}
        ws.send(JSON.stringify(message));
    }
})


function onClickCopy(){
    let invite_url = document.getElementById("lobby_id_invite");

    invite_url.select();
    invite_url.setSelectionRange(0, 99999); //For mobile

    //Copy the text inside the text field
    //window.navigator.clipboard.writeText(invite_url.value);
    document.execCommand('copy');
    
    let tooltiptext =  document.querySelector(".tooltiptext");
    tooltiptext.style.animation = "copy 2s";
    tooltiptext.addEventListener("animationend", () =>{tooltiptext.style.removeProperty("animation")});
}

function onClickStartGame(){
    let message = {method:METHODS.START, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickLeave(){
    window.location.replace(geturl("index.html"));
}

function show_lobby(playload){
    //Show the lobby code
    document.getElementById("lobby_id").innerHTML = playload.lobby_id;

    //Updates the lobby code for copy link
    document.getElementById("lobby_id_invite").value = geturl("index.html") + "?lobby=" + playload.lobby_id;

    //Show players quantity
    document.getElementById("players_quantity").innerHTML = "Players (" + playload.users.length + "/" + MAX_PLAYERS + ")";

    show_players(playload.users, playload.owner);
}
function show_players(players, owner){
    let lobby_players = document.getElementById("lobby_players");

    //Eliminates the players from the list
    lobby_players.textContent = ''; 

    //Use DocumentFragment for performance, do not create elemet and node and then appendChild
    //in a for loop because the DOM is refreshed every time.
    const fragment = document.createDocumentFragment();

    for(let id = 0; id < players.length; id++){
        let container = document.createElement("div");
        container.classList.add("player_container");
        container.style.backgroundColor =  players[id].color; //change this
        container.innerHTML = `
            <img id="img_user" src="../resources/img_user.png"> 
            <h5>${players[id].name}</h5>
        `;
        //container.appendChild(document.createTextNode(player.name));
        fragment.appendChild(container);
    }
    lobby_players.appendChild(fragment);

    //Enable the start button only for the owner
    if(owner){
        document.getElementById("btn_start").disabled = false;
    }
}
function onClickOpenSettings(){
    document.querySelector(".lobby_modal_container").classList.add("show");
}
function onClickCloseSettings(){
    document.querySelector(".lobby_modal_container").classList.remove("show");
    document.querySelector(".lobby_modal_container").classList.add("hide");
}


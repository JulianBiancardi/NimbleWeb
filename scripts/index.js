import {ERROR_NAME, METHODS, SUCCESS, SESSION_ID, WEBSOCKET_IP, MAX_NAME_LENGTH, LOBBY_LENGTH,  geturl, TESTING} from './constants.js';


document.getElementById("lobby_name_join").setAttribute("maxlength", LOBBY_LENGTH);
document.getElementById("player_name_join").setAttribute("maxlength", MAX_NAME_LENGTH);
document.getElementById("player_name_create").setAttribute("maxlength", MAX_NAME_LENGTH);
setLobby();

//Handlers for buttons
document.getElementById("btn_join").addEventListener("click", onClickJoin);
document.getElementById("btn_create").addEventListener("click", onClickCreate);


const ws = new WebSocket(WEBSOCKET_IP);

ws.addEventListener("open", () =>{
    let message = {method:METHODS.UUID};
    ws.send(JSON.stringify(message));
})
ws.addEventListener("close", () =>{
    console.log("Connection closed :(");
})
ws.addEventListener("message", ({data}) =>{
    const playload = JSON.parse(data);

    if(TESTING){
        console.log(playload);
    }
    
    if(playload.method == METHODS.UUID){
        sessionStorage.setItem(SESSION_ID, playload.session_id);
    }
    else if(playload.method == METHODS.ENTERING_LOBBY){
        window.location.replace(geturl("lobby.html"));
    }
    else if(playload.method == METHODS.GAME_STATE){
        //We are in game!
        window.location.replace(geturl("game.html"));
    }
    else if(playload.method == METHODS.JOIN_ERROR || playload.method == METHODS.CREATE_ERROR){
        showError(playload.description);
    }
    else{
        //Unknow method message
        console.log("Unknow method message");
    }
})


function setLobby(){
    //View if the lobby parametter is presetn in URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const lobby_code = urlParams.get('lobby')
    document.getElementById("lobby_name_join").value = lobby_code;
}

function showError(message){
    document.getElementById("error_message").innerHTML = message;
    document.querySelector(".error_container").style.display = 'block';

    //Disable the loaders only if it is active
    let loaders = document.querySelectorAll(".loader");
    [...loaders].forEach(function(loader) {
        if(loader.style.display === "block"){
            loader.style.display = "none";
        }
    });
    return;
}

function onClickJoin(){
    document.getElementById("loader_join").style.display = 'block';
    let lobby_name = document.getElementById("lobby_name_join").value;
    let player_name = document.getElementById("player_name_join").value;
    
    if(player_name === ""){
        showError(ERROR_NAME);
        return;
    }

    let message = {method:METHODS.JOIN, lobby_id:lobby_name.toUpperCase(), name:player_name, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickCreate(){
    document.getElementById("loader_create").style.display = 'block';
    let player_name = document.getElementById("player_name_create").value;

    if(player_name === ""){
        showError(ERROR_NAME);
        return;
    }

    let message = {method:METHODS.CREATE, name:player_name, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}


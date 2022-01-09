import {ERROR_NAME, METHODS, SUCCESS, SESSION_ID, WEBSOCKET_IP, MAX_NAME_LENGTH, LOBBY_LENGTH, LOBBY_PAGE} from './constants.js';


document.getElementById("lobby_name_join").setAttribute("maxlength", LOBBY_LENGTH);
document.getElementById("player_name_join").setAttribute("maxlength", MAX_NAME_LENGTH);
document.getElementById("player_name_create").setAttribute("maxlength", MAX_NAME_LENGTH);
setLobby();

//Handlers for buttons
document.getElementById("btn_join").addEventListener("click", onClickJoin);
document.getElementById("btn_create").addEventListener("click", onClickCreate);

const ws = new WebSocket(WEBSOCKET_IP);

ws.addEventListener("open", () =>{
})
ws.addEventListener("close", () =>{
    console.log("Connection closed :(");
})
ws.addEventListener("message", ({data}) =>{
    const obj_message = JSON.parse(data);
    console.log(obj_message);
    if(obj_message.method == METHODS.SESSION_SHARE){
        sessionStorage.setItem(SESSION_ID, obj_message.session_id);
    }else if(obj_message.method == METHODS.OPERATION_STATUS){
        if(obj_message.status == SUCCESS){
            window.location.replace(LOBBY_PAGE);
        }else{
            showError(obj_message.description);
        }
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

    let loader = document.querySelector(".loader");
    //Disable the loader only if it is active
    if(loader.style.display === "block"){
        loader.style.display = "none";
    }

    return;
}

function onClickJoin(){
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
    document.querySelector(".loader").style.display = 'block';
    let player_name = document.getElementById("player_name_create").value;

    if(player_name === ""){
        showError(ERROR_NAME);
        return;
    }

    let message = {method:METHODS.CREATE, name:player_name, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}


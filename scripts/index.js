import {ERROR_NAME, METHODS, SUCCESS, SESSION_ID, WEBSOCKET_IP, MAX_NAME_LENGTH, LOBBY_LENGTH} from './constants.js';


document.getElementById("lobby_name_join").setAttribute("maxlength", LOBBY_LENGTH);
document.getElementById("player_name_join").setAttribute("maxlength", MAX_NAME_LENGTH);
document.getElementById("player_name_create").setAttribute("maxlength", MAX_NAME_LENGTH);

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
            window.location.href = "lobby.html";
        }else{
            document.getElementById("join_error").innerHTML = obj_message.description;
            document.getElementById("create_error").innerHTML = obj_message.description;
        }
    }
})


function isValidName(name){
    return (name.trim != "");
}


function onClickJoin(){
    console.log("Join the lobby...");
    let lobby_name = document.getElementById("lobby_name_join").value;
    let player_name = document.getElementById("player_name_join").value;

    
    if(!isValidName(player_name)){
        document.getElementById("join_error").innerHTML = ERROR_NAME;
        return;
    }

    let message = {method:METHODS.JOIN, lobby_id:lobby_name, name:player_name, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickCreate(){
    console.log("Creating the lobby...");
    let player_name = document.getElementById("player_name_create").value;

    if(!isValidName(player_name)){
        document.getElementById("create_error").innerHTML = ERROR_NAME;
        return;
    }

    let message = {method:METHODS.CREATE, name:player_name, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}


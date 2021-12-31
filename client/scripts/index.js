const ws = new WebSocket("ws://3.129.207.140:8080/nimble");

ws.addEventListener("open", () =>{
    console.log("We are connected in login page");
})

ws.addEventListener("message", ({data}) =>{
    const obj_message = JSON.parse(data);
    console.log(obj_message);
    if(obj_message.method == "session_share"){
        sessionStorage.setItem("session_id", obj_message.session_id);
        console.log(sessionStorage.getItem("session_id"));
    }else if(obj_message.method == "operation_status"){
        if(obj_message.status == "success"){
            window.location.href = "lobby.html";
        }else{
            document.getElementById("join_error").innerHTML = obj_message.description;
            document.getElementById("create_error").innerHTML = obj_message.description;
        }
    }
})

ws.addEventListener("close", () =>{
    console.log("Connection closed :(");

})


function isValidName(name){
    return (name.trim != "" && name.length > 4);
}

function join_lobby(){
    console.log("Join the lobby...");
    let lobby_name = document.getElementById("lobby_name_join").value;
    let player_name = document.getElementById("player_name_join").value;

    
    if(!isValidName(player_name)){
        document.getElementById("join_error").innerHTML = "Not valid player name";
        return;
    }

    let message = {method:"join", lobby_id:lobby_name, name:player_name, session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}

function create_lobby(){
    console.log("Creating the lobby...");
    let player_name = document.getElementById("player_name_create").value;

    if(!isValidName(player_name)){
        document.getElementById("create_error").innerHTML = "Not valid player name";
        return;
    }

    let message = {method:"create", name:player_name, session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}


function btn_create_status(player_name_input){
    let btn_create = document.getElementById("btn_create");
    btn_create.disable = isValidName(player_name_input.value);
}


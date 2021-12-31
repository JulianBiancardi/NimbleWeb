const ws = new WebSocket("ws://3.129.207.140:8080/nimble");

ws.addEventListener("open", () =>{
    console.log("Al lobby pete");
    let message = {method:"reconnect", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
    message = {method:"lobby_info", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
})

ws.addEventListener("message", ({data}) =>{
    const obj_message = JSON.parse(data);
    console.log(obj_message);
    if(obj_message.method == "session_share"){
        if(!sessionStorage.getItem("session_id")){
            window.location.href = "index.html";
        }else{
            console.log("no capo yo ya tengo mi llave");
        }
    }
    else if(obj_message.method == "lobby_info"){
        sessionStorage.setItem("player_id", obj_message.player_number);
        document.getElementById("lobby_id").innerHTML = obj_message.lobby_id;
        show_players(obj_message.users);
    }
    else if(obj_message.method == "operation_status"){
        if(obj_message.status == "success"){
            window.location.href = "game.html";
        }else{
            console.log("Error start the game");
        }
    }
})

ws.addEventListener("close", () =>{
    console.log("Connection closed :(");

})


function onClickStartGame(){
    let message = {method:"start", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}


function show_players(players){
    let lobby_players = document.getElementById("lobby_players");
    lobby_players.textContent = ''; //Eliminates the players from the list
    players.forEach(player => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(player.name));
        lobby_players.appendChild(li);
    });
}


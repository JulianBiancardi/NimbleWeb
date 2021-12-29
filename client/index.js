const ws = new WebSocket("ws://3.129.207.140:8080/nimble");

ws.addEventListener("open", () =>{
    console.log("We are connected");
})

ws.addEventListener("message", ({data}) =>{
    const obj_message = JSON.parse(data);
    //_show_lobby(obj_message.id, obj_message.users);
    console.log(obj_message);
})


function join_lobby(){
    let lobby_name = document.getElementById("in_lobby_name_join").value;
    let player_name = document.getElementById("in_player_name_join").value;
    let message = {method:"join", lobby_name:lobby_name, name:player_name};
    ws.send(JSON.stringify(message));
}

function create_lobby(){
    console.log("Creating the lobby...");
    let player_name = document.getElementById("in_player_name_create").value;
    let message = {method:"create", name:player_name};
    ws.send(JSON.stringify(message));
}

function start_game(){
    console.log("Stating the game...");
    let message = {method:"start"};
    ws.send(message);
}

/*
function _show_lobby(id, users){
    let lobby_players = document.getElementById("lobby_players");
    document.getElementById("lobby_id").innerHTML = "Lobby id: " + id;
    document.getElementById("lobby_number_players").innerHTML = "Players (" + users.length + ")";

    users.forEach(element => {
        let listitem = document.createElement("li");
        let text = document.createTextNode(element.name);
        listitem.appendChild(text);
        lobby_players.appendChild(listitem)
    });

}*/

const ws = new WebSocket("ws://3.129.207.140:8080/nimble");

ws.addEventListener("open", () =>{
    console.log("In the game");
    let message = {method:"reconnect", session_id:sessionStorage.getItem("session_id")};
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
    }else if(obj_message.method == "reconnect"){
        let message = {method:"game_state", session_id:sessionStorage.getItem("session_id")};
        ws.send(JSON.stringify(message));
    }else if(obj_message.method == "game_state"){
        update_game(obj_message.game);
    }
})

ws.addEventListener("close", () =>{
    console.log("Connection closed :(");
})

function onClickDeck1(){
    let message = {method:"play", play_from:"hand", play_to:"0", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}
function onClickDeck2(){
    let message = {method:"play", play_from:"hand", play_to:"1", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}
function onClickDeck3(){
    let message = {method:"play", play_from:"hand", play_to:"2", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}

function onClickDiscard(){
    let message = {method:"discard", session_id:sessionStorage.getItem("session_id")};
    ws.send(JSON.stringify(message));
}

function update_game(game_state){
    document.getElementById("player_name").innerHTML = sessionStorage.getItem("player_name");
    let hand_card = game_state.players[0].hand_card;
    document.getElementById("hand_card").innerHTML = hand_card.outer_color + "(" + hand_card.inner_color + ")";

    for(let i = 0; i < game_state.decks_board.length ;i++){
        let deck_board = document.getElementById("deck_board" + (i + 1));
        let deck_board_info = game_state.decks_board[i].top_card;
        deck_board.textContent = deck_board_info.outer_color + "(" + deck_board_info.inner_color + ")";
    }
}


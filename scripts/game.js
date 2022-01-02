import { METHODS, PLAYER_ID, SESSION_ID, WEBSOCKET_IP, FROM_HAND} from './constants.js';

//Handlers for buttons
document.getElementById("btn_deckboard1").addEventListener("click", onClickDeck1);
document.getElementById("btn_deckboard2").addEventListener("click", onClickDeck2);
document.getElementById("btn_deckboard3").addEventListener("click", onClickDeck3);
document.getElementById("btn_discard").addEventListener("click", onClickDiscard);


const ws = new WebSocket(WEBSOCKET_IP);

ws.addEventListener("open", () =>{
    let message = {method:METHODS.RECONNECT, session_id:sessionStorage.getItem(SESSION_ID)};
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
    }else if(obj_message.method == METHODS.RECONNECT){
        let message = {method:METHODS.GAME_STATE, session_id:sessionStorage.getItem(SESSION_ID)};
        ws.send(JSON.stringify(message));
    }else if(obj_message.method == METHODS.GAME_STATE){
        update_game(obj_message.game, obj_message.users);
    }else if(obj_message.method == METHODS.WINNER){
        show_winner(obj_message);
    }
})



function onClickDeck1(){
    let message = {method:METHODS.PLAY, play_from:FROM_HAND, play_to:"0", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}
function onClickDeck2(){
    let message = {method:METHODS.PLAY, play_from:FROM_HAND, play_to:"1", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}
function onClickDeck3(){
    let message = {method:METHODS.PLAY, play_from:FROM_HAND, play_to:"2", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickDiscard(){
    let message = {method:METHODS.DISCARD, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function update_game(game_state, users){

    //Get the player name
    let player_id = sessionStorage.getItem(PLAYER_ID);
    document.getElementById("player_name").innerHTML = users[player_id].name + "(" + game_state.players[player_id].total_cards + ")";

    //Get the player hand
    let hand_card = game_state.players[player_id].hand_card;
    document.getElementById("hand_card").style.backgroundColor = hand_card.outer_color;
    document.getElementById("hand_card").firstElementChild.style.backgroundColor = hand_card.inner_color;

    //Show the decks board
    for(let i = 0; i < game_state.decks_board.length ;i++){
        let deck_board = document.getElementById("btn_deckboard" + (i + 1));
        let deck_board_info = game_state.decks_board[i].top_card;
        deck_board.style.backgroundColor = deck_board_info.outer_color;
        deck_board.firstElementChild.style.backgroundColor = deck_board_info.inner_color;
    }

    //Show the other players
    let players_versus = document.getElementById("players_versus");
    players_versus.textContent = '';
    let fragment = document.createDocumentFragment();
    for(let id = 0; id < users.length ;id++){
        if(id != player_id){
            let versus_hand_card = game_state.players[id].hand_card;
            let container = document.createElement("div");
            container.classList.add("player_container");
            container.innerHTML = `
                <h2>${users[id].name} (${game_state.players[id].total_cards})</h2>
                <img id="img_user" src="../resources/img_user.png"> 
            `;
            fragment.appendChild(container);  
        }
    }
    players_versus.appendChild(fragment);
}

function show_winner(message){
    document.getElementById("winner_name").innerHTML = message.user.name + " won the game!";
}


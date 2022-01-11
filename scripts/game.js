import { METHODS, PLAYER_ID, SESSION_ID, WEBSOCKET_IP, FROM_HAND, SEG, getColor, getCardColor, ERROR, INDEX_PAGE, LOBBY_PAGE} from './constants.js';

//Handlers for buttons
document.getElementById("btn_deckboard1").addEventListener("click", onClickDeck1);
document.getElementById("btn_deckboard2").addEventListener("click", onClickDeck2);
document.getElementById("btn_deckboard3").addEventListener("click", onClickDeck3);
document.getElementById("btn_discard").addEventListener("click", onClickDiscard);
document.getElementById("btn_move_deck").addEventListener("click", onClickMoveToDeck);


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
            window.location.replace("index.html");
        }else{
            console.log("no capo yo ya tengo mi llave");
        }
    }else if(obj_message.method == METHODS.RECONNECT){
        let message = {method:METHODS.GAME_STATE, session_id:sessionStorage.getItem(SESSION_ID)};
        ws.send(JSON.stringify(message));
    }else if(obj_message.method == METHODS.GAME_STATE){
        update_game(obj_message.game, obj_message.users);
    }else if(obj_message.method == METHODS.OPERATION_STATUS && obj_message.status == ERROR){
        showErrorPlay();
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

function onClickMoveToDeck(){
    console.log("Do something");
}

function renderCard(card_view, card_info){
    card_view.style.backgroundColor = getCardColor(card_info.outer_color)[0];
    card_view.firstElementChild.style.backgroundColor = getCardColor(card_info.inner_color)[0];
    card_view.style.borderWidth = "8px";
    card_view.style.borderStyle = "solid";
    card_view.style.borderColor = getCardColor(card_info.outer_color)[1];
}

function update_game(game_state, users){

    //Get the player name
    let player_id = sessionStorage.getItem(PLAYER_ID);
    document.getElementById("total_cards").innerHTML = game_state.players[player_id].total_cards;
    document.getElementById("player_name").innerHTML = users[player_id].name;

    //Get the player hand
    let hand_card = game_state.players[player_id].hand_card;
    let hand_card_view =  document.getElementById("hand_card");

    renderCard(hand_card_view,hand_card);

    //Update the deck hand color player
    document.getElementById("deck_hand").style.backgroundColor = getColor(player_id);

    //Show the decks board
    for(let i = 0; i < game_state.decks_board.length ;i++){
        let deck_board = game_state.decks_board[i].top_card;
        let deck_board_view = document.getElementById("btn_deckboard" + (i + 1));
        renderCard(deck_board_view,deck_board);
    }

    //Show the other players
    let players_versus = document.querySelector(".players_versus_container");
    players_versus.textContent = '';
    let fragment = document.createDocumentFragment();
    for(let id = 0; id < users.length ;id++){
        if(id != player_id){
            let container = document.createElement("div");
            container.classList.add("player_container");
            container.innerHTML = `
                <div class="player">
                    <h2 id="player_name">${users[id].name} (${game_state.players[id].total_cards})</h2>
                    <img class="img_user" src="../resources/img_user.png"> 
                    <div class="cards_container">
                        <div class="card" id="versus_hand_card${id}">
                            <span class="inner_container" id="bad"></span>
                        </div>
                    </div>
                </div>
            `;
            fragment.appendChild(container); 
            let versus_hand_card = game_state.players[id].hand_card;
            let versus_hand_card_view = fragment.getElementById("versus_hand_card" + id);
            renderCard(versus_hand_card_view,versus_hand_card);
        }
    }
    players_versus.appendChild(fragment);
}

function showErrorPlay(){
    let hand_card_view =  document.getElementById("hand_card");
    hand_card_view.style.animation = "shake 0.5s";
    hand_card_view.addEventListener("animationend", () =>{hand_card_view.style.removeProperty("animation")});
}

function show_winner(message){
    document.getElementById("modal_player_name").innerHTML = message.user.name + " Won the game!";
    document.getElementById("modal_player_name").style.color = getColor(PLAYER_ID);
    document.getElementById("btn_deckboard1").disabled = true;
    document.getElementById("btn_deckboard2").disabled = true;
    document.getElementById("btn_deckboard3").disabled = true;
    document.getElementById("btn_discard").disabled = true;
    setTimeout(() =>{ window.location.replace("lobby.html"); }, 5 * SEG);
    document.querySelector(".modal_container").classList.add("show");
}


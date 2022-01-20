import { METHODS, PLAYER_ID, SESSION_ID, WEBSOCKET_IP,  getColor, getCardColor, CONTROLS, geturl, ENDING_GAME_MSG_TIME} from './constants.js';

if(!sessionStorage.getItem(SESSION_ID)){
    console.log("missing session id");
    window.location.replace(geturl("index.html"));
}

//Handlers for buttons
document.getElementById("btn_deckboard1").addEventListener("click", onClickDeck1);
document.getElementById("btn_deckboard2").addEventListener("click", onClickDeck2);
document.getElementById("btn_deckboard3").addEventListener("click", onClickDeck3);
document.getElementById("btn_discard").addEventListener("click", onClickDiscard);
document.getElementById("btn_move_deck").addEventListener("click", onClickMoveToDeck);
//Controls
document.addEventListener('keypress', (event) => {
    var name = event.key;
    switch(name.toLowerCase()){
        case CONTROLS.DECK1:
            onClickDeck1();
            break;
        case CONTROLS.DECK2:
            onClickDeck2();
            break;
        case CONTROLS.DECK3:
            onClickDeck3();
            break;
        case CONTROLS.DISCARD:
            onClickDiscard();
            break;
        case CONTROLS.RECOVER:
            onClickMoveToDeck();
            break;
    }
}, false);


const ws = new WebSocket(WEBSOCKET_IP);
let moving_to_lobby = false;

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
    
    if(playload.method == METHODS.GAME_STATE){
        update_game(playload);
    }
    else if(playload.method == METHODS.INVALID_MOVE_ERROR){
        showErrorPlay();
    }
    else if(playload.method == METHODS.WINNER){
        moving_to_lobby = true;
        show_winner(playload);
    }
    else if(playload.method == METHODS.TIE){
        //show_ending_message("No one won you piece of losers!")
    }
    else{
        //Unknow method message
        console.log("Unknow method message"); 
    }
})
window.addEventListener("beforeunload", ()=>{
    if(!moving_to_lobby){
        let message = {method:METHODS.QUIT, session_id:sessionStorage.getItem(SESSION_ID)}
        ws.send(JSON.stringify(message));
    }
})


function onClickDeck1(){
    let message = {method:METHODS.PLAY, play_to:"0", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}
function onClickDeck2(){
    let message = {method:METHODS.PLAY, play_to:"1", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}
function onClickDeck3(){
    let message = {method:METHODS.PLAY, play_to:"2", session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickDiscard(){
    let message = {method:METHODS.DISCARD, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickMoveToDeck(){
    let message = {method:METHODS.RECOVER, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function renderCard(card_view, card_info){
    card_view.style.backgroundColor = getCardColor(card_info.outer_color)[0];
    card_view.firstElementChild.style.backgroundColor = getCardColor(card_info.inner_color)[0];
    card_view.style.borderWidth = "8px";
    card_view.style.borderStyle = "solid";
    card_view.style.borderColor = getCardColor(card_info.outer_color)[1];
}

function update_game(playload){
    let game = playload.game;
    let users = playload.users;
    let player_id = playload.player_number;
    
    //Get the player name
    document.getElementById("total_cards").innerHTML = game.players[player_id].total_cards;
    document.getElementById("player_name").innerHTML = users[player_id].name;

    //Get the player hand
    let hand_card = game.players[player_id].discard_deck.top_card;
    let hand_card_view =  document.getElementById("hand_card");

    renderCard(hand_card_view,hand_card);

    //Update the deck hand color player
    document.getElementById("deck_hand").style.backgroundColor = users[player_id].color;

    //Show the decks board
    for(let i = 0; i < game.decks_board.length ;i++){
        let deck_board = game.decks_board[i].top_card;
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
                    <h2 id="player_name">${users[id].name} (${game.players[id].total_cards})</h2>
                    <img class="img_user" src="../resources/img_user.png"> 
                    <div class="cards_container">
                        <div class="card" id="versus_hand_card${id}">
                            <span class="inner_container" id="bad"></span>
                        </div>
                    </div>
                </div>
            `;
            fragment.appendChild(container); 
            let versus_hand_card = game.players[id].discard_deck.top_card;
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
    setTimeout(() =>{ window.location.replace(geturl("lobby.html")); }, ENDING_GAME_MSG_TIME);
    document.querySelector(".modal_container").classList.add("show");
}



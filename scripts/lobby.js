import { METHODS, SESSION_ID, WEBSOCKET_IP, geturl, MAX_PLAYERS, CONTROLS, CONTROLS_IDS} from './constants.js';

// document.addEventListener("load", () => {
    let id = sessionStorage.getItem(SESSION_ID);
    if(!id){
        console.log("missing session id");
        window.location.replace(geturl("index.html"));
    }
    let deck1Control = sessionStorage.getItem(CONTROLS_IDS.DECK1);
    if(deck1Control == null){
        deck1Control = CONTROLS.DECK1;
    }
    console.log("Seteando el nuevo deck1 a " + deck1Control);
    sessionStorage.setItem(CONTROLS_IDS.DECK1,  deck1Control);
    
    let deck2Control = sessionStorage.getItem(CONTROLS_IDS.DECK2);
    if(deck2Control == null){
        deck2Control = CONTROLS.DECK2;
    }
    sessionStorage.setItem(CONTROLS_IDS.DECK2,  deck2Control);
    
    let deck3Control = sessionStorage.getItem(CONTROLS_IDS.DECK3);
    if(deck3Control == null){
        deck3Control = CONTROLS.DECK3;
    }
    sessionStorage.setItem(CONTROLS_IDS.DECK3,  deck3Control);
    
    let discardControl = sessionStorage.getItem(CONTROLS_IDS.DISCARD);
    if(discardControl == null){
        discardControl = CONTROLS.DISCARD;
    }
    sessionStorage.setItem(CONTROLS_IDS.DISCARD,  discardControl);
    
    let recoverControl = sessionStorage.getItem(CONTROLS_IDS.RECOVER);
    if(recoverControl == null){
        recoverControl = CONTROLS.RECOVER;
    }
    sessionStorage.setItem(CONTROLS_IDS.RECOVER,  recoverControl);

// })


//Handlers for buttons
document.getElementById("btn_copy").addEventListener("click", onClickCopy);
document.getElementById("btn_start").addEventListener("click", onClickStartGame);
document.getElementById("btn_leave").addEventListener("click", onClickLeave);
document.getElementById("btn_open_settings").addEventListener("click", onClickOpenSettings);
document.getElementById("btn_close_settings").addEventListener("click", onClickCloseSettings);
document.getElementById("deck_1_key_input").setAttribute("maxlength", 1);
document.getElementById("deck_2_key_input").setAttribute("maxlength", 1);
document.getElementById("deck_3_key_input").setAttribute("maxlength", 1);
document.getElementById("discard_key_input").setAttribute("maxlength", 1);
document.getElementById("recover_key_input").setAttribute("maxlength", 1);

const ws = new WebSocket(WEBSOCKET_IP);
let moving_to_game = false;


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
    
    if(playload.method == METHODS.LOBBY_INFO){
        show_lobby(playload);
    }
    else if(playload.method == METHODS.ENTERING_GAME){
        moving_to_game = true;
        window.location.replace(geturl("game.html"));
    }
    else if(playload.method == METHODS.GAME_STATE){
        //We are in game!
        window.location.replace(geturl("game.html"));
    }
    else if(playload.method == METHODS.START_ERROR){
        console.log("Cant start the game");
    }
    else{
        //Unknow method message
        console.log("Unknow method message");                
    }
})
window.addEventListener("beforeunload", ()=>{
    if(!moving_to_game){
        let message = {method:METHODS.QUIT, session_id:sessionStorage.getItem(SESSION_ID)}
        ws.send(JSON.stringify(message));
    }
})


function onClickCopy(){
    let invite_url = document.getElementById("lobby_id_invite");

    invite_url.select();
    invite_url.setSelectionRange(0, 99999); //For mobile

    //Copy the text inside the text field
    //window.navigator.clipboard.writeText(invite_url.value);
    document.execCommand('copy');
    
    let tooltiptext =  document.querySelector(".tooltiptext");
    tooltiptext.style.animation = "copy 2s";
    tooltiptext.addEventListener("animationend", () =>{tooltiptext.style.removeProperty("animation")});
}

function onClickStartGame(){
    let message = {method:METHODS.START, session_id:sessionStorage.getItem(SESSION_ID)};
    ws.send(JSON.stringify(message));
}

function onClickLeave(){
    window.location.replace(geturl("index.html"));
}

function show_lobby(playload){
    //Show the lobby code
    document.getElementById("lobby_id").innerHTML = playload.lobby_id;

    //Updates the lobby code for copy link
    document.getElementById("lobby_id_invite").value = geturl("index.html") + "?lobby=" + playload.lobby_id;

    //Show players quantity
    document.getElementById("players_quantity").innerHTML = "Players (" + playload.users.length + "/" + MAX_PLAYERS + ")";

    show_players(playload.users, playload.owner);
}
function show_players(players, owner){
    let lobby_players = document.getElementById("lobby_players");

    //Eliminates the players from the list
    lobby_players.textContent = ''; 

    //Use DocumentFragment for performance, do not create elemet and node and then appendChild
    //in a for loop because the DOM is refreshed every time.
    const fragment = document.createDocumentFragment();

    for(let id = 0; id < players.length; id++){
        let container = document.createElement("div");
        container.classList.add("player_container");
        container.style.backgroundColor =  players[id].color; //change this
        container.innerHTML = `
            <img id="img_user" src="../resources/img_user.png"> 
            <h5>${players[id].name}</h5>
        `;
        //container.appendChild(document.createTextNode(player.name));
        fragment.appendChild(container);
    }
    lobby_players.appendChild(fragment);

    //Enable the start button only for the owner
    if(owner){
        document.getElementById("btn_start").disabled = false;
    }
}
function onClickOpenSettings(){
    console.log("Abriendo settings");
    document.querySelector(".lobby_modal_container").classList.add("show");
    document.getElementById("deck_1_key_input").value = sessionStorage.getItem(CONTROLS_IDS.DECK1);
    document.getElementById("deck_2_key_input").value = sessionStorage.getItem(CONTROLS_IDS.DECK2);
    document.getElementById("deck_3_key_input").value = sessionStorage.getItem(CONTROLS_IDS.DECK3);
    document.getElementById("discard_key_input").value = sessionStorage.getItem(CONTROLS_IDS.DISCARD);
    document.getElementById("recover_key_input").value = sessionStorage.getItem(CONTROLS_IDS.RECOVER);
}
function onClickCloseSettings(){
    console.log("Cerrando settings");
    changeControl(document.getElementById("deck_1_key_input").value, CONTROLS_IDS.DECK1);
    changeControl(document.getElementById("deck_2_key_input").value, CONTROLS_IDS.DECK2);
    changeControl(document.getElementById("deck_3_key_input").value, CONTROLS_IDS.DECK3);
    changeControl(document.getElementById("discard_key_input").value, CONTROLS_IDS.DISCARD);
    changeControl(document.getElementById("recover_key_input").value, CONTROLS_IDS.RECOVER);
    document.querySelector(".lobby_modal_container").classList.remove("show");
}

export function changeControl(newVal, key){
    newVal = newVal.toLowerCase();
    if(newVal.length != 1){
        console.log("Invalid newVal: " + newVal);     
        return false;
    }
    sessionStorage.setItem(key, newVal);
    return true;
}
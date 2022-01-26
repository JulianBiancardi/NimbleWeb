// WebSocket constants
const SERVER_IP = "3.129.207.140:8080/nimble";
const WEBSOCKET_HEADER = "ws://";
export const WEBSOCKET_IP = WEBSOCKET_HEADER + SERVER_IP;


//Pages constants
export const TESTING = true;
export function geturl(file_name){
    if(!TESTING){
        let end = file_name.indexOf(".html");
        return window.location.origin + "/" + file_name.substring(0, end);
    }
    return file_name;
}


export const MAX_NAME_LENGTH = 12;
export const LOBBY_LENGTH = 4;
export const SEG = 1000;
export const ENDING_GAME_MSG_TIME = 5 * SEG;

//User data constants (for sessionStorage)
export const SESSION_ID = "session_id";
export const PLAYER_ID = "player_id";


//Methods constants
export const METHODS = {
    UUID: "uuid",
    SESSION_SHARE: "session_share",
    RECONNECT: "reconnect",
    CREATE: "create",
    JOIN: "join",
    ENTERING_LOBBY: "entering_lobby",
    CREATE_ERROR: "create_error",
    JOIN_ERROR: "join_error",

    LOBBY_INFO: "lobby_info",
    START: "start",
    QUIT: "quit",
    ENTERING_GAME: "entering_game",
    START_ERROR: "start_error",
   

    GAME_STATE: "game_state",
    PLAY: "play",
    DISCARD: "discard",
    WINNER: "winner",
    RECOVER: "recover",
    TIE: "tie",
    INVALID_MOVE_ERROR: "invalid_move_error",
}

//Status constants
export const SUCCESS = "success";
export const ERROR = "error";
export const ERROR_NAME = "Not valid player name";
export const ERROR_LOBBY = "Lobby name is not valid";


//Game constants
export const MAX_PLAYERS = 4;

export function changeControl(newVal, id){
    if(newVal.length != 1){
        console.log("Invalid newVal: " + newVal);     
        return false;
    }
    switch(id){
        case "deck1":
            CONTROLS.DECK1 = newVal;
            console.log("Deck1: " + newVal);      
        break;
        case "deck2":
            CONTROLS.DECK2 = newVal;
            console.log("Deck2: " + newVal);     
        break;
        case "deck3":
            CONTROLS.DECK3 = newVal;
            console.log("Deck3: " + newVal);     
        break;
        case "discard":
            CONTROLS.DISCARD = newVal;
            console.log("Discard: " + newVal);     
        break;
        case "recover":
            CONTROLS.RECOVER = newVal;
            console.log("Recover: " + newVal);     
        break;
        default:
            console.log("Default :(");     
            return false;
    }
    return true;
}

export var CONTROLS = {
    DECK1: "1",
    DECK2: "2",
    DECK3: "3",
    DISCARD: "l",
    RECOVER: "j",
}

export function getColor(id){
    let player_color;
    switch(parseInt(id)){
        case 0: 
            player_color = '#ab3a45';
            break;
        case 1: 
            player_color =  '#582642';
            break;
        case 2: 
            player_color =  '#4e7971';
            break;
        case 3: 
            player_color =  '#dd844c';
            break;
        default: 
            player_color =  '#4e7971';
            break;
    }
    return player_color;
}

const card_colors = {
    // KEY: [background, border]
    'null': ['#5b5b5b', '#3b3b3b'],
    'RED': ['#ab3a45', '#772b30'],
    'BLUE': ['#bfe1e6', '#82a8ad'],
    'GREEN': ['#4e7971', '#2f5858'],
    'YELLOW':['#e8d2b3', '#d8b68b'],
    'PURPLE': ['#582642', '#2e1e2a'],
    'ORANGE': ['#dd844c' , '#b55b38'],
}

export function getCardColor(key){
    return [card_colors[key][0], card_colors[key][1]];
}

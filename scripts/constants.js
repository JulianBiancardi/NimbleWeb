// WebSocket constants
const SERVER_IP = "3.129.207.140:8080/nimble";
const WEBSOCKET_HEADER = "ws://";
export const WEBSOCKET_IP = WEBSOCKET_HEADER + SERVER_IP;


//Pages constants
const HTTP_HEADER = "http://";
const DOMAIN_ARG = "nimble.jpmiceli.com.ar";
export const INDEX_PAGE = HTTP_HEADER + DOMAIN_ARG;
export const LOBBY_PAGE = HTTP_HEADER + DOMAIN_ARG + "/html/lobby.html";
export const GAME_PAGE = HTTP_HEADER + DOMAIN_ARG + "/html/game.html";

export const MAX_NAME_LENGTH = 12;
export const LOBBY_LENGTH = 4;


//User data constants (for sessionStorage)
export const SESSION_ID = "session_id";
export const PLAYER_ID = "player_id";


//Methods constants
export const METHODS = {
    SESSION_SHARE: "session_share",
    OPERATION_STATUS: "operation_status",
    CREATE: "create",
    JOIN: "join",
    START: "start",
    RECONNECT: "reconnect",
    LOBBY_INFO: "lobby_info",
    GAME_STATE: "game_state",
    PLAY: "play",
    DISCARD: "discard",
    WINNER: "winner",
}
 
export const FROM_HAND = "hand";
export const FROM_DISCARD = "discard";

//Status constants
export const SUCCESS = "success";
export const ERROR = "error";
export const ERROR_NAME = "Not valid player name";
export const ERROR_LOBBY = "Lobby name is not valid";
export const ERROR_START = "Error start game";


//Time constants
export const SEG = 1000;


//Game constants
const players_colors = {
    0: '#ab3a45',
    1: '#582642',
    2: '#4e7971',
    3: '#dd844c',
}
export function getColor(id){
    return players_colors[id];
}

const card_colors = {
    // KEY: [background, border]
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

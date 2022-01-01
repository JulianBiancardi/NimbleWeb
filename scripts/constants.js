// WebSocket constants
const SERVER_IP = "3.129.207.140:8080/nimble";
const WEBSOCKET_HEADER = "ws://";
export const WEBSOCKET_IP = WEBSOCKET_HEADER + SERVER_IP;


//Pages constants
const HTTP_HEADER = "http//";
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
export const ERROR_NAME = "Not valid player name";
export const ERROR_START = "Error start game";

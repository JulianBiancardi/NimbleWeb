import { useState } from "react";
import { useHistory } from "react-router-dom";
import { SESSION_ID, WEBSOCKET_IP } from "./constants";
import PlayerList from "./PlayerList";

//const ws = new WebSocket(WEBSOCKET_IP); 

const Lobby = () => {
    const history = useHistory();
    const[lobby_code,setLobbyCode] = "AAAA";
    const [players, setPlayers] = useState([
    ]);
/*
    ws.addEventListener("open", () =>{
        console.log("We are in lobby page, and we are connected!");
    });

    ws.addEventListener("message", ({data}) =>{
        let obj_message = JSON.parse(data);
        console.log(obj_message);
        if(obj_message.method == "session_share"){
            sessionStorage.setItem(SESSION_ID, obj_message.session_id);
            console.log(sessionStorage.getItem(SESSION_ID));
        }
    });
*/
    function onClickStart(){
        console.log("Trying to start the game");
        history.push("/game");
    }


    return (  
        <div>
            <label>Lobby code: </label>
            <PlayerList players={players}/>
            <button onClick={onClickStart}>Start</button>
            <br></br>
            <input type="text" id="reconnect_id"></input>
        </div>
    );
}
 
export default Lobby;
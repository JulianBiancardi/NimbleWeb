import { useHistory } from "react-router-dom";
import { SESSION_ID, WEBSOCKET_IP } from "./constants";

const ws = new WebSocket(WEBSOCKET_IP); 

const Login = () => {
    const history = useHistory();

    ws.addEventListener("open", () =>{
        console.log("We are in login page, and we are connected!");
    });

    ws.addEventListener("message", ({data}) =>{
        let obj_message = JSON.parse(data);
        console.log(obj_message);
        if(obj_message.method == "session_share"){
            sessionStorage.setItem(SESSION_ID, obj_message.session_id);
            console.log(sessionStorage.getItem(SESSION_ID));
        }
    });

    function onClickCreateLobby(){
        let name = document.getElementById("create_player_name").value;
        console.log(name + " trying to creat lobby...");
        let message = {name: name, method: "create", lobby_id:"AAAA", session_id:sessionStorage.getItem(SESSION_ID)};
        ws.send(JSON.stringify(message));
        ws.close();
        history.push("/lobby");
    };

    function onClickJoin(){
        let name = document.getElementById("join_player_name").value;
        let lobby = document.getElementById("join_lobby_name").value;
        console.log(name + " trying to join lobby: " + lobby);
        let message = {name: name, method: "join", lobby_id: lobby, id:sessionStorage.getItem(SESSION_ID)};
        ws.send(JSON.stringify(message));
    };

    return ( 
        <div>
            <div className="join_settings">
                <label>Lobby name</label>
                <input type="text" id="join_lobby_name" maxLength="10"></input>
                <label>Player name</label>
                <input type="text" id="join_player_name" maxLength="10"></input>
                <button onClick={onClickJoin}>Join</button>
            </div>
            <div className="create_settings">
                <label>Player name</label>
                <input type="text" id="create_player_name" maxLength="10"></input>
                <select name="Number of players">
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>
                <button onClick={onClickCreateLobby}>Create</button>                
            </div>
        </div>
    );
}
 
export default Login;
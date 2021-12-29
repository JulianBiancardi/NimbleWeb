import { useHistory } from "react-router-dom";


const Login = () => {
    const history = useHistory();

    function onClickCreateLobby(){
        let name = document.getElementById("create_player_name").value;
        console.log(name + " trying to creat lobby...");
        let message = {name: name, method: "create"};
        //this.ws.send(JSON.stringify(message));
        history.push("/lobby");
    };

    function onClickJoin(){
        let name = document.getElementById("join_player_name").value;
        let lobby = document.getElementById("join_lobby_name").value;
        console.log(name + " trying to join lobby: " + lobby);
        let message = {name: name, method: "join", lobby_name: lobby};
        //this.ws.send(JSON.stringify(message));
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
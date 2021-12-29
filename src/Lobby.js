import { useState } from "react";
import PlayerList from "./PlayerList";


const Lobby = () => {
    const [players, setPlayers] = useState([
        {name:"Chiki", id:1},
        {name:"Juampi", id:2}
    ]);

    return (  
        <div>
            <label>Lobby code: </label>
            <PlayerList players={players}/>
        </div>
    );
}
 
export default Lobby;

const PlayerList = (props) => {
    const players = props.players;
    return ( 
        <div className="players">
            {players.map((player) => (
                <div className="player_info" key={player.id}>
                    <h5>{player.name}</h5>
                </div>
            ))}
        </div>
     );
}
 
export default PlayerList;
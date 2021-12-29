import './constants.js';
import './styles/App.css';
import NavBar from './NavBar.js';
import Login from './Login';
import Lobby from './Lobby';
import NotFoundPage from './NotFound.js';

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { WEBSOCKET_IP } from './constants.js';


const App = () => {
  let ws = new WebSocket(WEBSOCKET_IP); 

  ws.addEventListener("open", () =>{
    console.log("We are connected");
  });

  ws.addEventListener("message", ({data}) =>{
      const obj_message = JSON.parse(data);
      console.log(obj_message);
  });

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/lobby">
            <Lobby />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import './constants.js';
import './styles/App.css';
import NavBar from './NavBar.js';
import Login from './Login';
import Lobby from './Lobby';
import NotFoundPage from './NotFound.js';

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Game from './Game.js';

const App = () => {

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
          <Route exact path="/game">
            <Game />
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

import { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
// import Home from '../home/Home';
import SetupPage from '../setup/SetupPage';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';


class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Header/>
          <main>

            <Switch>
              <Route path="/" exact={true}
                render={routerProps => (
                  // <Home {...routerProps}/>
                  <Redirect to="/setup"/>
                )}
              />

              <Route path="/setup" exact={true}
                render={routerProps => (
                  <SetupPage {...routerProps} />
                )}
              />

              <Route path="/ballot/:id"
                render={routerProps => (
                  <div>Implement a page for id {routerProps.match.params.id}</div>
                )}
              />

              <Route path="/about"
                render={routerProps => (
                  <div>Implement a page for id {routerProps.match.params.id}</div>
                )}
              />

              <Redirect to="/" />

            </Switch>
          </main>
          <Footer/>
        </Router>
      </div>
    );
  }

}

export default App;

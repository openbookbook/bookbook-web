import { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
// import Home from '../home/Home';
import SetupPage from '../pages/setup/SetupPage';
import BallotPage from '../pages/ballot/BallotPage';
import AboutPage from '../pages/about/AboutPage';
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
          <Header />
          <main>

            <Switch>
              <Route path="/" exact={true}
                render={routerProps => (
                  // <Home {...routerProps}/>
                  <Redirect to="/setup" />
                )}
              />

              <Route path="/setup" exact={true}
                render={routerProps => (
                  <SetupPage {...routerProps} />
                )}
              />

              <Route path="/ballot/:id"
                render={routerProps => (
                  <BallotPage {...routerProps} />
                )}
              />

              <Route path="/about"
                render={routerProps => (
                  <AboutPage {...routerProps} />
                )}
              />

              <Redirect to="/" />

            </Switch>
          </main>
          <Footer />
        </Router>
      </div>
    );
  }

}

export default App;

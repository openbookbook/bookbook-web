import React from 'react';
import { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
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
              <Route path="/" exact render={() => <Redirect to="/setup" />} />
              <Route path="/setup" exact render={() => <SetupPage />} />
              <Route path="/ballot/:id" render={(routerProps) => <BallotPage {...routerProps} />} />
              <Route path="/about" render={() => <AboutPage />} />
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

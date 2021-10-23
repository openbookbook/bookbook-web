import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default class Home extends Component {
  
  render() {
    return (
      <div className="Home">
        <h2>Welcome to Book Book</h2>

        <Link to='/setup'>Setup Page</Link>
      </div>
    );
  }

}
import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {

  render() { 
    return (
      <header className="Header">

        <h1>bookbook</h1>
        
        <nav>
          <Link to="/about">About</Link>
          <Link to="/">Home</Link>
        </nav>
      </header>
    );
  }

}
 
export default Header;
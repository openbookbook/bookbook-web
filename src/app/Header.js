import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return <header className="Header">
    <Link to="/">
      <h1>bookbook</h1>
    </Link>

    <nav>
      <Link to="/about">About</Link>
      <Link to="/">Home</Link>
    </nav>
  </header>;
};
 
export default Header;

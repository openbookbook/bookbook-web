import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="Home">
      <h2>Welcome to Book Book</h2>

      <Link to='/setup'>Setup Page</Link>
    </div>
  );
};

export default Home;

import React from 'react';
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

const MemoizedHomePage = React.memo(Home);

export default Home;
export { MemoizedHomePage };

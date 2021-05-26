import { Component } from 'react';
import './AboutPage.css';


export default class AboutPage extends Component {

  render() {
    return (
      <div className="AboutPage panel">
        <p>bookbook helps create a more equitable process when choosing a new book for your club. Bookbook allows a club admin to create a ballot where users can vote in a ranked choice voting system.</p>
        <br></br>
        <h3>what our creators are currently reading:</h3>
        <p>Annaleigh:</p>
        <p>Austin: The Autistic Brain by Temple Grandin</p>
        <p>Clem:</p>
        <p>Culi:</p>
        <p>Daniella:</p>
      </div>
    );
  }

}
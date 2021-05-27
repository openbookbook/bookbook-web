import { Component } from 'react';
import './AboutPage.css';


export default class AboutPage extends Component {

  render() {
    return (
      <div className="AboutPage panel">
        <p>bookbook helps create a more equitable process when choosing a new book for your club. bookbook allows a club admin to create a ballot where users can vote in a ranked choice voting system.</p>
        <br></br>
        <h3>what our creators were reading before starting alchemy :</h3>
        <p>Annaleigh: 2001 Space Odyssey by Arthur C. Clarke</p>
        <p>Austin: The Autistic Brain by Temple Grandin</p>
        <p>Clem: Delirious New York by Rem Koolhaas</p>
        <p>Culi: Arts of Living on a Damaged Planet</p>
        <p>Daniella: No room for books only beans by B. Earl Nickels</p>
      </div>
    );
  }

}
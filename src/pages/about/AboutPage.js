import './AboutPage.css';

const AboutPage = () => {
  return <div className="AboutPage page">
    <h3 className="page-title">about</h3>
    <span className="panel-title">description</span>
    <div className="panel">
      <p>bookbook helps create a more equitable process when choosing a new book for your club</p>
      <br/>
      <p>bookbook allows a club admin to create a ballot where users can vote in a ranked choice voting system</p>
    </div>

    <span className="panel-title">creators</span>
    <div className="panel">
      <p>Annaleigh: 2001 Space Odyssey by Arthur C. Clarke</p>
      <p>Austin: The Autistic Brain by Temple Grandin</p>
      <p>Clem: Delirious New York by Rem Koolhaas</p>
      <p>Culi: Arts of Living on a Damaged Planet</p>
      <p>Daniella: No room for books only beans by B. Earl Nickels</p>
    </div>
  </div>;
};

export default AboutPage;

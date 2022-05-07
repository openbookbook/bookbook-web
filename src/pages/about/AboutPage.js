import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return <div className="AboutPage page">
    <h3 className="page-title">about</h3>
    <span className="panel-title">description</span>
    <div className="panel">
      <p><strong>bookbook</strong> helps create a more equitable process when choosing a new book for your club</p>
      <br/>
      <p>
        It allows a club to create a ballot where members can vote for their next book using their preferred voting method. We do not require a sign up or store any cookies or other data besides what is submitted.
      </p>
    </div>

    <span className="panel-title">creators: what we're reading</span>
    <div className="panel">
      <p>Annaleigh: 2001 Space Odyssey by Arthur C. Clarke</p>
      <p>Austin: The Autistic Brain by Temple Grandin</p>
      <p>Clem: Delirious New York by Rem Koolhaas</p>
      <p>Culi: Arts of Living on a Damaged Planet</p>
      <p>Daniella: No room for books only beans by B. Earl Nickels</p>
    </div>
  </div>;
};

const MemoizedAboutPage = React.memo(AboutPage);

export default AboutPage;
export { MemoizedAboutPage };

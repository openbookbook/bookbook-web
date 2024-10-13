import React from 'react';
import './AboutPage.css';

const AboutPage = () => (
  <div className="AboutPage page">
    <h3 className="page-title">about</h3>
    <span className="panel-title">description</span>
    <div className="panel">
      <p>
        <strong>bookbook</strong> is democratizes the process of selecting a new book for your book club.
      </p>
      <br/>
      <p>
        It allows a club to create a ballot where members can vote for their next book using their preferred voting method.
      </p>
      <p>
        We do <strong>not</strong> require a sign up or store any cookies or other data besides what is submitted. This system is inspired by services like <a href="https://www.when2meet.com/?27006387-2sgje">When2Meet</a> and our respect for your privacy.
      </p>
    </div>

    <span className="panel-title">creators: what we're reading</span>
    <div className="panel">
      <p>Annaleigh: 2001 Space Odyssey by Arthur C. Clarke</p>
      <br />
      <p>Austin: The Autistic Brain by Temple Grandin</p>
      <br />
      <p>Clem: Delirious New York by Rem Koolhaas</p>
      <br />
      <p>Culi: Arts of Living on a Damaged Planet</p>
      <br />
      <p>Daniella: No room for books only beans by B. Earl Nickels</p>
    </div>
  </div>
);

export default AboutPage;

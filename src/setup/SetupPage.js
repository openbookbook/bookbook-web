import { Component } from 'react';
import './SetupPage.css';

export default class SetupPage extends Component {
  
  render() {
    return (
      <div className="SetupPage">
        <form>
          <fieldset>
            <label>
              <span>Ballot Name:</span>
              <input name="ballot" required={true}/>
            </label>
            <label>
              <span>Admin Code:</span>
              <input name="admin"/>
            </label>
          </fieldset>
          <fieldset>
            <label>
              <span>Require Voting Code</span>
              <input/>
            </label>
          </fieldset>
          <fieldset>
            {/* <BookSuggest/> */}
          </fieldset>
        </form>
        
      </div>
    );
  }

}
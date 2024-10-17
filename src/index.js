import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Pass a function to log performance measurements or send them to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(/* console.log */);

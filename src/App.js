import React from 'react';
import Chat from './Chat';  // Import your Chat component
import './App.css';  // Import your main styles
import './MoreInfo.css';

function App() {
  return (
    <div className="App">
      <h1>CampusShout!</h1>
      <Chat />
      <div id="more-info" className="more-info">
        <h2>About the Developer</h2>
        <p>Hi, I'm Gavin McAllister, the developer behind CampusShout. I created this platform to give college students a space to voice their thoughts and connect with others who understand their experiences. If you like what you see, feel free to support the project!</p>
        <a href="https://www.paypal.com/donate" target="_blank" rel="noopener noreferrer" className="donate-button">
          Donate to the Project
        </a>
      </div>
    </div>
  );
}

export default App;

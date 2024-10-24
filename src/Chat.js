import React, { useState } from 'react';
import './Chat.css';

function Chat() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Replace with your actual OpenAI API key

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const newMessage = { role: 'user', content: userInput };
    setMessages([...messages, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4', // Replace with the model you're using
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message;

      setMessages([...messages, newMessage, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with the API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <p>{message.content}</p>
          </div>
        ))}
        {isLoading && <div className="message assistant"><p>...</p></div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userColor, setUserColor] = useState(localStorage.getItem("userColor") || "");

  // Load posts from localStorage on initial render
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // Generate a random color for a new user
  const generateColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  // Set username and assign a color if one is not assigned
  const handleSetUsername = () => {
    if (username.trim()) {
      const color = userColor || generateColor();
      setUserColor(color);
      localStorage.setItem("username", username);
      localStorage.setItem("userColor", color);
    }
  };

  const handlePostSubmit = () => {
    if (newPost.trim() && username.trim()) {
      const newPostObj = { content: newPost, user: username, color: userColor };
      setPosts([newPostObj, ...posts]);
      setNewPost(""); // Clear input field
    }
  };

  return (
    <div className="App">
      {/* Username setup section */}
      {!username && (
        <div className="username-setup">
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your username"
          />
          <button onClick={handleSetUsername}>Set Username</button>
        </div>
      )}

      {/* Post feed */}
      <div className="feed">
        {posts.map((post, index) => (
          <div key={index} className="post" style={{ backgroundColor: post.color }}>
            <strong>{post.user}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      {/* Post input field at the bottom */}
      <div className="post-input">
        <input 
          type="text" 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)} 
          placeholder="Write something..." 
          disabled={!username} // Disable until username is set
        />
        <button onClick={handlePostSubmit} disabled={!username}>Post</button>
      </div>
    </div>
  );
}

export default App;
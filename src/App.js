import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/database';

// Firebase configuration (replace with your own config details)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userColor, setUserColor] = useState(localStorage.getItem("userColor") || "");

  // Load posts from Firebase
  useEffect(() => {
    const postsRef = database.ref("posts");
    postsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const loadedPosts = data ? Object.values(data) : [];
      setPosts(loadedPosts.reverse());
    });
  }, []);

  // Generate a random color for a new user
  const generateColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  // Handle username setup
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
      const newPostObj = { content: newPost, user: username, color: userColor, timestamp: Date.now() };
      database.ref("posts").push(newPostObj); // Save to Firebase
      setNewPost(""); // Clear input field
    }
  };

  return (
    <div className="App">
      {/* Username setup section */}
      {!localStorage.getItem("username") && (
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
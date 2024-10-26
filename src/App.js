import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


// Firebase configuration (replace with your own config details)
const firebaseConfig = {

  apiKey: "AIzaSyBVwXe8C15YyrvziNl-QbeH0HpxotxKvfg",

  authDomain: "campusshout.firebaseapp.com",

  projectId: "campusshout",

  storageBucket: "campusshout.appspot.com",

  messagingSenderId: "322098972024",

  appId: "1:322098972024:web:512933aba9c2f8ada3f48d",

  measurementId: "G-5L1JBVRHPZ"

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
  const [cooldown, setCooldown] = useState(false);

  // Load posts from Firebase
  useEffect(() => {
    const postsRef = database.ref("posts");
    postsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const loadedPosts = data ? Object.values(data) : [];
      setPosts(loadedPosts.reverse()); // Show newest posts at the bottom
    });
    return () => postsRef.off();
  }, []);

  // Generate a random color for a new user
  const generateColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

  // Set username and color
  const handleSetUsername = () => {
    if (username.trim()) {
      const color = userColor || generateColor();
      setUserColor(color);
      localStorage.setItem("username", username);
      localStorage.setItem("userColor", color);
    }
  };

  // Handle post submission with cooldown
  const handlePostSubmit = () => {
    if (newPost.trim() && username.trim() && !cooldown) {
      const newPostObj = { content: newPost, user: username, color: userColor, timestamp: Date.now() };
      database.ref("posts").push(newPostObj);
      setNewPost(""); // Clear input field
      setCooldown(true); // Start cooldown

      // Reset cooldown after 15 seconds
      setTimeout(() => setCooldown(false), 15000);
    }
  };

  return (
    <div className="App">
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

      <div className="feed">
        {posts.map((post, index) => (
          <div
            key={index}
            className={`post ${post.user === username ? 'sent' : 'received'}`} 
            style={{ backgroundColor: post.color }}
          >
            <strong>{post.user}</strong>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <div className="post-input">
        <input 
          type="text" 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)} 
          placeholder={cooldown ? "Please wait 15 seconds..." : "Write something..."} 
          disabled={!username || cooldown}
        />
        <button onClick={handlePostSubmit} disabled={!username || cooldown}>Post</button>
      </div>
    </div>
  );
}

export default App;
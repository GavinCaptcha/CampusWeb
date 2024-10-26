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
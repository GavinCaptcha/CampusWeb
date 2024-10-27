import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import Post from './Post'; // Import the Post component

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
  const [viewTopVoted, setViewTopVoted] = useState(false);

  useEffect(() => {
    const postsRef = database.ref("posts");
    postsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      const loadedPosts = data
        ? Object.entries(data).map(([id, val]) => ({
            id,
            ...val,
            likedBy: Array.isArray(val.likedBy) ? val.likedBy : [], // Ensure likedBy is always an array
          }))
        : [];
      setPosts(loadedPosts.reverse());
    });
    return () => postsRef.off();
  }, []);

  const generateColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

  const handleSetUsername = () => {
    if (username.trim()) {
      const color = userColor || generateColor();
      setUserColor(color);
      localStorage.setItem("username", username);
      localStorage.setItem("userColor", color);
    }
  };

  const handlePostSubmit = () => {
    if (newPost.trim() && username.trim() && !cooldown) {
      const newPostObj = { content: newPost, user: username, color: userColor, likedBy: [], timestamp: Date.now() };
      database.ref("posts").push(newPostObj);
      setNewPost("");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 15000);
    }
  };

  const handleLike = (postId, likedBy) => {
    const postRef = database.ref(`posts/${postId}`);
    const hasLiked = likedBy.includes(username);

    if (hasLiked) {
      // Remove user's like
      postRef.update({
        likedBy: likedBy.filter(user => user !== username)
      });
    } else {
      // Add user's like
      postRef.update({
        likedBy: [...likedBy, username]
      });
    }
  };

  const toggleViewTopVoted = () => {
    setViewTopVoted(!viewTopVoted);
  };

  const displayedPosts = viewTopVoted
    ? [...posts].sort((a, b) => b.likedBy.length - a.likedBy.length)
    : posts;

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={toggleViewTopVoted}>
          {viewTopVoted ? "View All Posts" : "View Top Voted"}
        </button>
      </div>

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
        {displayedPosts.map((post) => (
          <Post 
            key={post.id}
            post={post}
            isCurrentUser={post.user === username}
            onLike={handleLike}
            currentUser={username}
          />
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
import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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
  const [cooldown, setCooldown] = useState(false);
  const [viewTopVoted, setViewTopVoted] = useState(false); // Toggle for top voted posts

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
      const newPostObj = { content: newPost, user: username, color: userColor, likes: 0, timestamp: Date.now() };
      database.ref("posts").push(newPostObj);
      setNewPost(""); // Clear input field
      setCooldown(true); // Start cooldown

      // Reset cooldown after 15 seconds
      setTimeout(() => setCooldown(false), 15000);
    }
  };

  // Handle liking a post
  const handleLike = (postId, currentLikes) => {
    const postRef = database.ref(`posts/${postId}`);
    postRef.update({ likes: currentLikes + 1 });
  };

  // Toggle between main feed and top-voted view
  const toggleViewTopVoted = () => {
    setViewTopVoted(!viewTopVoted);
  };

  // Sort posts by likes for top-voted view
  const displayedPosts = viewTopVoted
    ? [...posts].sort((a, b) => b.likes - a.likes) // Sort by likes in descending order
    : posts;

  return (
    <div className="App">
      {/* Top tabs for toggling views */}
      <div className="tabs">
        <button onClick={toggleViewTopVoted}>
          {viewTopVoted ? "View All Posts" : "View Top Voted"}
        </button>
      </div>

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
        {displayedPosts.map((post, index) => (
          <div
            key={index}
            className={`post ${post.user === username ? 'sent' : 'received'}`} 
            style={{ backgroundColor: post.color }}
          >
            <strong>{post.user}</strong>
            <p>{post.content}</p>
            <div className="like-section">
              <button onClick={() => handleLike(post.timestamp, post.likes)}>
                👍 {post.likes || 0} Likes
              </button>
            </div>
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
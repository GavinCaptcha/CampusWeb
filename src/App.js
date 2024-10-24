import React, { useState } from 'react';
import Chat from './Chat';  // Import your Chat component
import './App.css';  // Import your main styles
import './MoreInfo.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setPosts([{ content: newPost, likes: 0, dislikes: 0, comments: [] }, ...posts]);
      setNewPost(""); // Clear input field
    }
  };

  return (
    <div className="App">
      <div className="post-input">
        <input 
          type="text" 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)} 
          placeholder="Write something..." 
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>
      
      <div className="feed">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
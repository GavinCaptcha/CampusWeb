import React, { useState } from 'react';

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
      {/* Post feed at the top */}
      <div className="feed">
        {posts.map((post, index) => (
          <div key={index} className="post">
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      {/* Input field at the bottom */}
      <div className="post-input">
        <input 
          type="text" 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)} 
          placeholder="Write something..." 
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>
    </div>
  );
}

export default App;
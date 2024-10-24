import React, { useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setNewPost([{ content: newPost, likes: 0, dislikes: 0, comments: [] }, ...posts]);
    }
  };

  return (
    <div className="App">
      <div className="post-input">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write Something..."
        />
        <button onClick={handlePostSubmit}Post/>
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

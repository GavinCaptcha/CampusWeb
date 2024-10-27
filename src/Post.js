import React from 'react';
import './Post.css';
import { FaHeart } from 'react-icons/fa';

const Post = ({ post, isCurrentUser, onLike, currentUser }) => {
  // Ensure likedBy is an array
  const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
  const hasLiked = likedBy.includes(currentUser);

  return (
    <div className={`post ${isCurrentUser ? 'sent' : 'received'}`} style={{ backgroundColor: post.color }}>
      <strong>{post.user}</strong>
      <p>{post.content}</p>
      <div className="like-section">
        <FaHeart 
          className={`heart ${hasLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id, likedBy)}
        />
        <span>{likedBy.length}</span>
      </div>
    </div>
  );
};

export default Post;
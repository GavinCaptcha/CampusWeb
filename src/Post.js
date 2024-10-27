import React from 'react';
import './Post.css';
import { FaHeart } from 'react-icons/fa';

const Post = ({ post, isCurrentUser, onLike }) => {
  return (
    <div className={`post ${isCurrentUser ? 'sent' : 'received'}`} style={{ backgroundColor: post.color }}>
      <strong>{post.user}</strong>
      <p>{post.content}</p>
      <div className="like-section">
        <FaHeart 
          className={`heart ${post.likedByUser ? 'liked' : ''}`}
          onClick={() => onLike(post.id, post.likes, post.likedByUser)}
        />
        <span>{post.likes || 0}</span>
      </div>
    </div>
  );
};

export default Post;
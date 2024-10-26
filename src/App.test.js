import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Inside the map function for rendering posts
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
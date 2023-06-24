import { useState } from 'react';
import axios from 'axios';

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
      user: blog.user.id,
    };
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    const result = await axios.put(
      '/api/blogs/' + blog.id,
      updatedBlog,
      config
    );
    console.log(result.data);
    setLikes(result.data.likes + 1);
  };

  const handleRemove = async () => {
    //alert the user
    if (window.confirm(`Remove ${blog.title}`)) {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete('/api/blogs/' + blog.id, config);
      window.location.reload();
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {likes}{' '}
            <button
              onClick={() => {
                handleLike();
              }}
            >
              like
            </button>
          </div>
          <div>added by {blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={() => handleRemove()}>remove</button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;

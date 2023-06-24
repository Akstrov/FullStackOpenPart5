import { React } from 'react';
import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({
  blogFormRef,
  user,
  setmessage,
  setmessageType,
  setBlogs,
  blogs,
  setshowMessage,
}) => {
  const [title, settitle] = useState('');
  const [author, setauthor] = useState('');
  const [url, seturl] = useState('');

  const handleCreate = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisibility();
    const blog = {
      title: title,
      author: author,
      url: url,
    };
    console.log('blog', blog);
    blogService.setToken(user.token);
    const createdBlog = await blogService.create(blog);
    createdBlog.user = {
      id: createdBlog.user,
      name: user.name,
      username: user.username,
    };
    console.log(createdBlog);
    setmessage(`a new blog ${createdBlog.title} by ${createdBlog.author}`);
    setshowMessage(true);
    setmessageType('success');
    setBlogs([...blogs, createdBlog]);
    setTimeout(() => {
      setshowMessage(false);
      setmessage('');
    }, 5000);
  };

  return (
    <>
      <h1>create new</h1>
      <form
        onSubmit={(event) => {
          handleCreate({
            title,
            author,
            url,
          });
          settitle('');
          setauthor('');
          seturl('');
          event.preventDefault();
        }}
      >
        <div>
          title:
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={({ target }) => {
              settitle(target.value);
            }}
          />
        </div>
        <div>
          author:
          <input
            name="author"
            id="author"
            value={author}
            onChange={({ target }) => {
              setauthor(target.value);
            }}
          />
        </div>
        <div>
          url:
          <input
            name="url"
            id="url"
            value={url}
            onChange={({ target }) => {
              seturl(target.value);
            }}
          />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default BlogForm;

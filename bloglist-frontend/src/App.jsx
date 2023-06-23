import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [user, setuser] = useState(null);
  const [author, setauthor] = useState('');
  const [title, settitle] = useState('');
  const [url, seturl] = useState('');
  const [message, setmessage] = useState('');
  const [showMessage, setshowMessage] = useState(false);
  const [messageType, setmessageType] = useState('');

  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    getBlogs();
  }, []);
  useEffect(() => {
    const user = window.localStorage.getItem('user');
    if (user) {
      setuser(JSON.parse(user));
    }
  }, []);

  const loginForm = () => {
    return (
      <>
        <h1>Log in to application</h1>
        {showMessage && <Notification message={message} type={messageType} />}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={({ target }) => {
                setusername(target.value);
              }}
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={({ target }) => {
                setpassword(target.value);
              }}
            />
          </div>
          <button>login</button>
        </form>
      </>
    );
  };
  const blogsList = () => {
    return (
      <div>
        <h2>blogs</h2>
        {showMessage && <Notification message={message} type={messageType} />}
        <div>
          {user.name} is logged in
          <button
            onClick={() => {
              window.localStorage.removeItem('user');
              setuser(null);
              blogService.setToken('');
            }}
          >
            Logout
          </button>
        </div>
        <h1>create new</h1>
        <form onSubmit={handleCreate}>
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
        <ul>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog}></Blog>
          ))}
        </ul>
      </div>
    );
  };

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      const user = await loginService.login({ username, password });
      if (!user) {
        setmessage('wrong username or password');
        setmessageType('error');
        setshowMessage(true);
        setTimeout(() => {
          setshowMessage(false);
        }, 5000);
        return;
      }
      setuser(user);
      setusername('');
      setpassword('');
      if (user) {
        blogService.setToken(user.token);
        setBlogs(await blogService.getAll());
        window.localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.log('error catched');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const blog = {
      title,
      author,
      url,
    };
    blogService.setToken(user.token);
    const createdBlog = await blogService.create(blog);
    setmessage(`a new blog ${createdBlog.title} by ${createdBlog.author}`);
    setshowMessage(true);
    setmessageType('success');
    setBlogs([...blogs, createdBlog]);
    settitle('');
    setauthor('');
    seturl('');
    setTimeout(() => {
      setshowMessage(false);
      setmessage('');
    }, 5000);
  };

  return (
    <div>
      {user ? (
        <>
          <h1>hello</h1>
          {blogsList()}
        </>
      ) : (
        loginForm()
      )}
    </div>
  );
};

export default App;

import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [user, setuser] = useState(null);
  const [message, setmessage] = useState('');
  const [showMessage, setshowMessage] = useState(false);
  const [messageType, setmessageType] = useState('');

  const blogFormRef = useRef();

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
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm
            blogFormRef={blogFormRef}
            setBlogs={setBlogs}
            user={user}
            blogs={blogs}
            setmessage={setmessage}
            setmessageType={setmessageType}
            setshowMessage={setshowMessage}
          ></BlogForm>
        </Togglable>

        <ul>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} user={user}></Blog>
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

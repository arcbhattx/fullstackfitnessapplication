import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './images/Scat.png';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (error) {
      console.error('There was an error logging in!', error);
      alert('either Username or Password does not match')
    }
  };

  const handleNavigate = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="login-container">
        <h1 className="red-heading">Welcome to Scat</h1>
        <h2>your personal strength and calorie tracker</h2>
        <img src={logo} alt="Logo" className="round-logo" />
        <h4>login below:</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <h4>or register here:</h4>
        <button onClick={handleNavigate}>Register</button>
      </div>
    </>
  );
}

export default Login;

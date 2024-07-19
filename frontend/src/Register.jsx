import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import your CSS file for styling

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user_age, setUserAge] = useState();
  const [user_body_weight, setUserBodyWeight] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', {
        username,
        password,
        user_age: parseInt(user_age, 10),
        user_body_weight: parseInt(user_body_weight, 10)
      });
      navigate('/login');
    } catch (error) {
      console.error('There was an error registering!', error);
      alert('There was an error registering!', error)
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="small-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="small-input"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Enter age"
            value={user_age}
            onChange={(e) => setUserAge(parseInt(e.target.value, 10))}
            className="small-input"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Enter body weight"
            value={user_body_weight}
            onChange={(e) => setUserBodyWeight(parseInt(e.target.value, 10))}
            className="small-input"
          />
        </div>
        <button type="submit" className="small-button">Register</button>
      </form>
    </div>
  );
}

export default Register;

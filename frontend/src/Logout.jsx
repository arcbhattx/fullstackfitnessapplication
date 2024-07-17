import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>Log out</button>
  );
}

export default Logout;

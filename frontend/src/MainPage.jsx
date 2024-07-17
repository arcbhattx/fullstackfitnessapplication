import React, { useState, useEffect } from "react";
import axios from "axios";
import ExerciseList from './ExerciseList';
import NutritionList from "./NutritionList";
import CreateExercise from './CreateExercise';
import CreateNutrition from "./CreateNutrition";
import Logout from './Logout';
import Login from './Login';
import Profile from "./Profile";
import './NavBar.css';
import './Modal.css';
import './LogoutButton.css'; // Import the new CSS file
import logo from './images/Scat.png';
import FetchSavedGraphs from "./FetchSavedGraphs";

function MainPage() {
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isLoggedin, setLoggedin] = useState(false);
  const [activeSection, setActiveSection] = useState('exercise');
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkLoggedIn();
    if (isLoggedin) {
      fetchProfile();
    }
  }, [isLoggedin]);

  const closeExerciseModal = () => {
    setIsExerciseModalOpen(false);
  };

  const openExerciseModal = () => {
    setIsExerciseModalOpen(true);
  };

  const closeNutritionModal = () => {
    setIsNutritionModalOpen(false);
  };

  const openNutritionModal = () => {
    setIsNutritionModalOpen(true);
  };

  const checkLoggedIn = () => {
    const token = localStorage.getItem('token');
    setLoggedin(token !== null && token !== undefined);
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'exercise':
        return (
          <>
            <ExerciseList />
            <button onClick={openExerciseModal}>Add Exercise</button>
            {isExerciseModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <CreateExercise />
                  <button onClick={closeExerciseModal}>Close</button>
                </div>
              </div>
            )}
            <p> *Please refresh page if visual not loaded correctly* </p>
            <FetchSavedGraphs />
          </>
        );
      case 'nutrition':
        return (
          <>
            <NutritionList />
            <button onClick={openNutritionModal}>Add New Goal</button>
            {isNutritionModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <CreateNutrition />
                  <button onClick={closeNutritionModal}>Close</button>
                </div>
              </div>
            )}
          </>
        );
      case 'profile':
        return (
          <>
            <Profile />
          </>
        );
      case 'logout':
        return (
          <>
            <Logout />
          </>
        );
      default:
        return null;
    }
  };

  if (!isLoggedin) {
    return (
      <>
        <p>Please log in to access this page.</p>
        <Login />
      </>
    );
  }

  return (
    <>
      <nav>
        <img src={logo} alt="Logo" className="logo" />
        <ul>
          <li className={activeSection === 'exercise' ? 'active' : ''} onClick={() => handleSectionChange('exercise')}><h4>Strength tracker</h4></li>
          <li className={activeSection === 'nutrition' ? 'active' : ''} onClick={() => handleSectionChange('nutrition')}><h4>Calorie Tracker</h4></li>
          <li className={activeSection === 'profile' ? 'active' : ''} onClick={() => handleSectionChange('profile')}><h4>Profile</h4></li>
          <li className={activeSection === 'logout' ? 'active' : ''} onClick={() => handleSectionChange('logout')}><h4>Log Out</h4></li>
        </ul>
      </nav>

      <div className="welcome-message">
          {username && <h3>Welcome, {username}</h3>}
        </div>

      <div className="main-content">
        {renderSection()}
      </div>
    </>
  );
}

export default MainPage;

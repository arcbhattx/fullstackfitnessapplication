import React from "react";
import { Link } from "react-router-dom";
import logo from './images/Scat.png';
import './Homepage.css'; // Import CSS file for styling

function Homepage() {
    return (
        <div className="homepage-container">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <div className="content-container">
                <h1>Welcome to Scat</h1>

                <p>This is a fitness tracker application designed to help track your strength and calories.</p>

                <div className="tracker-section">
                    <div className="tracker">
                        <h3>Strength Tracker</h3>
                        <ul>
                            <li>Track your lifting progress</li>
                            <li>Record one-rep maxes and relative strengths for each exercise</li>
                            <li>Give a detailed visual graph to visualize your progress</li>
                        </ul>
                    </div>
                    <div className="tracker">
                        <h3>Calorie Tracker</h3>
                        <ul>
                            <li>Log daily calorie intake</li>
                            <li>Set calorie goals</li>
                            <li>Monitor nutritional intake</li>
                        </ul>
                    </div>
                </div>

                <div className="button-container">
                    <Link to="/login" className="auth-button">
                        Login
                    </Link>
                    <span className="button-separator"></span>
                    <Link to="/register" className="auth-button">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Homepage;

import React, { useState } from 'react';
import axios from 'axios';
import './CreateNutrition.css'; // Assuming you have a CSS file for this component

const CreateNutrition = () => {
  const [formData, setFormData] = useState({
    calorie_goal: 0,
    date: ""
  });

  const { calorie_goal, date } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    console.log('Form Data:', formData);  // Debugging: log form data

    try {
      const response = await axios.post('http://localhost:5000/create_nutrition', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log("Response data:", response.data);
      setFormData({
        calorie_goal: 0,
        date: ""
      });
      window.location.reload(); // Refresh the page after successful submission
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="create-nutrition-container">
      <h2 className="create-nutrition-header">Create a Goal for today</h2>
      <form onSubmit={handleSubmit} className="create-nutrition-form">
        <div>
          <label className="create-nutrition-label">Calorie Goal</label>
          <input
            type="number"
            name="calorie_goal"
            value={calorie_goal}
            onChange={handleChange}
            className="create-nutrition-input"
            required
          />
        </div>
        <div>
          <label className="create-nutrition-label">Date</label>
          <input
            type="date" // Change input type to date
            name="date"
            value={date}
            onChange={handleChange}
            className="create-nutrition-input"
            required
          />
        </div>
        <button type="submit" className="create-nutrition-button">Add Goal</button>
      </form>
    </div>
  );
};

export default CreateNutrition;

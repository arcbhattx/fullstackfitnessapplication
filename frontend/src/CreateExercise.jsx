import React, { useState } from 'react';
import axios from 'axios';
import './CreateExercise.css'; 

const CreateExercise = () => {
  const [formData, setFormData] = useState({
    exercise_type: '',
    exercise_weight: null,
    reps: null,
    date: '',
    user_bodyweight: null
  });

  const { exercise_type, exercise_weight, reps, date, user_bodyweight } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    console.log('Form Data:', formData);  // Debugging: log form data

    try {
      const response = await axios.post('/create_exercise', formData, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log("Response data:", response.data);
      setFormData({
        exercise_type: '',
        exercise_weight: null,
        reps: null,
        date: '',
        user_bodyweight: null
      });
      window.location.reload();
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
      alert('Failed to create exercise');
    }
  };

  return (
    <div className="create-exercise-container">
      <h2>Create new Exercise to track it!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Exercise Type</label>
          <select
            name="exercise_type"
            value={exercise_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Exercise Type</option>
            <option value="bench">Bench</option>
            <option value="squat">Squat</option>
            <option value="deadlift">Deadlift</option>
          </select>
        </div>
        <div>
          <label>Exercise Weight</label>
          <input
            type="number"
            name="exercise_weight"
            value={exercise_weight}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Reps</label>
          <input
            type="number"
            name="reps"
            value={reps}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date" // Change input type to date
            name="date"
            value={date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>User Body Weight</label>
          <input
            type="number"
            name="user_bodyweight"
            value={user_bodyweight}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="create-exercise-button">Create Exercise</button>
      </form>
    </div>
  );
};

export default CreateExercise;

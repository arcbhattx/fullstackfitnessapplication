import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Make sure to import your CSS file

const ExerciseList = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('/exercises', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/delete_exercise/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(prevUser => ({
        ...prevUser,
        exercises: prevUser.exercises.filter(exercise => exercise.id !== userId)
      }));
      window.location.reload()
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='table-container'>
      <h3>Daily Strength Tracker</h3>
      <div className='tables'>
        {/* Main Exercise Table */}
        <table className='main-table'>
          <thead>
            <tr>
              <th>Exercise Type</th>
              <th>Exercise Weight</th>
              <th>Reps</th>
              <th>Date</th>
              <th>User Body Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.exercises && user.exercises.map((exercise, idx) => (
              <React.Fragment key={idx}>
                {exercise.exercise_data.map((data, index) => (
                  <tr key={`${idx}-${index}`}>
                    {index === 0 && (
                      <td rowSpan={exercise.exercise_data.length}>{exercise.exercise_type}</td>
                    )}
                    <td>{data.exercise_weight}</td>
                    <td>{data.reps}</td>
                    <td>{data.date}</td>
                    <td>{data.user_bodyweight}</td>
                    <td>
                      <button onClick={() => handleDelete(exercise.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {/* One Rep Max Table */}
        <table className='sub-table'>
          <thead>
            <tr>
              <th>One Rep Max</th>
            </tr>
          </thead>
          <tbody>
            {user.exercises && user.exercises.map((exercise, idx) => (
              <React.Fragment key={idx}>
                {exercise.exercise_data.map((data, index) => (
                  <tr key={`${idx}-${index}`}>
                    {index === 0 && (
                      <td rowSpan={exercise.exercise_data.length}>{data.one_rep_max}</td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {/* Relative Strength Table */}
        <table className='sub-table'>
          <thead>
            <tr>
              <th>Relative Strength</th>
            </tr>
          </thead>
          <tbody>
            {user.exercises && user.exercises.map((exercise, idx) => (
              <React.Fragment key={idx}>
                {exercise.exercise_data.map((data, index) => (
                  <tr key={`${idx}-${index}`}>
                    {index === 0 && (
                      <td rowSpan={exercise.exercise_data.length}>{data.exercise_strength}</td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseList;

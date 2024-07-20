import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css"; // Import the CSS file

function Profile() {
  const [age, setAge] = useState(0);
  const [bodyWeight, setBodyWeight] = useState(0);
  const [username, setUsername] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [newBodyWeight, setNewBodyWeight] = useState(0);
  const [newUsername, setNewUsername] = useState('');
  const [userId, setUserId] = useState(null); // New state for user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setAge(data.user_age);
        setBodyWeight(data.user_body_weight);
        setUsername(data.username);
        setNewAge(data.user_age);
        setNewBodyWeight(data.user_body_weight);
        setNewUsername(data.username);
        setUserId(data.user_id); // Set the user ID
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`http://localhost:5000/update_profile/${userId}`, {
        username: newUsername,
        user_age: newAge,
        user_body_weight: newBodyWeight
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(newUsername);
      setAge(newAge);
      setBodyWeight(newBodyWeight);
      setEditing(false);
      
      // Refresh the page after update
      window.location.reload();
    } catch (error) {
      setError(error.message);
      alert("username taken")
      window.location.reload(); 
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Username: {username}</p>
      <p>Age: {age}</p>
      <p>Body Weight: {bodyWeight}</p>
      <button onClick={() => setEditing(!editing)}>
        {editing ? 'Cancel' : 'Edit Profile'}
      </button>
      {editing && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Age: </label>
            <input
              type="number"
              value={newAge}
              onChange={(e) => setNewAge(parseInt(e.target.value, 10))}
            />
          </div>
          <div>
            <label>Body Weight: </label>
            <input
              type="number"
              value={newBodyWeight}
              onChange={(e) => setNewBodyWeight(parseInt(e.target.value, 10))}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
}

export default Profile;

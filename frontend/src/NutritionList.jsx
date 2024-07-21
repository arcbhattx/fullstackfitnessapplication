import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NutritionList.css';

const NutritionList = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemData, setItemData] = useState({
    food: '',
    calories: null,
    quantity: null,
    nutrition_id: null
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); 

      try {
        const response = await axios.get('/nutrition', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Fetched nutrition data:', response.data.nutritions);
        setNutritionData(response.data.nutritions); 
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (nutritionId) => {
    const token = localStorage.getItem('token'); 
    try {
      await axios.post('/create_item', {
        ...itemData,
        nutrition_id: nutritionId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedResponse = await axios.get('/nutrition', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNutritionData(updatedResponse.data.nutritions);
      setItemData({
        food: '',
        calories: 0,
        quantity: 1,
        nutrition_id: null
      });
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
      alert('Failed to add item');
    }
  };

  const handleCompleteChange = async (nutritionId, currentComplete) => {
    const token = localStorage.getItem('token');
  
    try {
      await axios.patch(`/update_complete/${nutritionId}`, {
        complete: !currentComplete ? "True" : "False"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setNutritionData(prevData =>
        prevData.map(nutrition =>
          nutrition.id === nutritionId ? { ...nutrition, complete: !currentComplete ? "True" : "False" } : nutrition
        )
      );
  
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/delete_item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNutritionData(prevData =>
        prevData.map(nutrition => ({
          ...nutrition,
          item_data: nutrition.item_data.filter(item => item.id !== itemId)
        }))
      );
    } catch (error) {
      console.error("Error occurred:", error.response ? error.response.data : error.message);
      alert('Failed to delete item');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="nutrition-list-container">
      <h2>Daily Calorie Tracker</h2>
      <h3> Log: </h3>
      {nutritionData.length === 0 ? (
        <p>No nutrition data available.</p>
      ) : (
        nutritionData.map((nutrition) => (
          <div key={nutrition.id} className="nutrition-item">
            <h4 className='makered'>Calorie Goal: {nutrition.calorie_goal}</h4>
            <h4 className='makered'>Date: {nutrition.date}</h4> 
            <h4 className='makered'> Total: {nutrition.total}</h4>
            <label>
              Complete:
              <input
                type="checkbox"
                checked={nutrition.complete === "True"}
                onChange={() => handleCompleteChange(nutrition.id, nutrition.complete === "True")}
              />
            </label>
            
            <h4>Items</h4>
            {nutrition.item_data.length === 0 ? (
              <p>No items available for this nutrition entry.</p>
            ) : (
              <table className="item-list-table">
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Calories</th>
                    <th>Quantity</th>
                    <th>Action</th> 
                  </tr>
                </thead>
                <tbody>
                  {nutrition.item_data.map(item => (
                    <tr key={item.id}>
                      <td>{item.food}</td>
                      <td>{item.calories}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                      </td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            <h4>Add Item</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem(nutrition.id);
              }}
            >
              <input
                type="text"
                name="food"
                placeholder="Food"
                value={itemData.food}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="calories"
                placeholder="Calories"
                value={itemData.calories}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={itemData.quantity}
                onChange={handleChange}
                required
              />
              <button type="submit">Add Item</button>
            </form>
          </div>
        ))
      )}
    </div>
  );
};

export default NutritionList;

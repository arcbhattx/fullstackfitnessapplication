import React, { useEffect, useState } from 'react';
import './FetchSavedGraphs.css'; // Import CSS file for styling

const FetchSavedGraphs = () => {
  const [graph, setGraph] = useState(null); 
  const [graphX, setGraphX] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch('/generate_update_exercise_graphs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const data = await response.json();
        console.log('Graph data:', data);
        setGraph(data.plot_one_rep_max);
        setGraphX(data.plot_relative_strength);
      } catch (error) {
        console.error('Error fetching graph:', error);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="graph-container">
      {graph ? <img src={`data:image/png;base64,${graph}`} alt="One Rep Max Graph" className="graph-image" /> : <p>Loading...</p>}
      {graphX ? <img src={`data:image/png;base64,${graphX}`} alt="Relative Strength Graph" className="graph-image" /> : <p>Loading...</p>}
    </div>
  );
};

export default FetchSavedGraphs;

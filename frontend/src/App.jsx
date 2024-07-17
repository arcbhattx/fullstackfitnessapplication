import { useState, useEffect } from 'react'
import './App.css'

import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import Homepage from './HomePage';



import Mainpage from './MainPage';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login/>}/>
            <Route path = "/" element = { <Homepage/>} /> 
            <Route path = "/Home" element = {<Mainpage/>}/>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
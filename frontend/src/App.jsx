import './App.css'

import Register from './Register';
import Login from './Login';
import Homepage from './HomePage';
import Mainpage from './MainPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login/>}/>
            <Route path = "/" element = { <Homepage/>} /> 
            <Route path = "/Home" element = {<Mainpage/>}/>
            <Route path="*" element={<Homepage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
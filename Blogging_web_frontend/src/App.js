import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './FrontEnd/Login';
import Register from './FrontEnd/Register';
import UserHome from './FrontEnd/UserHome';
import AdminHome from './FrontEnd/AdminHome';
import UserProfile from './FrontEnd/UserProfile';
import People from './FrontEnd/Following_User';
import AdminPeople from './FrontEnd/AdminPeople';
import './App.css';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/people" element={<People />} />
          <Route path="/adminpeople" element={<AdminPeople />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


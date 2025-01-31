import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import User from './User';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (i.e., token is stored in localStorage)
    const token = localStorage.getItem('authtoken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="App-nav">
            <ul>
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <li>
                  <Link to="/user">User Profile</Link>
                </li>
              )}
            </ul>
          </nav>
          <Routes>
            <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
              path="/user"
              element={isAuthenticated ? <User /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={
                <div className="App-welcome">
                  <h1>Welcome</h1>
                  <p>Please sign up or log in to continue.</p>
                </div>
              }
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file
import config from './config';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear token and set isAuthenticated to false when the component loads
        localStorage.removeItem('authtoken');
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        const userData = {
            email,
            password,
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}/auth/login`, userData);

            if (response.data.responseCode === 200) {
                setSuccess('Login successful!');
                // Store the token in localStorage
                localStorage.setItem('authtoken', response.data.token);
                setIsAuthenticated(true);
                navigate('/user');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="login-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default Login;

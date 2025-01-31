import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css'; // Import the CSS file
import config from './config';

const SignUp = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear token and set isAuthenticated to false when the component loads
        localStorage.removeItem('authtoken');
        setIsAuthenticated(false);
    }, [setIsAuthenticated]); // Include setIsAuthenticated in the dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password || !name) {
            setError('Please fill in all fields.');
            return;
        }

        const userData = {
            email,
            password,
            name,
        };

        try {
            const response = await axios.post(`${config.apiBaseUrl}/auth/signup`, userData);
            console.log(response.data.responseCode);
            if (response.data.responseCode === 200) {
                setSuccess('Registration successful!');
                setEmail('');
                setPassword('');
                setName('');
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="signup-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="signup-input"
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="signup-input"
                />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default SignUp;

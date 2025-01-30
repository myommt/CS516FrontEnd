import React, { useState } from 'react';
import axios from 'axios';
import config from './config'; // Adjust the import path as necessary
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            const response = await axios.post(`${config.apiBaseUrl}/signup`, userData);

            if (response.data.success) {
                setSuccess('Registration successful!');
                setEmail('');
                setPassword('');
                setName('');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
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

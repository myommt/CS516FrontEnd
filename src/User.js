import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './User.css'; // Import the CSS file
import config from './config';

const User = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authtoken');
            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get(`${config.apiBaseUrl}/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('User data:', response.data.data);
                setUserData(response.data.data);
                if (response.data.data.profileImage) {
                    setProfileImage(response.data.data.profileImage); // Set the profile image if available
                    console.log('Profile image URL:', response.data.data.profileImage);
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                setError('Failed to fetch user data.');
            }
        };

        fetchData();
    }, []);

    const handleImageUpload = async (e) => {
        setUploadError('');
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

            try {
                const token = localStorage.getItem('authtoken');
                const response = await axios.post(`${config.apiBaseUrl}/auth/upload-image`,
                    {
                        image: base64String
                    }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.data.responseCode === '200') {
                    setProfileImage(response.data.data.profileImage); // Update with the URL of the uploaded image
                    console.log('Uploaded image URL:', response.data.data.profileImage);
                } else {
                    setUploadError('Failed to upload image. Please try again.');
                }
            } catch (error) {
                console.log('Error uploading image:', error);
                setUploadError('An error occurred. Please try again later.');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleLogout = () => {
        localStorage.removeItem('authtoken');
        navigate('/login');
    };

    const handleImageError = () => {
        setImageError(true);
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-container">
            {userData ? (
                <div className="user-details">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    {profileImage && !imageError ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-image"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="profile-image fallback">?</div>
                    )}
                    <input type="file" onChange={handleImageUpload} />
                    {uploadError && <p className="error-message">{uploadError}</p>}
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default User;

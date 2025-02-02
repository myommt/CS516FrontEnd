import React, { useEffect, useState, useCallback } from 'react';
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
    const [imagePreview, setImagePreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileToUpload, setFileToUpload] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('authtoken');
        if (!token) {
            setError('No token found. Please log in.');
            navigate('/login');
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
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setShowModal(true);
            };
            reader.readAsDataURL(file);
            setFileToUpload(file);
        }
    };

    const handleImageUpload = async () => {
        setUploadError('');
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
                if (response.data.responseCode === 200) {
                    // Fetch the user data again to get the latest profile image
                    await fetchData();
                    // Reset the state to ensure modal doesn't pop up again
                    setShowModal(false);
                    setImagePreview(null);
                    setFileToUpload(null);
                } else {
                    setUploadError('Failed to upload image. Please try again.');
                }
            } catch (error) {
                console.log('Error uploading image:', error);
                setUploadError('An error occurred. Please try again later.');
            }
        };
        reader.readAsDataURL(fileToUpload);
    };

    const handleLogout = () => {
        localStorage.removeItem('authtoken');
        navigate('/login');
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleCancelUpload = () => {
        setShowModal(false);
        setImagePreview(null);
        setFileToUpload(null);
        document.querySelector("input[type='file']").value = ''; // Reset file input
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
                    <input type="file" onChange={handleFileChange} />
                    {uploadError && <p className="error-message">{uploadError}</p>}
                    <button onClick={handleLogout} className="logout-button">Log Out</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Image Preview:</h3>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="profile-image"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleImageUpload}>Confirm</button>
                            <button onClick={handleCancelUpload}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;

import React from 'react';
import useUser from '../hooks/useUser';

const UserPanel = ({ userId }) => {
    const { userData, loading, error, updateProfile } = useUser(userId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No user data available</div>;

    const handleProfileUpdate = async (updatedData) => {
        try {
            await updateProfile(updatedData);
            // Show success message or handle successful update
        } catch (err) {
            // Handle error
            console.error('Failed to update profile:', err);
        }
    };

    return (
        <div className="user-panel">
            <div className="user-info">
                <img 
                    src={userData.profile_picture || '/default-avatar.png'} 
                    alt={`${userData.firstname} ${userData.lastname}`} 
                    className="profile-picture"
                />
                <h2>{userData.firstname} {userData.lastname}</h2>
                <p>{userData.email}</p>
                {userData.nickname && <p>Nickname: {userData.nickname}</p>}
            </div>

            <div className="user-details">
                <div className="detail-item">
                    <span>Country:</span>
                    <span>{userData.country || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                    <span>City:</span>
                    <span>{userData.city || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                    <span>Phone:</span>
                    <span>{userData.phone_number || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                    <span>Theme:</span>
                    <span>{userData.Theme || 'Default'}</span>
                </div>
            </div>

            {/* Add more user panel content as needed */}
        </div>
    );
};

export default UserPanel;

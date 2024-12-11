import React from 'react';
import useUser from '../hooks/useUser';

const ProfileSidebar = ({ userId }) => {
    const { userData, loading, error, updateFavorites } = useUser(userId);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userData) return <div>No user data available</div>;

    const handleFavoritesUpdate = async (updatedFavorites) => {
        try {
            await updateFavorites(updatedFavorites);
            // Show success message or handle successful update
        } catch (err) {
            // Handle error
            console.error('Failed to update favorites:', err);
        }
    };

    return (
        <div className="profile-sidebar">
            <div className="favorites-section">
                <h3>Favorites</h3>
                <div className="favorite-item">
                    <span>Favorite Painter:</span>
                    <span>{userData.favorite_painter || 'Not specified'}</span>
                </div>
                <div className="favorite-item">
                    <span>Favorite Painting:</span>
                    <span>{userData.favorite_painting || 'Not specified'}</span>
                </div>
                <div className="favorite-item">
                    <span>Favorite Style:</span>
                    <span>{userData.favorite_painting_style || 'Not specified'}</span>
                </div>
                <div className="favorite-item">
                    <span>Favorite Technique:</span>
                    <span>{userData.favorite_painting_technique || 'Not specified'}</span>
                </div>
            </div>

            <div className="biography-section">
                <h3>Biography</h3>
                <p>{userData.biography || 'No biography available'}</p>
            </div>

            {userData.is_gallery && (
                <div className="gallery-section">
                    <h3>Gallery Information</h3>
                    <div className="gallery-item">
                        <span>Gallery Name:</span>
                        <span>{userData.gallery_name}</span>
                    </div>
                    <div className="gallery-item">
                        <span>Number of Paintings:</span>
                        <span>{userData.number_of_paintings}</span>
                    </div>
                    <div className="gallery-item">
                        <span>Number of Artists:</span>
                        <span>{userData.number_of_artists}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSidebar;

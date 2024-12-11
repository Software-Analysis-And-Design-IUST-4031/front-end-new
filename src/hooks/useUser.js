import { useState, useEffect } from 'react';
import userService from '../services/userService';

const useUser = (userId) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const [details, profileDetails, favorites] = await Promise.all([
                    userService.getUserDetails(userId),
                    userService.getUserProfileDetails(userId),
                    userService.getUserFavorites(userId)
                ]);

                setUserData({
                    ...details,
                    ...profileDetails,
                    ...favorites
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const updateProfile = async (profileData) => {
        try {
            const response = await userService.updateUserProfile(userId, profileData);
            setUserData(prev => ({ ...prev, ...response }));
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateFavorites = async (favoritesData) => {
        try {
            const response = await userService.updateUserFavorites(userId, favoritesData);
            setUserData(prev => ({ ...prev, ...response }));
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        userData,
        loading,
        error,
        updateProfile,
        updateFavorites
    };
};

export default useUser;

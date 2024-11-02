// src/components/UserPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../store/user-slice/userSlice';

const ProfileDetail = ({ userId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUser(userId));
        }
    }, [dispatch, userId]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>Error: {error}</p>;
    }

    return (
        user && (
            <div className="user-page">
                <h2>{user.fullName}</h2>
                <p><strong>Firebase ID:</strong> {user.fireBaseId}</p>
                <p><strong>Location:</strong> {user.location?.name}</p>
                
                <div>
                    <h3>Profile</h3>
                    <p><strong>Bio:</strong> {user.profile?.bio}</p>
                    <p><strong>Phone Number:</strong> {user.profile?.phoneNumber}</p>
                    <img src={user.profile?.profilePhoto || '/default-avatar.png'} alt="Profile" />
                </div>

                <div>
                    <h3>Venues</h3>
                    <ul>
                        {user.profile?.venues?.map(venue => (
                            <li key={venue._id}>{venue.name}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Friends</h3>
                    <ul>
                        {user.friends?.map(friend => (
                            <li key={friend._id}>{friend.fullName}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Reviews</h3>
                    <ul>
                        {user.reviews?.map(review => (
                            <li key={review._id}>{review.content}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    );
};

export default ProfileDetail;

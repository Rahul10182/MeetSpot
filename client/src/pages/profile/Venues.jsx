import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VenueCard from './VenueCard';

const VenueList = ({ firebaseID }) => {
  const [venues, setVenues] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const firebaseID = userData?.firebaseID;

  useEffect(() => {
    const fetchUserVenues = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/venue/visted`, {
            firebaseID: firebaseID, 
        });
        console.log("Chal rha hai")
        setVenues(response.data);  
      } catch (error) {
        console.error('Error fetching user venues:', error);
      }
    };

    fetchUserVenues();
  }, [firebaseID]);

  return (
    <div>
      {venues.map((venue) => (
        <VenueCard key={venue._id} venue={venue} firebaseID={firebaseID} />
      ))}
    </div>
  );
};

export default VenueList;

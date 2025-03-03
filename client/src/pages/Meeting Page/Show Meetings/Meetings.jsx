import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    Modal,
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import UserLocation from "../MeetingMap"; // Assume this component is built
import VenuesSection from "../Venues/VenueSection"; // Assume this component is built

const MeetingPage = () => {
    const { meetingId } = useParams();
    const [meeting, setMeeting] = useState(null);
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Step tracker: 0 = User Location, 1 = Friend Location, 2 = Venue Selection
    const [userLocation, setUserLocation] = useState(null);
    const [friendLocation, setFriendLocation] = useState(null);
    const [venueId, setVenueId] = useState(null);
    const [editDetails, setEditDetails] = useState({});
    const navigate = useNavigate();

    // Fetch meeting details
    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/meeting/${meetingId}`
                );
                console.log("reponse:")
                console.log(response.data)
                setMeeting(response.data);
                setEditDetails(response.data);
            } catch (error) {
                console.error("Error fetching meeting:", error);
            }
        };
        fetchMeeting();
    }, [meetingId]);

    // Update venue
    const handleUpdateVenue = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/v1/meeting/${meetingId}`,
                { venue: venueId }
            );
            setMeeting(response.data);
            setIsVenueModalOpen(false);
        } catch (error) {
            console.error("Error updating venue:", error);
        }
    };

    // Update meeting details
    const handleUpdateMeetingDetails = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/v1/meeting/${meetingId}`,
                editDetails
            );
            setMeeting(response.data);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating meeting details:", error);
        }
    };

    // Delete meeting
    const handleDeleteMeeting = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/meeting/${meetingId}`);
            navigate("/profile/show-meet/user");
        } catch (error) {
            console.error("Error deleting meeting:", error);
        }
    };

    // Handle input change for editing meeting details
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleTakeAction = async (meeting) => {
        try {
          console.log("Meeting Data:", meeting);
      
          const { venue, attendees, createdBy } = meeting;
      
          if (!venue || !venue.location?.coordinates || venue.location.coordinates.length !== 2) {
            alert('Venue location is incomplete or invalid. Please check.');
            return;
          }
      
          console.log("Venue Details:", venue);
      
          const attendeesEmails = attendees?.map((attendee) => attendee.email) || [];
          const creatorEmail = createdBy?.email;
      
          if (!creatorEmail || attendeesEmails.length === 0) {
            alert('Meeting creator or attendees information is incomplete. Cannot proceed.');
            return;
          }
      
          console.log("Attendees Emails:", attendeesEmails);
          console.log("Created By Email:", creatorEmail);
      
          const friendEmail = creatorEmail;
          console.log("Friend Email Retrieved:", friendEmail);
      
          if (!friendEmail) {
            alert('Friend email not found. Cannot proceed.');
            return;
          }
      
          console.log("Navigating to map...");
          navigate(`/profile/show-meet/${meetingId}/map/user`, {
            state: {
              coordinates: venue.location.coordinates,
              venueName: venue.name,
              friendEmail,
            },
          });
        } catch (error) {
          console.error('Error in handleTakeAction:', error);
          alert('An error occurred while processing the meeting. Please try again.');
        }
      };      
      

    // Steps for venue modal
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <UserLocation
                        setUserLocation={setUserLocation}
                        handleNext={() => setCurrentStep(1)}
                    />
                );
            case 1:
                return (
                    <UserLocation
                        isFriend={true}
                        setUserLocation={setFriendLocation}
                        handleNext={() => setCurrentStep(2)}
                    />
                );
            case 2:
                return (
                    <VenuesSection
                        userLocation={userLocation}
                        friendLocation={friendLocation}
                        setVenueId={setVenueId}
                        handleNext={() => setCurrentStep(3)}
                    />
                );
            case 3:
                return (
                    <h1>Meeting Created Successfully.</h1>
                );  
            default:
                return null;
        }
    };

    if (!meeting) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Typography variant="h6" color="textSecondary">
                    Loading meeting details...
                </Typography>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Meeting Details */}
            <Card className="mb-6 shadow-lg">
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {meeting.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="mb-4">
                        {meeting.description}
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                        <strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                        <strong>Time:</strong> {meeting.time}
                    </Typography>
                    <Typography variant="body2" className="mb-4">
                        <strong>Status:</strong>{" "}
                        <span
                            className={
                                meeting.status === "completed"
                                    ? "text-green-600"
                                    : meeting.status === "missed"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                            }
                        >
                            {meeting.status}
                        </span>
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Venue
                    </Typography>
                    <Typography variant="body2">{meeting.venue.name}</Typography>
                    <Typography variant="body2">{meeting.venue.address}</Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleTakeAction(meeting)}
                        className="mt-4"
                    >
                        Find on Map
                    </Button>
                </CardContent>
            </Card>

            {/* Actions Section */}
            <div className="flex gap-4">
                <IconButton color="primary" onClick={() => setIsEditModalOpen(true)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={handleDeleteMeeting}>
                    <DeleteIcon />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={() => setIsVenueModalOpen(true)}
                    title="Update Venue"
                >
                    <PlaceIcon />
                </IconButton>
            </div>

            {/* Edit Meeting Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                aria-labelledby="edit-meeting-modal"
            >
                <Box className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl mx-auto mt-20">
                    <Typography variant="h5" className="mb-4" id="edit-meeting-modal">
                        Edit Meeting Details
                    </Typography>
                    <form>
                        <TextField
                            label="Title"
                            name="title"
                            value={editDetails.title}
                            onChange={handleInputChange}
                            fullWidth
                            className="mb-4"
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={editDetails.description}
                            onChange={handleInputChange}
                            fullWidth
                            className="mb-4"
                            multiline
                        />
                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={editDetails.date}
                            onChange={handleInputChange}
                            fullWidth
                            className="mb-4"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Time"
                            name="time"
                            type="time"
                            value={editDetails.time}
                            onChange={handleInputChange}
                            fullWidth
                            className="mb-4"
                            InputLabelProps={{ shrink: true }}
                        />
                        <div className="flex justify-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateMeetingDetails}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Venue Modal */}
            <Modal
                open={isVenueModalOpen}
                onClose={() => {
                    setIsVenueModalOpen(false);
                    setCurrentStep(0); // Reset steps on close
                }}
                aria-labelledby="change-venue-modal"
            >
                <Box
                    sx={{
                        backgroundColor: "white",
                        padding: 6,
                        borderRadius: "8px",
                        boxShadow: 24,
                        width: "75%", // Adjust modal width if needed
                        maxWidth: "4xl",
                        margin: "auto",
                        mt: "5%", // Adds equal spacing from the top
                        mb: "5%", // Adds equal spacing from the bottom
                    }}
                >
                    <Typography variant="h5" className="mb-4" id="change-venue-modal">
                        {currentStep === 0
                            ? "Set Your Location"
                            : currentStep === 1
                                ? "Set Friend's Location"
                                : "Select Venue"}
                    </Typography>
                    <div>{renderStepContent()}</div>
                    {currentStep === 2 && (
                        <div className="flex justify-end mt-4">
                            <Button variant="contained" color="primary" onClick={handleUpdateVenue}>
                                Save Venue
                            </Button>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default MeetingPage;
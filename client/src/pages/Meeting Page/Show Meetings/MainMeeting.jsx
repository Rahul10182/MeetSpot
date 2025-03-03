import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Typography, CircularProgress, Card, CardContent } from "@mui/material";

const MainPage = () => {
    const [meetings, setMeetings] = useState([]);
    const [filter, setFilter] = useState("scheduled");
    const [loading, setLoading] = useState(true); // To manage the loading state
    const navigate = useNavigate();
    console.log(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    console.log(userId);


    useEffect(() => {
        const fetchMeetings = async () => {

            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/v1/meeting/user/${userId}`);
                    setMeetings(response.data);
                    console.log("main:")
                    console.log(response.data);
                } catch (error) {
                    console.error("Error fetching meetings:", error);
                } finally {
                    setLoading(false);
                }
            } else {

                setLoading(false); // Stop loading if userId is not available
            }
        };

        if (userId) {
            fetchMeetings();
        }
    }, []);

    const filteredMeetings = meetings.filter((meeting) => meeting.status === filter);

    const getStatusColor = (status) => {
        if (status === "completed") return "text-green-600";
        if (status === "missed") return "text-red-600";
        return "text-yellow-600";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Typography variant="h5" color="textSecondary">
                    Please log in to view your meetings.
                </Typography>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Typography variant="h4" align="center" gutterBottom>
                Your Meetings
            </Typography>
            <div className="flex justify-center gap-4 mb-6">
                <Button
                    variant={filter === "scheduled" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setFilter("scheduled")}
                >
                    Scheduled
                </Button>
                <Button
                    variant={filter === "completed" ? "contained" : "outlined"}
                    color="success"
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </Button>
                <Button
                    variant={filter === "missed" ? "contained" : "outlined"}
                    color="error"
                    onClick={() => setFilter("missed")}
                >
                    Missed
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMeetings.length === 0 ? (
                    <Typography variant="h6" color="textSecondary" align="center">
                        No meetings found for the selected filter.
                    </Typography>
                ) : (
                    filteredMeetings.map((meeting) => (
                        <Card
                            key={meeting.id}
                            className="hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => navigate(`/profile/show-meet/${meeting.id}/user`)}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    className={`font-bold ${getStatusColor(meeting.status)}`}
                                >
                                    {meeting.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Time: {meeting.time}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className={`font-semibold ${getStatusColor(meeting.status)}`}
                                >
                                    Status: {meeting.status}
                                </Typography>
                            </CardContent>
                        </Card>

                    ))
                )}
            </div>
        </div>
    );
};

export default MainPage;
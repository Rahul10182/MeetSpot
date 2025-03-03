const io = require('socket.io')(8800, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from the React app
    }
});

let activeUsers = []; // Array to store active users

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Add new user when they emit 'new-user-add'
    socket.on('new-user-add', (newUserId) => {
        if (newUserId) {
            // Check if user already exists
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({
                    userId: newUserId,
                    socketId: socket.id,
                });
            }
            console.log("Connected Users:", activeUsers);

            // Notify all clients about the updated active users
            io.emit('get-users', activeUsers);
        }
    });

    //send message
    socket.on("send-message", (data) => {
        const { recieverId } = data;
        console.log("Data before sending:", data);
        const user = activeUsers.find((user) => user.userId === recieverId);
        console.log("Sending from socket to:", recieverId);
        console.log("Data:", data);
        if (user) {
            io.to(user.socketId).emit("recieve-message", data);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected:", activeUsers);

        // Notify all clients about the updated active users
        io.emit('get-users', activeUsers);
    });
});

console.log("Socket.IO server listening on port 8800");
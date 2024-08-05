const express = require("express");
const socketio = require("socket.io");
const path = require("path");
let app = express();
let PORT = 3030 || process.env.PORT;
const formatMessage = require("./utils/fmessages");
const { userJoin, getCurrentUser, removeUser, roomUsers } = require("./utils/users");

//let http = require("http");
let http = require('http').Server(app);
let io = require('socket.io')(http);

// create server http server
//let server = http.createServer(app);
//let io = socketio(server);

//middleware for express app
app.use(express.static(path.join(__dirname, "public")));


// bi-directional communication
io.on('connection', (socket) => {
    //console.log("A new user connected........");

    socket.on("joinRoom", ({ username, room }) => {
         // create a chat join on socket.io
         let userObject = userJoin(socket.id, username, room);
         socket.join(userObject.room);

         // welcome message
        socket.emit("message", formatMessage("ChatCord", "Welcome to my chat app!"))

        //TODO: A NEW USER JOINED and this message appears to all users except him/her.
        socket.broadcast.to(userObject.room).emit("message", formatMessage("ChatCord", 
                            `${userObject.username} just joined...`));

        let users = roomUsers(userObject.room);
        io.to(userObject.room).emit('roomUsers', {room : userObject .room, users });
    });

    //emit message entered on chatapp
    socket.on("chatmessage", (msg) => {
        let userObject = getCurrentUser(socket.id);
        console.log(msg);
        io.to(userObject.room).emit("message", formatMessage(userObject.username, msg));
    });
    //TODO: A  USER LEFT
    socket.on("disconnect", () => {
        //when disconnected, the user shoul be removed from utils/users.js
        let userObject = removeUser(socket.id);

        if(userObject){
            io.to(userObject.room).emit("message", formatMessage("ChatCord Bot",
                 `${userObject.username} just left...`));
                 // update the side bar information after a user disconnects
            io.to(userObject.room).emit('roomUsers', {room : userObject.room, users: roomUsers(userObject.room) });
        }
        

        
    })
});
// run server
http.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}.....`);
})
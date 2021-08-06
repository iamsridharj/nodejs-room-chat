const path = require('path');
const http = require('http'); 
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  getUserInfo,
  getUsersByRoomName,
  addUser,
  removeUser
} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  
  socket.on('join', ({userName, roomName}) => {
    addUser(socket.id, {userName, roomName})
    socket.join(roomName);
    socket.broadcast.to(roomName).emit('textMessage', {message: `${userName} Joined!!`, user: {userName, roomName}});
    users=getUsersByRoomName(roomName);
    io.to(roomName).emit('roomData',{users});
  });

  socket.on('sendMessage', (payload, cb) => {
    const {userName, roomName} = getUserInfo(socket.id); 
    const filter = new Filter();
    if(!filter.isProfane(payload.message)){
      io.to(roomName).emit('textMessage', {...payload, user: {userName, roomName}});
    }else{
      cb("Profanity found in the message");
    }
  });

  socket.on('sendLocation', (payload, cb) => {
    cb()
    const {userName, roomName} = getUserInfo(socket.id); 
    io.to(roomName).emit('locationMessage', {message:`https://www.google.com/maps/@${payload.locationObj.long},${payload.locationObj.lat}`, user: {userName, roomName}})
  });

  socket.on('disconnect', () => {
    const resp = removeUser(socket.id);
    console.log(resp, "respp");
    if(resp){
      socket.broadcast.to(resp.roomName).emit('textMessage',{ message: `${resp.userName} Left!!`, user: {userName: resp.userName, roomName: resp.roomName}})
    }
  });

});
server.listen(port, () => console.log(`Server is up on port ${port}`));

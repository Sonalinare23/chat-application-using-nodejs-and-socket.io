
const path = require('path');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const Cryptr = require("cryptr");
const cors = require('cors');
const bodyParser = require("body-parser");
const registerRouter = require("./api/routes/registerRoute");
const loginRouter = require("./api/routes/login");
const socketio = require('socket.io');
const hbs = require("hbs");
const cryptr = new Cryptr(
  "mySecretKey"
);

// const chatModel = require('./api/models/chat');
// const registerModel = require('./api/models/register');


mongoose.connect('mongodb://localhost:27017/database', {useNewUrlParser: true}, (err) => {
if (!err) {console.log('MongoDB Connection Succeeded.') }
else {console.log('Error in DB connection:' + err) }
});


const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getMessage,
  saveMessage
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('dotenv').config()
// Set static folder
//set static folder
app.use(express.static('.'));


// Set the view engine
app.set("view engine", "hbs");

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.render('index')
  })

// app.use("/chats", chatRouter)
app.use("/signup", registerRouter);
app.use("/login", loginRouter);

app.use(cors({origin: '*'}))


const botName = 'Admin';


// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "message",
      formatMessage(botName, cryptr.encrypt("Welcome To Chatbox"))
    );

    // Broadcast when a user connects
    socket.broadcast
    .to(user.room)
    .emit(
      "message",
      formatMessage(
        botName,
        cryptr.encrypt(`${user.username} has entered the chat room`)
      )
    );


    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    const status = getMessage(socket.id);
    const m = saveMessage(msg,username)
    io.to(user.room).emit('message', formatMessage(user.username, msg), status);
  });
  });

  // socket.on("chatMessage", (msg) => {
  //   const user = getCurrentUser(socket.id);

  //   //console.log(msg);
  //   io.to(user.room).emit("message", formatMessage(user.username, msg));
  // });



  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

app.get("/decrypt", async (req, res) => {
  message = req.query.message;
  decrypted = cryptr.decrypt(message);
  await res.json(decrypted);
});

app.get("/encrypt", async (req, res) => {
  message = req.query.message;
  encrypted = cryptr.encrypt(message);
  // console.log("LE: " + encrypted.length);
  await  res.json(encrypted);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

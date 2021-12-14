const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const RoomName = document.getElementById('Room-form')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
// socket.emit('joinRoom', { username, room });

RoomName.addEventListener('submit', async (e) => {
  e.preventDefault()

  const room = e.target.elements.roomName.value;
  console.log('Room ', room);

  url = 'http://localhost:5000/login/verify'
  fetch(url)
  .then((res) => res.json())
  .then((username) => {
    socket.emit('joinRoom', { username, room })
  })
  .catch(rejected => {
    console.log(rejected)
  })

  e.target.elements.roomName.value='';
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});



socket.on('message', (message, sts) => {
    
  console.log(message);
  url = "http://localhost:5000/decrypt?message=" + message.text ;
  console.log("URL :" + url);
  fetch(url)
  .then((res) => res.json())
  .then((decrypted) => {
      console.log("Decrypted ", decrypted);
      outputMessage({
          username: message.username,
          text: decrypted,
          time: message.time,
          date: message.date    
      }, sts);
  })
  // outputMessage(message, sts)
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  // msg = msg.trim();

  // if (!msg) {
  //   return false;
  // }

  // Emit message to server
  
  url = "http://localhost:5000/encrypt?message=" + msg;
  fetch(url)
    .then((res) => res.json())
    .then((encrypted) => {
      socket.emit("chatMessage", encrypted);
    });
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message, status) {
  if (status === undefined){
    status = ""
  }
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  p.innerHTML += `<span>${message.date}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
  para.innerHTML += `<span style="margin-left: 450px;">${status}</span>`;
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});


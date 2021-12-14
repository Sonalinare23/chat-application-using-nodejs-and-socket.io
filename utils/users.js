const users = [];

const MessageModel = require('../api/models/chat')

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
 
// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function saveMessage(msg, user){
  let message = new MessageModel({
    sender : user,
    message : msg,
    time :msg.time
  })
  m = message.save();
}


function getMessage(id){
  const index = users.length
  let status;
  if(index === 1){
    return status = 'sent'
  } else if (index > 1 ){
    
    return status = 'delivered'
  } else {
      return status = index
  }
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getMessage,
  saveMessage
};













































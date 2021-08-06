let users = [];

const addUser = (id,user) => {
  const {userName, roomName} = user

  const alreadyExists = users.some(user => user.id === id);

  if(!user.userName || !user.roomName){
    return "User name or room name cannot be empty.";
  }
  if(alreadyExists){
    return "User Already Exists"
  }

  users.push({
    id,
    userName, 
    roomName
  })

  return user;
}

const removeUser = (id,userObj) => {
  const removedUser = users.filter(user => user.id === id);
  users = users.filter(user => user.id !== id);

  return removedUser[0]
}

const getUserInfo = (id) => {
  const userInfoArr = users.filter(user => user.id === id);
  return userInfoArr[0]
}

const getUsersByRoomName = (roomName) => {
  const userArr = users.filter(user => user.roomName === roomName);
  return userArr
}

module.exports = {
  addUser,
  removeUser,
  getUsersByRoomName,
  getUserInfo
}
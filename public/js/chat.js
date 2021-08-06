const socket = io();

let counter = 0 

// Elements
const $messageInput = document.getElementById('greeting');
const $messageSubmitButton = document.getElementById('messageSubmit');
const $messageContainer = document.getElementById('message-list-container');
const $shareLocationButton = document.getElementById('shareLocation');
const $userListContainer = document.getElementById('user-list-container');
// Templates
const messageTemplateValue = document.getElementById('message-template').innerHTML;
const locationTemplateValue = document.getElementById('location-template').innerHTML;
const userListTemplate = document.getElementById('user-list-template').innerHTML;

//QS
const {userName, roomName} = Qs.parse(location.search, {ignoreQueryPrefix: true});


//Event listeners
socket.emit('join', {userName, roomName});

socket.on('textMessage', (response) => {
  const templateVariableObject = {
    message:response.message,
    time:moment(response.timeStamp).fromNow(),
    userName:response.user.userName
  };
  const html = Mustache.render(messageTemplateValue, templateVariableObject);
  $messageContainer.insertAdjacentHTML('beforeend', html)
});

socket.on('locationMessage', (response) => {
  const templateVariableObject = {
    locationUrl:response.message
  };
  const html = Mustache.render(locationTemplateValue, templateVariableObject);
  $messageContainer.insertAdjacentHTML('beforeend', html)
});

socket.on('roomData', (roomData) => {
  console.log(roomData, "roomData");
  const html = Mustache.render(userListTemplate, {...roomData, roomName});
  $userListContainer.innerHTML = html
});



// Functions
const submitBtn = () => {
  const payload = {}
   payload.message = document.getElementById('message').value;
   payload.timeStamp = Date.now()
  socket.emit('sendMessage', payload, (error) => {
    if(error) {
      console.log(error);
    }else{ 
      $messageInput.innerHTML = ""
    }
  });
};


const shareLocation = () => {
  $shareLocationButton.disabled = true;
  const NavigatorObj = navigator.geolocation
  if(NavigatorObj){
    navigator.geolocation.getCurrentPosition((postion) => {
      const payload = {}
      payload.locationObj = {
        lat : postion.coords.latitude,
        long : postion.coords.longitude
      };
      payload.timeStamp = moment().unix();
      socket.emit('sendLocation', payload, (error) => {
        if(error){
          console.log(error)
        }else{
          $shareLocationButton.disabled = false;
          console.log("Location Shared")
        }
      });
    });
  }else{
    return console.log("Geo location is not supported by your browser");
  }
};


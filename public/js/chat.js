const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');
const $location = document.querySelector('#location');
const $sidebar = document.querySelector('#sidebar');

// Templates for displaying
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message elememt
    const $newMessage = $messages.lastElementChild;

    // height of the message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (msg) => {
    const html = Mustache.render($messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (location) => {
    const html = Mustache.render($locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    $messageFormButton.setAttribute('disabled','disabled');
    
    const message = e.target.elements.msg.value;
    
    socket.emit('sendMessage', message,(error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        
        if (error) {
            return console.log(error);
        } 
        
        console.log('Message Delievered!');
    });
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    e.srcElement.setAttribute("disabled", "true");
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, () => {
                console.log('Location Shared!');
                e.srcElement.removeAttribute("disabled");
            })
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
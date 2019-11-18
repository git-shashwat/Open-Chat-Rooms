const socket = io();

const $activeRooms = document.querySelector('#active-rooms');
const $roomsTemplate = document.querySelector('#rooms-template').innerHTML;

socket.on('roomStatus', ({ rooms }) => {
    if (rooms.length != 0) {
        const html = Mustache.render($roomsTemplate, {
            rooms: rooms    
        });
        $activeRooms.innerHTML = html;
    }
})
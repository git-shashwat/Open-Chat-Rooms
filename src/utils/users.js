const users = [], rooms = [];

const addUser = ({ id, username, room }) => {
    // Cleaning the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });
    
    /// Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room };
    users.push(user);

    // Check for new room 
    const existingRoom = rooms.find(location => location.name === user.room);
    if (!existingRoom) {
        rooms.push({name :user.room});
    }

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index != -1) {
        const removedUser = users.splice(index, 1)[0];

        // Check for active users now
        if(users.findIndex(user => user.room === removedUser.room) == -1) {
            const roomIndex = rooms.findIndex((location) => location.name === removedUser.room);
            rooms.splice(roomIndex, 1);
        }
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room.trim().toLowerCase());
}

const getActiveRooms = () => {
    console.log(rooms);
    return rooms;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getActiveRooms
}
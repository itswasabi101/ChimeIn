// the reason I'm having this file with users is to persist the data of each user entry
// so as to have access to their name, id and room individual user joined.


const users = [];

function userJoin(id, username, room){
    let user = {id, username, room};
    users.push(user);
    return user;
}

function getCurrentUser(id){
    let user = users.find(user => user.id === id);
    return user;
}

//remove user
function removeUser(id){
    let delUser_index =  users.findIndex(user => user.id === id);
    if(delUser_index !== -1){
        return users.splice(delUser_index, 1)[0];
    }
    
}

//get the users in a room by passing the room as argument
function roomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    removeUser,
    roomUsers
}
import QueryString from 'https://cdn.jsdelivr.net/npm/query-string@8.1.0/+esm';

let socket = io();
let chatMessage = document.querySelector(".chat-messages");

//DOM for room name and list of users
let roomName = document.getElementById("room-name");
let roomUsers = document.getElementById("users");

let { username, room } = QueryString.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);
socket.emit("joinRoom", { username, room} );

socket.on("message", (message) => {
    console.log(message);
    putMessageOnScreen(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;

})

socket.on("roomUsers", ({room, users}) => {
    displayUsers(users);
    displayRoom(room);
})

// display room name
function displayRoom(room){
    roomName.innerText = room;
}

// display user
function displayUsers(users){
    roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}


let chatForm = document.getElementById("chat-form");
console.log(chatForm);


chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    
    if(e.target.elements.msg.type === "text"){
       
        let msg = e.target.elements.msg.value;
        socket.emit('chatmessage', msg);

        //scroll property
       
    } 
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();   

})

//this function puts the server message on the chat screen
function putMessageOnScreen(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
                        <p class="text">
                            ${message.text}
                        </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
    Room = require("./Room").Room;       // Room class
/**************************************************
** GAME VARIABLES
**************************************************/
var rooms,                                  // Array of created game rooms
    socket,									// Socket controller
    players;                               // Lightweight database

var express = require('express');
var app = express();

/**************************************************
** GAME INIT
**************************************************/
function init() {
	// create an empty array to store rooms
	rooms = [];

    players = [];

	// set up Socket.IO to listen on port
	socket = io.listen(8000);

    // Configure Socket.IO
    socket.configure(function() {
            // Only use WebSockets
            socket.set("transports", ["websocket"]);

            // Restrict log output
            socket.set("log level", 2);
    });

    // Start listening for events
    setEventHandlers();
    app.use(express.static(__dirname + '/public'));
    app.listen(process.env.PORT || 3000);
};


/**************************************************
 ** EVENT HANDLERS
 **************************************************/
var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);

    // Listen for client disconnected
    //client.on("disconnect", onClientDisconnect);

    // Listen for new player message
    client.on("new player", onNewPlayer);

    // Listen for new room requested message
    client.on("new room requested", onNewRoomRequest);

    // Listen for new room created message
    client.on("new room created", onNewRoom);

    // Listen for move player message
    client.on("room", onJoinRoom);

    // Listen for game data update
    client.on("update", onUpdate);

    // Listen for attack message
    client.on("attack", onAttack);

    // Listen for rematch message
    client.on("rematch", onRematch);
};

function onAttack(data) {
    this.broadcast.to(data.roomId).emit("attack", {data: "attack"});
}

function onRematch(data) {
    console.log("broadcasting rematch messaage");
    this.broadcast.to(data.roomId).emit("rematch", {data: "rematch"});
}

function onUpdate(data) {
    players[this.id] = data.gameData;
    this.broadcast.to(data.roomId).emit("update", {gameData: data.gameData});
}

function onJoinRoom(room) {
    console.log("Joined room " + room);
    if (socket.sockets.clients(room).length == 0) rooms[room] = new Room(room);
    this.join(room);
    if (socket.sockets.clients(room).length > 2) console.log("Room has more than 2 people. Whoever join after will be in watcher mode");
};


function onNewRoom(data) {
    console.log("New room created with id: " + data.id);
    rooms[data.id] = new Room(data.id);
};


// New player has joined
function onNewPlayer(data) {
    // Create a new player
    //var newPlayer = new Player(data.x, data.y);
    //newPlayer.id = this.id;

    // Broadcast new player to connected socket clients
    this.broadcast.to(data.roomId).emit("new player", data.gameData);

    // send existing player to new player
    if (socket.sockets.clients(data.roomId).length == 2)
        this.emit("new player", {gameData: players[socket.sockets.clients(data.roomId)[1].id]});

    // console.log("Hello. New player connected: "+data.id);
    // urlString = "battle.html?id=" + data.id;
    //document.getElementById("linkPlaceholder").innerHTML = "Invite your friend to <a href=" +urlString + ">" + urlString
    //    + "</a>";
    //rooms[this.id] = new Room(this.id);
    //this.emit("new room", {id: this.id});
    // Send existing players to the new player
    /* var i, existingPlayer;
    /for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };*/

    // Add new player to the players array
    players[this.id] = data.gameData;
};


function onNewRoomRequest(data) {
    rooms[this.id] = new Room(this.id)

    // broadcast new room to connected socket clients
    // is this needed?
    // this.broadcast.emit("new room created", {id: this.id});

    this.emit("new room created", {id: this.id});
};



/**************************************************
 ** RUN THE GAME
 **************************************************/
init();
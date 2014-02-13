/**
 * Created by hieu on 1/25/14.
 */
/**************************************************
 ** GAME VARIABLES
 **************************************************/
var canvas,                        // Canvas DOM element
    control,                        // Keyboard input
    socket;                        // Socket connection

/**************************************************
 ** GAME INIT
 **************************************************/
function init() {
    // initialize socket connection
    socket = io.connect(HOME_URL, {port: 8000, transports: ["websocket"]});

    // start listening to events
    setEventHandlers();
}

/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function() {
    // Socket connection successful
    socket.on("connect", onSocketConnected);

    // New player message received
    // socket.on("new player", onNewPlayer);

    // New room message received
    socket.on("new room created", onNewRoom);
}


// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");

    randomId = Math.uuid(5,16);
    console.log("New room created. Room id is: "+ randomId);
    urlString = "battle.html?id=" + randomId;
    document.getElementById("linkPlaceholder").innerHTML = "Invite your friend to <a href=" +urlString + ">" + urlString
        + "</a>";

    // Send local player data to the game server
    socket.emit("new room created", {id: randomId});
};


// New room
function onNewRoom(data) {
    console.log("New room created. Room id is: "+data.id);
    urlString = "battle.html?id=" + data.id;
    document.getElementById("linkPlaceholder").innerHTML = "Invite your friend to <a href=" +urlString + ">" + urlString
    + "</a>";
}


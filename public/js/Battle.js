/**
 * Created by hieu on 1/26/14.
 */
/**************************************************
 ** GAME VARIABLES
 **************************************************/
var canvas,                        // Canvas DOM element
    ctx,                        // Canvas rendering context
    control,                        // Keyboard input
    localPlayer,        // Local player
    remotePlayer,        // Remote players
    socket,                        // Socket connection
    timer;

/**************************************************
 ** GAME INIT
 **************************************************/
function init() {
    roomId = getParam("id");

    // declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // set width and height of canvas to maximum
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    // initialize local player
    localPlayer = new Game(10, 20, ctx);
    localPlayer.roomId = roomId;
    localPlayer.setScreenOrigin(100, 100);

    // create game control for local player
    control = new Control(localPlayer);

    // initialize socket connection
    socket = io.connect(HOME_URL, {port: 8000, transports: ["websocket"]});

    // initialize remotePlayer to null
    remotePlayer = null;

    // start listening to events
    setEventHandlers();

    localPlayer.start();
};


/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function() {
    // keyboard event
    window.addEventListener("keydown", onKeyDown, false);

    // Window resize
    window.addEventListener("resize", onResize, false);

    // Socket connection successful
    socket.on("connect", onSocketConnected);

    // New player message received
    socket.on("new player", onNewPlayer);

    // Update
    socket.on("update", onUpdate);

    socket.on("attack", onAttack);
};

// keyboard key down
function onKeyDown(e) {
    if (localPlayer) {
        control.onKeyDown(e);
    }
};

// browser window resize
function onResize(e) {
    // Maximise the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");

    // socket.emit("new player", {});
    room = getParam("id");
    socket.emit("room", room);
    console.log("Connected to room " + room);

    // send local player data to the game server
    socket.emit("new player", {roomId: room, gameData: localPlayer.grid});

    clearInterval(timer);
    timer = setInterval(function(){
        console.log("emitting update to server");
        socket.emit("update", {roomId: room, gameData: localPlayer.grid})}, 1000);
};

// New player
function onNewPlayer(data) {
    console.log("Hello. New player connected.");
    room = getParam("id");
    remotePlayer = new Game(10, 20, ctx);
    remotePlayer.roomId = room;
    remotePlayer.grid = data.gameData;
    remotePlayer.setScreenOrigin(400, 100);
    remotePlayer.drawGrid2();
};

function onUpdate(data) {
    console.log("receiving new game data for remote player");
    console.log(data);
    remotePlayer.grid = data.gameData.slice(0);
    remotePlayer.drawGrid2();
}

function onAttack(data) {
    console.log("JUST GOT ATTACKED!!! :(");
    localPlayer.isAttacked();
}



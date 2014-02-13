/**
 * Created by hieu on 1/26/14.
 * Room class represents a room containing two players
 * who are playing against each other
 */
var Room = function(id) {
    var id = id,                // unique room id
        players = [],           // players in the room
        full = false;           // room is full when there are two players

    var getId = function() {
        return id;
    };

    var setId = function(id) {
        id = id;
    };

    var isFull = function() {
        return full;
    };

    return {
        getId: getId,
        setId: setId,
        isFull: isFull
    }

};

exports.Room = Room;

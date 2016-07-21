/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function() {
  var keysArray = [];
  keysArray[87] = false; // up
  keysArray[83] = false; // down
  keysArray[65] = false; // left
  keysArray[68] = false; // right
  keysArray[38] = false; // W
  keysArray[40] = false; // S
  keysArray[37] = false; // A
  keysArray[39] = false; // D

  var onKeyDown = function(e) {
    keysArray[e.keyCode] = true;
  };
  
  var onKeyUp = function(e) {
    keysArray[e.keyCode] = false;
  };

  var state = function () {
    return {
      movement: {
        up: keysArray[87],
        down: keysArray[83],
        left: keysArray[65],
        right: keysArray[68]
      },
      shooting: {
        up: keysArray[38],
        left: keysArray[37],
        right: keysArray[39],
        down: keysArray[40]
      }
    };
  }

  return {
    state: state,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    valid: [37,38,39,40,87,83,65,68]
  }
};
module.exports = Keys;
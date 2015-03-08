var floatingConsole = floatingConsole || {
  container: document.querySelector(".floating-console"),
  element: document.querySelector(".floating-console_command"),
  lastCommand: document.querySelector('.floating-console_last-command'),
  getPosition: function (element) {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
  },
  loadCommand: function() {
    var previousCommandsLenth = floatingConsole.previousCommands.length;
    if (previousCommandsLenth) {
      var commandIndex = (previousCommandsLenth - floatingConsole.cursorPosition) - 1;
      floatingConsole.element.value =
        floatingConsole.previousCommands[commandIndex];
    }
  },
  executeCommand: function() {
    var command = floatingConsole.element.value;
    if (!command) {
      return;
    }

    try {
      var evaluatedCommand = window.eval(command);
      floatingConsole.lastCommand.innerHTML = evaluatedCommand;
      if (typeof evaluatedCommand == 'object') {
        var objectInfo = '';
        for (var name in evaluatedCommand) {
          if (evaluatedCommand.hasOwnProperty(name)) {
            objectInfo +=
              name + " : " + evaluatedCommand[name] + "[" + (typeof evaluatedCommand[name]) + "] <br>";
          }
        }
        floatingConsole.lastCommand.innerHTML = objectInfo;
      }
    } catch (e) {
      floatingConsole.lastCommand.innerHTML = e.message;
    }
    floatingConsole.previousCommands.push(command);
    floatingConsole.element.value = '';
    floatingConsole.cursorPosition = 0;
  },
  moveContainer: function(x, y) {
    var containerPosition = getPosition(floatingConsole.container);
    if (typeof x !== undefined) {
      floatingConsole.container.style.left =
        (containerPosition.x - x) + "px";
    }
    if (typeof y !== undefined) {
      floatingConsole.container.style.top =
        (containerPosition.y - y) + "px";
    }
  },
  nextCommand: function() {
    if (floatingConsole.cursorPosition) {
      --floatingConsole.cursorPosition;
      floatingConsole.loadCommand();
    }
  },
  previousCommand: function() {
    if (floatingConsole.previousCommands.length
      && (floatingConsole.cursorPosition) < floatingConsole.previousCommands.length
    ) {
      if (!floatingConsole.cursorPosition) {
        ++floatingConsole.cursorPosition;
        floatingConsole.previousCommands.push(floatingConsole.element.value);
      }
      floatingConsole.loadCommand();
      floatingConsole.cursorPosition++;
    }
  },
  initialize: function() {
    floatingConsole.previousCommands = [];
    floatingConsole.cursorPosition = 0;
    floatingConsole.transAmount = 50;
    floatingConsole.element.addEventListener('keydown', function(e) {
      var getPosition = floatingConsole.getPosition;
      if (e.ctrlKey) {
        switch(e.which) {
          case 37: // control left, move window left
            floatingConsole.moveContainer(-floatingConsole.transAmount);
            break;
          case 38: // control up, move window up
            floatingConsole.moveContainer(0, -floatingConsole.transAmount);
            break;
          case 39: // control right, move window right
            floatingConsole.moveContainer(floatingConsole.transAmount);
            break;
          case 40: // control down, move window down
            floatingConsole.moveContainer(0, floatingConsole.transAmount);
            break;
        }
      } else if (e.keyCode === 13) { // enter key
        floatingConsole.executeCommand();
      } else if (e.keyCode === 38) { // up key
        floatingConsole.previousCommand();
      } else if (e.keyCode === 40) { // down key
        floatingConsole.nextCommand();
      }
    });
  }
};

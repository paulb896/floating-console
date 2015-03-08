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
      floatingConsole.lastCommand.innerHTML = window.eval(command);
    } catch (e) {
      floatingConsole.lastCommand.innerHTML = e.message;
    }
    floatingConsole.previousCommands.push(command);
    floatingConsole.element.value = '';
    floatingConsole.cursorPosition = 0;
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
            floatingConsole.container.style.left =
              (getPosition(floatingConsole.container).x - floatingConsole.transAmount) + "px";
            break;
          case 38: // control up, move window up
            floatingConsole.container.style.top =
              (getPosition(floatingConsole.container).y - floatingConsole.transAmount) + "px";
            break;
          case 39: // control right, move window right
            floatingConsole.container.style.left =
              (getPosition(floatingConsole.container).x + floatingConsole.transAmount) + "px";
            break;
          case 40: // control down, move window down
            floatingConsole.container.style.top =
              (getPosition(floatingConsole.container).y + floatingConsole.transAmount) + "px";
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

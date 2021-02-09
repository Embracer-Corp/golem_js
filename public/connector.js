const socket = io(window.location.href);

// --- EVENTS ---

socket.on('players_info', (players) => {
  console.log(players, this.players)
  
  this.players = players
  //visual_update()
})

socket.on('chat', (message) => {
  console.log('host->chat:', message)
  document.getElementById("hotLog").innerHTML += "\r\n" + message
})

socket.on('registered', (regNick) => {
  if (regNick == null) { alert("Wrong symbols in a nickname") } //something gonna wrong
  nickname = regNick
})

socket.on('start', (gameConfig) => {
  game.start(gameConfig)
})

socket.on('disconnect', (reason) => {
  console.log("FAIIIIL! " + reason)
})

document.onmousedown = function(e) {
  if (e.toElement == canvas) {
    if (e.layerX > 20 && e.layerX < 20+150 && e.layerY > 20 && e.layerY < 20+50) {
      let item = exampleNames[Math.floor(Math.random() * exampleNames.length)];
      let nick = prompt("Enter your nick:", item)
      // let input = document.getElementById("input")
      // input.focus()
      // input.click()
      //document.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE); // can't find more info
    
      if (nick != null) {
        socket.emit('register', { name: nick })
      }
    }
    else if(e.layerX > 20 && e.layerX < 20+150 && e.layerY > 430 && e.layerY < 430+50) {
      socket.emit('start')
    }
  } else {
    let message = prompt("Enter the message:")

    if (message != null) {
      socket.emit('chat', message)
    }
  }
}
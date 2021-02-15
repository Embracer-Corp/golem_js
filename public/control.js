// Control is creating after game starts, and base on Settings?
const control = {
  touch0: {x: 0, y: 0, hold: null}, stickAreaRadius: 100, stickSizeRadius: 30,
  mouse: {x: 0, y: 0, hold: null},
  keyboard: {isGoLeft: false, isGoRight: false, isGoUp: false, isGoDown: false},
  
  get axis() {
    let res = { x: this.keyboard.isGoRight - this.keyboard.isGoLeft, y: this.keyboard.isGoDown - this.keyboard.isGoUp }
    if (this.mouse.hold != null) {
      res.x += this.mouse.x - this.mouse.hold.x
      res.y += this.mouse.y - this.mouse.hold.y
    } else if(this.touch0.hold != null) {
      res.x += this.touch0.x - this.touch0.hold.x
      res.y += this.touch0.y - this.touch0.hold.y
    }
    
    if (Math.sqrt(res.x * res.x + res.y * res.y) < (this.stickAreaRadius - this.stickSizeRadius)) {
      multiplication(res, 1/(this.stickAreaRadius - this.stickSizeRadius))
    } else {
      normalize(res, 1) 
    }
    return res
  },
  drawStick: function(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.strokeStyle = "#F0000050"
    if (control.mouse.hold != null) {
      ctx.fillStyle = "#F0000030"
      ctx.beginPath();ctx.arc(control.mouse.hold.x, control.mouse.hold.y, control.stickAreaRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
      ctx.beginPath();ctx.arc(control.mouse.hold.x, control.mouse.hold.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = "#333333"
      ctx.beginPath();ctx.arc(control.mouse.x, control.mouse.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
    }
    if (control.touch0.hold != null) {
      ctx.strokeStyle = "#F0000050"
      ctx.fillStyle = "#F0000030"
      ctx.beginPath();ctx.arc(control.touch0.hold.x, control.touch0.hold.y, control.stickAreaRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
      ctx.beginPath();ctx.arc(control.touch0.hold.x, control.touch0.hold.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = "#333333"
      ctx.beginPath();ctx.arc(control.touch0.x, control.touch0.y, control.stickSizeRadius, 0, 2 * Math.PI)
      ctx.fill(); ctx.stroke()
    }
  }
}


// --- TOUCH ---
var ongoingTouches = {
  0: {color: "#3498DB", x: [0], y: [0]},
  1: {color: "#FAD7A0", x: [0], y: [0]},
  2: {color: "#9B59B6", x: [0], y: [0]},
  3: {color: "#D0ECE7", x: [0], y: [0]},
  4: {color: "#AF601A", x: [0], y: [0]}
}
function touchend(ev) {
  if (ev.cancelable) ev.preventDefault()
  control['touch0'].hold = null
}

addEventListener('touchstart', function(ev) {
  general.fullScreen()
  //if (document.fullscreenElement == null) { canvas.webkitRequestFullscreen() }
  // else if (!settings.debug) { game.start() }

  if (ev.targetTouches.length > 3) { settings.debug = !settings.debug }
  if (settings.debug) { diagnostic.logTouch(ev) }

  let ts = ev.changedTouches
  for (var i=0; i < ev.targetTouches.length; i++) {
    if (i > 0) break
    control['touch'+ts[i].identifier].hold = {x: ts[i].pageX + canvas.offsetLeft, y: ts[i].pageY + canvas.offsetTop }
    control['touch'+ts[i].identifier].x = ts[i].pageX + canvas.offsetLeft
    control['touch'+ts[i].identifier].y = ts[i].pageY + canvas.offsetTop
  }
}, false)

addEventListener("touchmove", function(ev) {
  if (settings.debug) { diagnostic.logTouch(ev) }

  let ts = ev.changedTouches
  for (var i=0; i < ev.targetTouches.length; i++) {
    if (i > 0) break
    control['touch'+ts[i].identifier].x = ts[i].pageX + canvas.offsetLeft
    control['touch'+ts[i].identifier].y = ts[i].pageY + canvas.offsetTop
  }

}, false)

addEventListener("touchend", touchend, false)
addEventListener("touchcancel", touchend, false)


// --- MOUSE ---
const MouseButton = {
  // NONE:     0b00000,
  // LEFT:     0b00001,
  // RIGHT:    0b00010,
  // WHEEL:    0b00100,
  // FORWARD:  0b01000,
  // BACKWARD: 0b10000,
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  WHEEL: 4,
  FORWARD: 8,
  BACKWARD: 16,
}
function onMouseUpdate(e) {
  if (e.buttons & MouseButton.LEFT) {
    if (game.state == GameState.WORKS)
    {
      game.camera.force = {
        x: -e.movementX/(game.tileRB+game.tileShift)/Math.sqrt(3/Math.sqrt(2)),
        y: -(e.movementY - e.movementX/Math.sqrt(3))/Math.sqrt(3)/(game.tileShift+game.tileRB),
        time: 0
      }
      game.camera.x += game.camera.force.x
      game.camera.y += game.camera.force.y
      game.camera.test = Math.sqrt(game.camera.x*game.camera.x + game.camera.y*game.camera.y) 
    }
  }
  control.mouse.x = e.x - canvas.offsetLeft
  control.mouse.y = e.y - canvas.offsetTop

  control.mouse.test = { tx: 0, ty: 0, x: 0, y: 0, q: null}
  control.mouse.test.ty = (control.mouse.y - canvas.height/2)/(game.tileRB + game.tileShift)/Math.sqrt(3)*2
  control.mouse.test.tx = (control.mouse.x - canvas.width/2)/(game.tileRB + game.tileShift) - control.mouse.test.ty/2  
  control.mouse.test.x = Math.floor(control.mouse.test.tx)
  control.mouse.test.y = Math.floor(control.mouse.test.ty)
  control.mouse.test.q = Math.abs(control.mouse.test.tx-control.mouse.test.x + control.mouse.test.ty-control.mouse.test.y) > 1
  if (exMod(control.mouse.test.x,3)==exMod(control.mouse.test.y,3)) {
    if (control.mouse.test.q) {
      control.mouse.test.x++
      control.mouse.test.y++
    }
    control.mouse.test.y = (control.mouse.test.y - control.mouse.test.x)/3
    control.mouse.test.x += control.mouse.test.y
    control.mouse.test.q = control.mouse.test.q?0:3

  } else if (exMod(control.mouse.test.x,3)==exMod(control.mouse.test.y+1,3)) {
    control.mouse.test.y = (control.mouse.test.y + 1 - control.mouse.test.x) / 3
    control.mouse.test.x += control.mouse.test.y
    control.mouse.test.q = control.mouse.test.q?2:1
  } else if (exMod(control.mouse.test.x,3)==exMod(control.mouse.test.y+2,3)) {
    control.mouse.test.y = (control.mouse.test.y - control.mouse.test.x - 1) / 3
    control.mouse.test.x += 1 + control.mouse.test.y
    control.mouse.test.q = control.mouse.test.q?4:5
  }
  // control.mouse.test.x = Math.floor(++control.mouse.test.x/2)
  // control.mouse.test.y = Math.floor(++control.mouse.test.y/2)

  //x// Math.round((control.mouse.x - canvas.width/2)/(game.tileRB + game.tileShift)/3*2)
  //y// Math.round((control.mouse.y - canvas.height/2)/(game.tileRB + game.tileShift)/Math.sqrt(3))
  // {
  //   x: 0,//ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(i-this.camera.x),
  //   y: control.mouse.y - canvas.width/2// + (this.tileRB + this.tileShift)*Math.sqrt(3)*((i-this.camera.x)/2 + j-this.camera.y)
  // } 
}

addEventListener('mousemove', onMouseUpdate, false)
addEventListener('mouseenter', onMouseUpdate, false)

addEventListener("mousedown", function(e) {
  if (e.buttons & MouseButton.RIGHT) {
    // game.start()
    control.mouse.hold = {x: e.layerX, y: e.layerY }
  }
})
addEventListener("mouseup", function(e) {
  //general.fullScreen()

  switch (e.button) {
    case 0: //left
      if (game.camera.force) game.camera.force.time = 1000.0
      break;
    case 1: //wheel
      break;
    case 2: //right
      control.mouse.hold = null
      break;
  }
})
canvas.addEventListener("mousewheel", function(e) {
  game.tileShift += e.wheelDelta>0?1:-1
})


// --- KEYBOARD ---
addEventListener("keydown", function(e) {
  // if (e.ctrlKey || e.altKey) return
  // if ('type' in e && e['type'] == 'keydown') { console.log("key pressed '"+e.key+"'") }
  switch (e.key) {
    case settings.keys.left:
      control.keyboard.isGoLeft = true
      break
    case settings.keys.right:
      control.keyboard.isGoRight = true
      break
    case settings.keys.up:
      control.keyboard.isGoUp = true
      break
    case settings.keys.down:
      control.keyboard.isGoDown = true
      break
    case ' ':
      settings.debug = !settings.debug
      break
  }
})
addEventListener("keyup", function(e) {
  switch (e.key) {
    case settings.keys.left:
      control.keyboard.isGoLeft = false
      break
    case settings.keys.right:
      control.keyboard.isGoRight = false
      break
    case settings.keys.up:
      control.keyboard.isGoUp = false
      break
    case settings.keys.down:
      control.keyboard.isGoDown = false
      break
  }
})
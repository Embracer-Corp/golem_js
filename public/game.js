const GameState = {
  MENU: 0,
  WORKS: 1,
  PAUSED: 2
}

const game = {
  state: GameState.MENU,
  camera: {x:7, y:4},
  tileRB: 20,
  tileShift: 10,

  players: {},
  map: {width:0, height:0},  
  
  start: function(config) {
    this.map = config.map
    this.players = config.players 
    this.state = GameState.WORKS
  },
  logic: function(timePass) {
    if (this.camera.force && this.camera.force.time > 0) {
      game.camera.force.x /= 1+(timePass/300.0)
      game.camera.force.y /= 1+(timePass/300.0)
      game.camera.force.time -= timePass

      game.camera.x += game.camera.force.x
      game.camera.y += game.camera.force.y
      if (this.camera.force.time < timePass) {
        this.camera.force.time = 0
        this.camera.x = Math.round(game.camera.x)
        this.camera.y = Math.round(game.camera.y)
      }
    }
  },

  draw: function(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)
    ctx.font = "12px Lucida Console"
    
    // this.tileShift += timePass/500
    // if (this.tileShift > 15) {
    //   this.tileShift = 0
    //   this.camera.x = Math.floor(Math.random()*this.map.width)
    //   this.camera.y = Math.floor(Math.random()*this.map.height)
    // }
    
    for(let j = 0; j < (settings.screen.orientation == ScreenOrientation.PORTRAIT ? this.map.height : this.map.width); j++) {
      for(let i = 0; i < (settings.screen.orientation == ScreenOrientation.PORTRAIT? this.map.width : this.map.height); i++) {
        let x = ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(i-this.camera.x), y = ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*((i-this.camera.x)/2 + j-this.camera.y);
        let px = Math.floor(x), py =  Math.floor(y)
        //let x = Math.floor(ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*i), y = Math.floor(ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*(i%2?j+0.5:j));
        
        ctx.fillStyle = "#"+(i%2?"50":"66")+(j%2?"50":"66")+"66"
        ctx.beginPath()
        ctx.moveTo(Math.floor(x - (this.tileRB + this.tileShift)    ), Math.floor(y                                                  ))
        ctx.lineTo(Math.floor(x - ((this.tileRB + this.tileShift)/2)), Math.floor(y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.floor(x + ((this.tileRB + this.tileShift)/2)), Math.floor(y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.floor(x + (this.tileRB + this.tileShift)    ), Math.floor(y                                                  ))
        ctx.lineTo(Math.floor(x + ((this.tileRB + this.tileShift)/2)), Math.floor(y + (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.floor(x - ((this.tileRB + this.tileShift)/2)), Math.floor(y + (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.floor(x - (this.tileRB + this.tileShift)    ), Math.floor(y                                                  ))
        ctx.fill()
        
        ctx.strokeStyle = "#FACE8D"
        ctx.beginPath()
        ctx.moveTo(x - (this.tileRB), y)
        ctx.lineTo(x - (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
        ctx.lineTo(x + (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
        ctx.lineTo(x + (this.tileRB), y)
        ctx.lineTo(x + (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
        ctx.lineTo(x - (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
        ctx.lineTo(x - (this.tileRB), y)
        ctx.stroke()

        let text = i+","+j
        ctx.fillStyle = (i == this.camera.x && j == this.camera.y)?"#FF8822":"#FACE8D"
        ctx.fillText(text, x - ctx.measureText(text).width/2, y+4)

        if (i == this.camera.x && j == this.camera.y) {
          ctx.beginPath(); ctx.arc(x, y, (this.tileRB + this.tileShift)*Math.sqrt(3)/2, 0, 2 * Math.PI, false); ctx.stroke()
          ctx.beginPath(); ctx.arc(x, y, (this.tileRB + this.tileShift), 0, 2 * Math.PI, false); ctx.stroke()
        }

        ctx.fillStyle = "#000000FF"
        ctx.fillRect(ctxWidth/2-1,ctxHeight/2-1,2,2)

        // let tx = Math.round(game.camera.x), ty = Math.round(game.camera.y)
        // if (i == tx && j == ty) {
        //   text = tx + "," + ty
        //   ctx.fillText(text, x - ctx.measureText(text).width/2, y+4)
        //}
      }
    }

    
    
    ctx.strokeStyle = "#333"
    for(let i = 0; i < 15; i++) {
      ctx.beginPath(); ctx.arc(ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(0-this.camera.x), ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*((0-this.camera.x)/2 + 0-this.camera.y), (this.tileRB + this.tileShift)*i*Math.sqrt(3), 0, 2 * Math.PI, false); ctx.stroke()
    }
    
    
    control.drawStick(ctx, ctxWidth, ctxHeight, timePass)
    if (settings.debug) {
      diagnostic.drawFpsInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

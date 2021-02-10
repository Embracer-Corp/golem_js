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
        
        ctx.fillStyle = "#FACE8D"//"#"+(i%2?"50":"66")+(j%2?"50":"66")+"66"
        ctx.beginPath()
        ctx.moveTo(Math.floor(x - (this.tileRB + this.tileShift)    ), Math.floor(y                                                  ))
        ctx.lineTo(Math.floor(x - ((this.tileRB + this.tileShift)/2)), Math.floor(y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.ceil (x + ((this.tileRB + this.tileShift)/2)), Math.floor(y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
        ctx.lineTo(Math.ceil (x + (this.tileRB + this.tileShift)    ), Math.floor(y                                                  ))
        ctx.lineTo(Math.ceil (x + ((this.tileRB + this.tileShift)/2)), Math.floor(y + (Math.sqrt(3)*(this.tileRB + this.tileShift)/2)))
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
      }
    }

    control.drawStick(ctx, ctxWidth, ctxHeight, timePass)
    if (settings.debug) {
      diagnostic.drawFpsInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

const GameState = {
  MENU: 0,
  WORKS: 1,
  PAUSED: 2
}

const game = {
  state: GameState.MENU,
  camera: {x:0, y:0},
  tileRB: 20,
  tileShift: 3,

  players: {},
  map: {width:0, height:0},  
  
  start(config) {
    this.map = config.map
    this.players = config.players 
    this.state = GameState.WORKS
  },
  logic(timePass) {

  },

  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight)
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)
    ctx.font = "12px Lucida Console"
    
    // this.tileShift += timePass/500
    // if (this.tileShift > 5) this.tileShift = 0
    
    for(let j = 0; j < (settings.screen.orientation == ScreenOrientation.PORTRAIT ? this.map.height : this.map.width); j++) {
      for(let i = 0; i < (settings.screen.orientation == ScreenOrientation.PORTRAIT? this.map.width : this.map.height); i++) {
        ctx.fillStyle = "#FACE8D" //(i+j)%2?"#656565":"#707070"
        ctx.strokeStyle = "#FACE8D"
        // let x = Math.floor(ctxWidth/2 + (this.tileRB + this.tileShift)*3*(i+j/2)), y = Math.floor(ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)/2*j);
        let x = Math.floor(ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*i), y = Math.floor(ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*(i%2?j+0.5:j));
        
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
        ctx.fillText(text, x - ctx.measureText(text).width/2, y+4)
        // ctx.fillRect(ctxWidth/2 + (this.tileRB + this.tileShift)*i, ctxHeight/2 + (this.tileRB + this.tileShift)*j, this.tileRB, this.tileRB)
      }
    }

    control.drawStick(ctx, ctxWidth, ctxHeight, timePass)
    if (settings.debug) {
      diagnostic.drawFpsInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

const GameState = {
  MENU: 0,
  WORKS: 1,
  PAUSED: 2
}

const game = {
  state: GameState.MENU,
  camera: {x:10, y:10},
  tileRB: 50,
  tileShift: 0,

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
    let clr = rgbToHsv(hexToRgb("#FACE8D"))
    
    for(let j = 0; j < (settings.screen.orientation == ScreenOrientation.PORTRAIT ? this.map.height : this.map.width); j++) {
      for(let i = 0; i < (settings.screen.orientation == ScreenOrientation.PORTRAIT? this.map.width : this.map.height); i++) {
        let x = ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(i-this.camera.x), y = ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*((i-this.camera.x)/2 + j-this.camera.y);
        let px = Math.floor(x), py =  Math.floor(y)
        //let x = Math.floor(ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*i), y = Math.floor(ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*(i%2?j+0.5:j));
        
        ctx.fillStyle = "#"+(i%2?"50":"66")+(j%2?"50":"66")+"66"
        
        ctx.beginPath()
        ctx.moveTo(x - (this.tileRB + this.tileShift), y)
        ctx.lineTo(x - ((this.tileRB + this.tileShift)/2), y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2))
        ctx.lineTo(x + ((this.tileRB + this.tileShift)/2), y - (Math.sqrt(3)*(this.tileRB + this.tileShift)/2))
        ctx.lineTo(x + (this.tileRB + this.tileShift), y)
        ctx.lineTo(x + ((this.tileRB + this.tileShift)/2), y + (Math.sqrt(3)*(this.tileRB + this.tileShift)/2))
        ctx.lineTo(x - ((this.tileRB + this.tileShift)/2), y + (Math.sqrt(3)*(this.tileRB + this.tileShift)/2))
        ctx.lineTo(x - (this.tileRB + this.tileShift), y)
        ctx.fill()

        // lines
        // ctx.strokeStyle = "#94c"
        // ctx.beginPath()
        // ctx.moveTo(x - (this.tileRB), y)
        // ctx.lineTo(x - (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
        // ctx.lineTo(x + (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
        // ctx.lineTo(x + (this.tileRB), y)
        // ctx.lineTo(x + (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
        // ctx.lineTo(x - (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
        // ctx.lineTo(x - (this.tileRB), y)
        // ctx.stroke()
        
        ctx.fillStyle = "#b63"
        if (i == this.camera.x && j == this.camera.y) {
          ctx.fillStyle = "#72b"
          // ctx.beginPath(); ctx.arc(x, y, (this.tileRB + this.tileShift)*Math.sqrt(3)/2, 0, 2 * Math.PI, false); ctx.stroke()
          // ctx.beginPath(); ctx.arc(x, y, (this.tileRB + this.tileShift), 0, 2 * Math.PI, false); ctx.stroke()
        }
        let text = i+","+j
        ctx.fillText(text, x - ctx.measureText(text).width/2, y+4)

        ctx.fillStyle = "#000000FF"
        ctx.fillRect(ctxWidth/2-1,ctxHeight/2-1,2,2)

        // let tx = Math.round(game.camera.x), ty = Math.round(game.camera.y)
        // if (i == tx && j == ty) {
        //   text = tx + "," + ty
        //   ctx.fillText(text, x - ctx.measureText(text).width/2, y+4)
        //}
      }
    }

    {
      //let cx = this.camera.x % 1, cy = this.camera.y % 1
      let x = ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(control.mouse.test.x/*-cx*/), y = ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*((control.mouse.test.x/*-cx*/)/2 + control.mouse.test.y/*-cy*/);
      // lines
      ctx.strokeStyle = "#94c"
      ctx.beginPath()
      ctx.moveTo(x - (this.tileRB), y)
      if (control.mouse.test.q == 0) { ctx.lineTo(x, y) }
      ctx.lineTo(x - (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
      if (control.mouse.test.q == 1) { ctx.lineTo(x, y) }
      ctx.lineTo(x + (this.tileRB/2), y - (Math.sqrt(3)*this.tileRB/2))
      if (control.mouse.test.q == 2) { ctx.lineTo(x, y) }
      ctx.lineTo(x + (this.tileRB), y)
      if (control.mouse.test.q == 3) { ctx.lineTo(x, y) }
      ctx.lineTo(x + (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
      if (control.mouse.test.q == 4) { ctx.lineTo(x, y) }
      ctx.lineTo(x - (this.tileRB/2), y + (Math.sqrt(3)*this.tileRB/2))
      if (control.mouse.test.q == 5) { ctx.lineTo(x, y) }
      ctx.lineTo(x - (this.tileRB), y)
      ctx.stroke()
    }
    
    // for(let i = 0; i < 15; i++) {
    //   ctx.strokeStyle = i%2?"#442222":"#112811"
    //   ctx.beginPath(); ctx.arc(ctxWidth/2 + (this.tileRB + this.tileShift)*3/2*(10-this.camera.x), ctxHeight/2 + (this.tileRB + this.tileShift)*Math.sqrt(3)*((10-this.camera.x)/2 + 10-this.camera.y), (this.tileRB + this.tileShift)*i*Math.sqrt(3), 0, 2 * Math.PI, false); ctx.stroke()
    // }
    
    
    control.drawStick(ctx, ctxWidth, ctxHeight, timePass)
    if (settings.debug) {
      diagnostic.drawFpsInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

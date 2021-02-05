const ScreenOrientation = { // iOS Safari doesn't support original enum
  PORTRAIT: 1,
  LANDSCAPE: 2,
  UNKNOWN: 0
}

const settings = {
  screen: {width: 0, height: 0, orientation: ScreenOrientation.UNKNOWN, offset: {x: 0, y: 0}},
  keys: {left: 'a', right: 'd', up: 'w', down: 's'},
  debug: false
}

const menu = {
  logic(timePass) {
    let dy = document.fullscreenElement == null ? 4 : 0 // without this bottom 4px page will get a lot of glitch 
    settings.screen.width = document.documentElement.clientWidth
    settings.screen.height = document.documentElement.clientHeight - dy

    let ls = settings.screen.width > settings.screen.height
    settings.screen.orientation = ls ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT
    // if (!ls) {
    //   let tx = Math.floor(settings.screen.width/game.map.width), ty = Math.floor((settings.screen.height-4)/game.map.height)
    //   game.map.cellSize = Math.min(tx, ty)
    //   settings.screen.offset.x = Math.floor((settings.screen.width - game.map.cellSize*game.map.width)/2)
    //   settings.screen.offset.y = dy + Math.floor((settings.screen.height - dy - game.map.cellSize*game.map.height)/2) // for symmetry cut off top 4px
    // } else {
    //   let tx = Math.floor(settings.screen.width/game.map.height), ty = Math.floor((settings.screen.height-4)/game.map.width)
    //   game.map.cellSize = Math.min(tx, ty)
    //   settings.screen.offset.x = Math.floor((settings.screen.width - game.map.cellSize*game.map.height)/2)
    //   settings.screen.offset.y = dy + Math.floor((settings.screen.height - dy - game.map.cellSize*game.map.width)/2)
    // }
  },
  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctxWidth = canvas.width = settings.screen.width
    ctxHeight = canvas.height = settings.screen.height
    
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)
    ctx.font = "18px Lucida Console";
  
    ctx.fillStyle = "#549423";
    ctx.fillRect(20,20,150,50) // settings.screen.orientation == ScreenOrientation.PORTRAIT
    ctx.fillStyle = "#ccc";
    ctx.fillRect(20,130,350,140)
    ctx.fillText("Players:", 30, 110)
    ctx.fillStyle = "#B3370B";
    ctx.fillRect(20,430,150,50)
  
    for(let i = 0; i < players.length; i++)
    {
      ctx.fillStyle = players[i] == nickname?"#B3370B":"#333";
      ctx.fillText(players[i], 30, 160 + i*30)
    }
  
    ctx.fillStyle = "#000";
    ctx.fillText("Connect", 55, 50)
    ctx.fillText("Start", 65, 460)
    
    // let text = "START"
    // let bx = ctx.measureText(text).width * 1.2, by = 72 * 1.2
    // ctx.fillRect((ctxWidth - bx)/2, (ctxHeight - by)/2, bx, by)
    // ctx.fillText(text, (ctxWidth - ctx.measureText(text).width)/2, (ctxHeight + 50)/2)

    if (settings.debug) {
      diagnostic.drawScreenInfo(ctx, ctxWidth, ctxHeight, timePass)
      diagnostic.drawFingerInfo(ctx, ctxWidth, ctxHeight, timePass)
    }
  }
}

const pause = {
  draw(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.fillStyle = "#00000090" // 00 -> 90
    ctx.fillRect(0, 0, ctxWidth, ctxHeight)
  }
}
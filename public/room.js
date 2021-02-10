const exampleNames = ["test", "john", "default", "anykey", "subzero", "no1"]

var players = []
var nickname = null

const room = {
  draw: function(ctx, ctxWidth, ctxHeight, timePass) {
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

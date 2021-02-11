const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

var fps = 1000/100
var lps = 1000/100

// ----- Math -----
function lerp(v1, v2, w) {
  return v1 + w * (v2 - v1)
}
// ----- Vector -----
function normalize(vector, scale) {
  var norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  if (norm != 0) {
    vector.x = scale * vector.x / norm
    vector.y = scale * vector.y / norm
  }
}
function multiplication(vector, scale) {
  vector.x *= scale
  vector.y *= scale
}
// ----- Colors -----
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function componentToHex(c) {
  if (c <= 1) { c = Math.round(c*255) }
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  if (typeof(r) == "object") {
    return rgbToHex(r.r?r.r:r.h, r.g?r.g:r.s, r.b?r.b:r.v)
  } else return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rgbToHsv(r, g, b) {
  if (typeof(r) == "string") {
    // console.dir(hexToRgb(r))
    return rgbToHex(rgbToHsv(hexToRgb(r)))
  } else if (typeof(r) == "object") {
    return rgbToHsv(r.r, r.g, r.b)
  } else if (typeof(r) != "number" || typeof(g) != "number" || typeof(b) != "number") {
    return null
  }
  
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255

  switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  return { h: h, s: s, v: v }
}

function hsvToRgb(h, s, v) {
  if (typeof(h) == "string") {
    return rgbToHex(hsvToRgb(hexToRgb(h)))
  } else if (typeof(h) == "object") {
    return hsvToRgb(h.h?h.h:h.r, h.s?h.s:h.g, h.v?h.v:h.b)
  } else if (typeof(h) != "number" || typeof(s) != "number" || typeof(v) != "number") {
    return null
  }

  var r, g, b,
      i = Math.floor(h * 6),
      f = h * 6 - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)

  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}



const general = {
  fps: 1000/100,
  lps: 1000/100,
  isOpera: null,//(!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
  isFirefox: null,//typeof InstallTrigger !== 'undefined',
  isSafari: null,///constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)),
  isIE: null,//!!document.documentMode,
  isEdge: null,//!this.isIE && !!window.StyleMedia,
  isChrome: null,///Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  // isEdgeChromium: this.isChrome && /Edg/.test(navigator.userAgent),
  // isBlink: (this.isChrome || this.isOpera) && !!window.CSS,
  init: function() {
    this.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
    this.isFirefox = typeof InstallTrigger !== 'undefined'
    this.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification))
    this.isIE = !!document.documentMode
    this.isEdge = !this.isIE && !!window.StyleMedia
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

    this.fullScreen = function() {



      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // if (this.isChrome || this.isSafari) { canvas.webkitRequestFullscreen() }
        // else if (isIE) { canvas.requestFullscreen() }

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
          if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
          } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen(); // Firefox
          } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen(); // Chrome and Safari
          } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen(); // IE
          }
        }
        // canvas.webkitRequestFullscreen()
      }
    }
  }
}

addEventListener("load", function() {
  general.init()

  // Logic loop
  let lastTimeLogic = Date.now()
  setInterval(function() {
    let timePass = Date.now() - lastTimeLogic
    
    if (timePass < lps) {
        return
    } else if (timePass > 4 * lps) { // hard mistiming
      lastTimeLogic = Date.now()
        timePass = 4 * lps
    }
    if(game.state == GameState.MENU) {
      menu.logic(timePass)
    } else if(game.state == GameState.WORKS) {
      game.logic(timePass)
    }
  }, 10)
  
  // Graphic loop
  let lastTimeDraw = Date.now()
  setInterval(function() {
    let timePass = Date.now() - lastTimeDraw
    if (timePass < fps) {
        return
    }
    // diagnostic.test(timePass)
  
    if(game.state == GameState.MENU) {
      //menu.draw(canvasContext, canvas.width, canvas.height, timePass)
      room.draw(canvasContext, canvas.width, canvas.height, timePass)
    } else if(game.state == GameState.WORKS) {
      game.draw(canvasContext, canvas.width, canvas.height, timePass)
    }
  
    lastTimeDraw += timePass
  }, 10)
})

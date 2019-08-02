let timeStart

export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (cb) {
    window.setTimeout(() => {
      let timeCurrent = new Date().getTime()
      if (!timeStart) {
        timeStart = timeCurrent
      }
      let timeElapsed = timeCurrent - timeStart
      cb(timeElapsed)
    }, 100 / 6)
  }

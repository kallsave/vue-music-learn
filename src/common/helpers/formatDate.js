// 很强大的转化格式,核心是把y,m,d,h,m,s替换成正确的数字,其他符号保留
export function formatDate (date, fmt) {
  // 如果有年份需求,可能是yyyy-MM-dd也可能是yy-MM-dd
  if (/(y+)/.test(fmt)) {
    // RegExp内存指向/(y+)/
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let k in o) {
    // es6正则写变量非常方便,用()定位,用RegExp.$1捕获
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k]
      fmt = fmt.replace(RegExp.$1, padLeftZero(str))
    }
  }

  return fmt
}

function padLeftZero (str) {
  str = str + ''
  return ('00' + str).substr(str.length)
}

// 倒计时,最大时间单位:天
export function getDHMS (interval) {
  let seconds = interval % 60
  let minutes = (interval - seconds) % (60 * 60) / 60
  let hours = (interval - seconds - minutes * 60) % (60 * 60 * 24) / (60 * 60)
  let days = interval / (60 * 60 * 24) | 0
  return {
    days: padLeftZero(days),
    hours: padLeftZero(hours),
    minutes: padLeftZero(minutes),
    seconds: padLeftZero(seconds)
  }
}

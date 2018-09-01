export function formatDate(date, fmt) {
  // 如果有年份需求,可能是yyyy-MM-dd也可能是yy-MM-dd
  if (/(y+)/.test(fmt)) {
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
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, padLeftZero(str))
    }
  }

  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

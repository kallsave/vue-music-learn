import originJsonp from 'jsonp'
// res.code
export const API_OK = 0
// 错误message
export const API_ERROR = 'API_ERROR'

// 接口共同的参数
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

// jsonp回调参数
export const options = {
  param: 'jsonpCallback',
  // 1s如果没有请求成功就报错
  timeout: 1000
}

// 拼接url参数成url
export function param(originUrl, data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  url = url ? url.substring(1) : ''

  originUrl += (originUrl.indexOf('?') === -1 ? '?' : '&') + url

  return originUrl
}

// 把jsonp封装成类似axios的风格
export function jsonp({url = '', data = {}, options = {param: 'jsonpCallback', timeout: 1000}} = {}) {
  url = param(url, data)

  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(API_ERROR)
      }
    })
  })
}

// apiHandler方法主要作用是统一ajax请求处理Promise的catch
// 这个方法通用于于任何ajax请求,所以不统一在这里做请求拦截处理
export function apiHandler(callback) {
  return new Promise((resolve, reject) => {
    callback().then((data) => {
      resolve(data)
    }).catch((message) => {
      console.log(message)
      switch (message) {
        case API_ERROR:
          console.log('接口错误')
          break
        default:
          console.log('默认的处理')
          break
      }
    })
  })
}

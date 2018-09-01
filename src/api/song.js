import {
  commonParams,
  API_OK,
  API_ERROR,
  apiHandler,
} from './config'

import axios from 'axios'

const baseURL = process.env.baseURL

const instance = axios.create({
  baseURL: baseURL,
  validateStatus(status) {
    // 默认的status在200~300会Promise.resolve(res)
    // return status >= 200 && status < 300
    // 但是这个方法只是针对statusCode,不能对自定义的code做处理
    // 统一在instance.interceptors.response设置
    return true
  }
})

// 响应拦截器,对404等或者后端自定义的code错误
instance.interceptors.response.use((response) => {
  if (response.request.responseURL.indexOf('lyric/fcgi-bin/fcg_query_lyric_new.fcg') !== -1) {
    /* eslint no-useless-escape: "off" */
    response.data = response.data.replace(/^\w+\((.*)\)$/g, '$1')
    response.data = JSON.parse(response.data)
  }
  // 根据后台设置的code逻辑做处理
  if ((response.status === 200 || response.status === '200') && response.data.code === API_OK) {
    return Promise.resolve(response)
  } else {
    console.log(response)
    return Promise.reject(API_ERROR)
  }
})

export function getLyric(params) {
  const url = 'lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  const data = Object.assign({}, commonParams, params)
  return apiHandler(() => {
    return instance({
      method: 'get',
      url: url,
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
  })
}

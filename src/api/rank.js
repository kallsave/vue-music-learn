import {
  jsonp,
  commonParams,
  API_OK,
  API_ERROR,
  apiHandler,
} from './config'

import { multiDeepClone } from '@/common/helpers/utils.js'

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
  // 根据后台设置的code逻辑做处理
  if ((response.status === 200 || response.status === '200') && response.data.code === API_OK) {
    return Promise.resolve(response)
  } else {
    console.log(response)
    return Promise.reject(API_ERROR)
  }
})

export function getTopList(params = {}) {
  const defaultParams = {
    uin: '0',
    format: 'json',
    platform: 'h5',
    needNewCode: '1',
  }
  const data = multiDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    return instance({
      method: 'get',
      url: 'v8/fcg-bin/fcg_myqq_toplist.fcg',
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
  })
}

// jsonp接口
export function getMusicList(params = {}) {
  const defaultParams = {
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  }
  const data = multiDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    // url是基础url, data是url参数, options是jsonp的回调参数
    return jsonp({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
      data: data,
    })
  })
}

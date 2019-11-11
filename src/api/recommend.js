import {
  jsonp,
  commonParams,
  API_OK,
  API_ERROR,
  apiHandler,
} from './config'

import { deepClone } from '@/common/helpers/utils.js'

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
instance.interceptors.response.use((response, b, c) => {
  if (response.request.responseURL.indexOf('qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg') !== -1) {
    /* eslint no-useless-escape: "off" */
    response.data = response.data.replace(/^\w+\((.*)\)$/g, '$1')
    response.data = JSON.parse(response.data)
  }
  if (response.status === 200 && response.data.code === API_OK) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(API_ERROR)
  }
})

// jsonp接口
export function getRecommend(params = {}) {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const defaultParams = {
    platform: 'h5',
    vin: 0,
    needNewCode: 1
  }
  const data = deepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    // url是基础url, data是url参数, options是jsonp的回调参数
    return jsonp({
      url,
      data,
    })
  })
}

export function getDiscList(params = {}) {
  const url = 'splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const defaultParams = {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  }
  const data = deepClone({}, commonParams, defaultParams, params)
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

export function getSongList(params = {}) {
  const url = 'qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const defaultParams = {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
  }
  const data = deepClone({}, commonParams, defaultParams, params)
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

import {
  jsonp,
  commonParams,
  API_OK,
  API_ERROR,
  apiHandler,
} from './config'

import { mulitDeepClone } from '@/common/helpers/utils.js'

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
  if (response.request.responseURL.indexOf('qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg') !== -1) {
    /* eslint no-useless-escape: "off" */
    response.data = response.data.replace(/^\w+\((.*)\)$/g, '$1')
    response.data = JSON.parse(response.data)
  }
  if ((response.status === 200) && response.data.code === API_OK) {
    return Promise.resolve(response)
  } else {
    console.log(response)
    return Promise.reject(API_ERROR)
  }
})

// jsonp接口
export function getHotKey(params = {}) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const defaultParams = {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  }
  const data = mulitDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    // url是基础url, data是url参数, options是jsonp的回调参数
    return jsonp({
      url,
      data,
    })
  })
}

export function search(params = {}) {
  const url = 'soso/fcgi-bin/search_for_qq_cp'
  const defaultParams = {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all'
  }
  const data = mulitDeepClone({}, commonParams, defaultParams, params)
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

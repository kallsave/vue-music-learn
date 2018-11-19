import {
  jsonp,
  commonParams,
  API_OK,
  API_ERROR,
  apiHandler,
} from './config'

import { mulitDeepClone } from '@/common/helpers/utils.js'

// jsonp接口
export function getSingerList(params = {}) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const defaultParams = {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  }
  const data = mulitDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    return jsonp({
      url,
      data,
    })
  })
}

export function getSingerDetail(params = {}) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const defaultParams = {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
  }
  const data = mulitDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    return jsonp({
      url,
      data,
    })
  })
}

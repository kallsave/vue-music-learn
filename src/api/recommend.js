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

export function getRecommend() {
  const url = '/cgi-bin/musicu.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      'comm': { 'ct': 24 },
      'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': { 'async': 1, 'cmd': 2 },
        'module': 'playlist.HotRecommendServer'
      },
      'playlist': {
        'method': 'get_playlist_by_category',
        'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
        'module': 'playlist.PlayListPlazaServer'
      },
      'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
      'new_album': {
        'module': 'newalbum.NewAlbumServer',
        'method': 'get_new_album_info',
        'param': { 'area': 1, 'sin': 0, 'num': 10 }
      },
      'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
      'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
      'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
    }
  })

  return axios({
    baseURL,
    url,
    params: data
  }).then((res) => {
    return res.data
  })
}

export function getDiscList(params = {}) {
  const url = '/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
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
  const data = multiDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    return axios({
      baseURL: '/api',
      method: 'get',
      url: url,
      params: data
    }).then((res) => {
      const data = JSON.parse(res.data.replace(/^MusicJsonCallback\((.*)?\)/g, '$1'))
      return data
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
  const data = multiDeepClone({}, commonParams, defaultParams, params)
  return apiHandler(() => {
    return axios({
      method: 'get',
      url: url,
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
  })
}

import { getLyric } from '@/api/song.js'
import { Base64 } from 'js-base64'
import { param } from '@/api/config.js'

export default class Song {
  constructor({id, mid, singer, name, album, duration, strMediaMid, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.strMediaMid = strMediaMid
    this.image = image
    this.url = url
  }

  getLyric() {
    return new Promise((resolve, reject) => {
      getLyric({
        songmid: this.mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
      }).then((res) => {
        this.lyric = Base64.decode(res.lyric)
        resolve(this.lyric)
      })
    })
  }
}

export function createSong (musicData) {
  const url = param(`http://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a`, {
    guid: 5257709642,
    vkey: '36ACCB0876F6A7E80A9BF21B14F0E3B902AB635E0876A79F9025833BC4ED2D7BE71EE9BA6A5E0B25EDDFC897194D58EDB9B67835A334570D',
    uin: 0,
    fromtag: 38
  })

  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    strMediaMid: musicData.strMediaMid,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: url
  })
}

function filterSinger (singer) {
  let result = []
  if (!singer) {
    return ''
  }
  singer.forEach((item) => {
    result.push(item.name)
  })
  return result.join('/')
}

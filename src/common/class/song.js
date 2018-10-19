import { getLyric } from '@/api/song.js'
import { Base64 } from 'js-base64'
import { param } from '@/api/config.js'

// 给localStorage的缓存添加类使用这个函数
export class Song {
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
        pcachetime: new Date(),
        format: 'json'
      }).then((res) => {
        this.lyric = Base64.decode(res.lyric)
        resolve(this.lyric)
      })
    })
  }
}

// 从接口处理数据使用这个函数
export function createSong (musicData) {
  const url = param(`http://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a`, {
    guid: '7211746940',
    vkey: '928BE633ADACF861DA44C1F9591BB71B6D2487CD5F798D4E3E9EB21CD43AA17C39E8336375B81816ED709E911F273E72887C8BF326FEE42C',
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
  if (singer instanceof String) {
    return singer
  }
  if (singer instanceof Array) {
    singer.forEach((item) => {
      result.push(item.name)
    })
    return result.join('/')
  }
}

<template>
  <music-list
    :is-fetch-song-list="isFetchSongList"
    :song-list="songList"
    :bg-image="bgImage"
    :title="title">
  </music-list>
</template>

<script>
import MusicList from '../../components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend.js'
import { createSong } from '@/common/class/song.js'

export default {
  name: 'detail-recommend',
  components: {
    MusicList
  },
  data() {
    return {
      songList: [],
      isFetchSongList: false
    }
  },
  mounted() {
    console.log('detail mounted')
    this._getSongList()
  },
  computed: {
    ...mapGetters([
      'recommendAlbum'
    ]),
    title() {
      return this.recommendAlbum.dissname
    },
    bgImage() {
      return this.recommendAlbum.imgurl
    },
  },
  methods: {
    _getSongList() {
      // store失效返回上层
      if (!this.recommendAlbum.dissid) {
        this.$router.push('IndexRecommend')
        return
      }
      getSongList({
        disstid: this.recommendAlbum.dissid
      }).then((res) => {
        window.setTimeout(() => {
          this.songList = this._normalizeSongList(res.cdlist[0].songlist)
          this.isFetchSongList = true
        }, 500)
      })
    },
    _normalizeSongList(list) {
      let result = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          result.push(createSong(musicData))
        }
      })
      return result
    }
  }
}
</script>

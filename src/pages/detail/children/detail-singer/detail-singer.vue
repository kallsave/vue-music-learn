<template>
  <transition name="slide">
    <music-list
      :is-fetch-song-list="isFetchSongList"
      :song-list="songList"
      :bg-image="bgImage"
      :title="title"></music-list>
  </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer.js'
import { createSong } from '@/common/class/song.js'

export default {
  data() {
    return {
      songList: [],
      isFetchSongList: false
    }
  },
  mounted() {
    this._getSingerDetail()
  },
  computed: {
    ...mapGetters([
      'singer',
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
  },
  methods: {
    _getSingerDetail() {
      // store失效返回上层
      if (!this.singer.id) {
        this.$router.push('/index/singer')
        return
      }
      this.isFetchSongList = false
      getSingerDetail({
        singermid: this.singer.id
      }).then((res) => {
        window.setTimeout(() => {
          this.songList = this._normalizeSongList(res.data.list)
          this.isFetchSongList = true
        }, 500)
      })
    },
    _normalizeSongList(list) {
      let result = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid && musicData.strMediaMid) {
          result.push(createSong(musicData))
        }
      })
      return result
    }
  },
  components: {
    MusicList
  }
}
</script>

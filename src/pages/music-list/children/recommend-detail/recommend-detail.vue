<template>
  <transition name="router-slide">
    <music-list
      :isFetchSongList="isFetchSongList"
      :song-list="songList"
      :bg-image="bgImage"
      :title="title"></music-list>
  </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/recommend.js'
import { createSong } from '@/common/class/song.js'

export default {
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
    this._getSongList()
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
  },
  methods: {
    _getSongList() {
      // store失效返回上层
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList({
        disstid: this.disc.dissid
      }).then((res) => {
        setTimeout(() => {
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

<style lang="stylus" scoped>
@import "~@/common/stylus/transition.styl"
</style>

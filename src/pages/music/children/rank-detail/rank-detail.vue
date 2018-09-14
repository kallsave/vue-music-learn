<template>
  <music-list
    :rank="true"
    :isFetchSongList="isFetchSongList"
    :song-list="songList"
    :bg-image="bgImage"
    :title="title"></music-list>
</template>

<script>
import MusicList from '../../components/music-list/music-list.vue'
import { mapGetters } from 'vuex'
import { getMusicList } from '@/api/rank.js'
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
    this._getMusicList()
  },
  computed: {
    ...mapGetters([
      'rankAlbum'
    ]),
    title() {
      return this.rankAlbum.topTitle
    },
    bgImage() {
      if (this.songList.length) {
        return this.songList[0].image
      }
      return ''
    },
  },
  methods: {
    _getMusicList() {
      // store失效返回上层
      if (!this.rankAlbum.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList({
        topid: this.rankAlbum.id
      }).then((res) => {
        this.songList = this._normalizeSongList(res.songlist)
        this.isFetchSongList = true
      })
    },
    _normalizeSongList(list) {
      let result = []
      list.forEach((item) => {
        const musicData = item.data
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
</style>

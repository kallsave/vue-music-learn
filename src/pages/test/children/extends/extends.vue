<script>
import VSource from './components/source.vue'
import mixins from './mixins/mixins.js'

// 优先级:私有的方法 > mixins > extends继承来的
// 如果组件没有template,将沿用extends的template
// data.computed等等如果有相同的属性则覆盖,没有则继承

export default {
  extends: VSource,
  mixins: [
    mixins
  ],
  data() {
    return {
      ajaxList: []
    }
  },
  computed: {
    list() {
      return this.ajaxList
    }
  },
  mounted() {
    this.show()
    this.showText()
    window.setTimeout(() => {
      this.ajaxList = [2]
      console.log(this.list)
      console.log(this.map)
    })
  },
  methods: {
  },
}
</script>

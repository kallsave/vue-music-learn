<template>
  <div class="component">
    <div class="title">666</div>
    <keep-alive :include="['a-component', 'b-component']">
      <component :is="currentComponent" :a="'a'" :b="'b'"></component>
    </keep-alive>
    <div class="toggle"
      @click="toggle"></div>
  </div>
</template>

<script>
import A from './components/a.vue'
import B from './components/b.vue'
export default {
  data() {
    return {
      currentComponent: A,
      isShowA: true
    }
  },
  mounted() {
  },
  methods: {
    toggle() {
      this.isShowA = !this.isShowA
      if (this.isShowA) {
        this.currentComponent = A
      } else {
        this.currentComponent = B
      }
    }
  }
}
</script>

<style lang="stylus" modules>
.component
  height: 100vh
  .title
    font-size: 16px
  .toggle
    width: 50px;
    height: 50px;
    background: #058;
</style>

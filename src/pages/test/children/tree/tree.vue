<template>
  <div class="tree">
    <tree-folder :list="list"></tree-folder>
  </div>
</template>

<script>
import Vue from 'vue'

import TreeFolder from './components/tree-folder/tree-folder.vue'

Vue.component(TreeFolder.name, TreeFolder)

export default {
  components: {
    TreeFolder
  },
  data() {
    return {
      list: [
        {
          title: '1',
          children: [
            {
              title: '2',
              children: [
                {
                  title: '3',
                },
                {
                  title: '3',
                }
              ]
            },
            {
              title: '2',
              children: [
                {
                  title: '3',
                },
                {
                  title: '3',
                }
              ]
            },
          ]
        },
        {
          title: '1',
          children: [
            {
              title: '2',
              children: [
                {
                  title: '3',
                },
                {
                  title: '3',
                }
              ]
            },
            {
              title: '2',
              children: [
                {
                  title: '3',
                },
                {
                  title: '3',
                }
              ]
            },
          ]
        },
      ]
    }
  }
}
</script>

<style>

</style>

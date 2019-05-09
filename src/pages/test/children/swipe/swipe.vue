<template>
  <div class="swipe">
    <div class="scroll-wrapper">
      <vi-scroll
        :options="options">
        <vi-swipe-group
          :is-relative="false"
          @active-index-change="activeIndexChange">
          <vi-collapse-transition-group tag="ul">
            <li class="swipe-item-wrapper"
              v-for="(data, index) in swipeData" :key="data.item.name">
              <vi-swipe
                :index="index"
                :menu-list="data.btns"
                @menu-click="menuClick"
                @confirm="confirm">
                <div class="item-inner"
                  @click="clickHandler">{{data.item.name}}</div>
              </vi-swipe>
            </li>
          </vi-collapse-transition-group>
        </vi-swipe-group>
      </vi-scroll>
    </div>
  </div>
</template>

<script>
const customData = [
  {
    item: {
      id: '3646653877',
      name: '还不是因为你长得不好看',
      desc: '伤感：歌词再狠，也抵不过现实伤人',
      imgurl: 'http://p.qpic.cn/music_cover/MhQ4bJBPt3Yt5icXyBGNhyPJnE9O51CqaN72iaDgvFmDKaia12UFhU5uQ/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: {
          'background-color': '#c8c7cd',
          'color': '#fff'
        }
      },
      {
        content: '删除',
        style: {
          'background-color': '#ff3a32',
          'color': '#fff'
        },
      }
    ]
  },
  {
    item: {
      id: '1789676645',
      name: '秋水浮萍任飘渺',
      desc: '『武侠配乐』快意恩仇江湖情',
      imgurl: 'http://p.qpic.cn/music_cover/8KfvDey9cibtZ5xkWxRic6vhXgdPic3wnB7reibI4pdPQBCP8u57uqcjsQ/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: {
          'background-color': '#ff3a32',
          'color': '#fff'
        }
      }
    ]
  },
  {
    item: {
      id: '3649034125',
      name: '念葳蕊',
      desc: '江海迦：热恋后哼一首歌为自己悲悯的歌',
      imgurl: 'http://p.qpic.cn/music_cover/jXFicBvicUcfIWSoCNT1OrbAoHG2fqqnrJVnGV4iaLCapWUpCKqbmAicJg/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '2977781451',
      name: '风少',
      desc: '午后甜点：静听浓情爵士，于悠然中尽享',
      imgurl: 'http://p.qpic.cn/music_cover/llTQ9l2AeicK2OLIORnsUdtbhlNRGF89NBDI6SoBxEIzhAlrmV1SmGg/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '2691498608',
      name: '虛榮少女',
      desc: '感性强盗｜强势洗榜的那些韩国抒情音乐',
      imgurl: 'http://p.qpic.cn/music_cover/icLTHicH8iakBFAJbiazGT3DnywHfOoiaVzdZWJ4pVcDdoVCqlU5hLx8K7A/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '3703029362',
      name: '哔咯独角兽',
      desc: '温情摇滚｜安抚夜色弥漫时落寞的心',
      imgurl: 'http://p.qpic.cn/music_cover/0yiaX8d9LSmnROyId1RsUUwklzSKKp7RSanBAJ89We5I4kMwdnH5yeg/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '3606666961',
      name: '毕业雨季',
      desc: '小资情调：何为亏欠文艺青年心中的体面',
      imgurl: 'http://p.qpic.cn/music_cover/SXTicaprnQbfAyiaibTsguPlPQK4ZBwicp09O22qKwnTJaO10kp2le37Ww/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '3604823742',
      name: '冷门单曲酱',
      desc: '放假挤火车回家：等车时的轻快曲',
      imgurl: 'http://p.qpic.cn/music_cover/lricrZ3ca62ybvZbWYjtYa9d3Biab7MTiaJhX9owcjdkv5HMxDEunm7tg/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '1746389460',
      name: '私に闻いて风i',
      desc: '追忆续篇：少女漫中关于邂逅他的故事',
      imgurl: 'http://p.qpic.cn/music_cover/qH8rLHHhL8O8Iibm56uPzJy4mNzibugoib19FAujo6GdTXAAvhicw7Js0Q/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '1746020155',
      name: '同位',
      desc: '优雅的音乐贵族 大提琴',
      imgurl: 'http://p.qpic.cn/music_cover/e4us58fDgLVdxdbgmSUdTADM7Sl88AfGK3qQqibxmqpqRnmSGHaFaEQ/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '2949232733',
      name: '香草拿铁',
      desc: '超级碗中场秀嘉宾歌曲集',
      imgurl: 'http://p.qpic.cn/music_cover/V34Wl85ZuJRskg3Ds3R8yyddp8gI2icb7wXicN8ZEzJZP0icnwHyzNzhQ/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '3691421503',
      name: 'L岺',
      desc: '寒假赖床指南:吸猫！吸猫！吸猫！',
      imgurl: 'http://p.qpic.cn/music_cover/Ay2w92PeiaO57pZWMwecv6SEWibhUAoWKzkmWgbtcfCsibQYt8bZtq2PA/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  },
  {
    item: {
      id: '2072789141',
      name: 'D.Va',
      desc: '中国风电音：敢问上天，是否有仙？',
      imgurl: 'http://p.qpic.cn/music_cover/QlZibnBVmII60BjTttickJO9MTQDoTRFvboeks5LDkOJHNEjao8f9t6Q/600?n=1'
    },
    btns: [
      {
        content: '不再关注',
        style: { 'background-color': '#c8c7cd', 'color': '#fff' }
      },
      {
        content: '删除',
        style: { 'background-color': '#ff3a32', 'color': '#fff' }
      }
    ]
  }
]

export default {
  data() {
    return {
      swipeData: customData,
      options: {
        probeType: 3,
        click: true,
        pullDownRefresh: {
          // 阀值
          threshold: 80,
          // 滞留的位置
          stop: 60,
          txt: '更新成功',
          // 更新到数据,调用finishPullDown的延迟时间,会影响到txt的显示持续时间
          stopTime: 1000
        },
        directionLockThreshold: 0,
      }
    }
  },
  methods: {
    menuClick(menu, index, shrink, toggleConfirmMenus) {
      if (menu.content === '删除') {
        // this.swipeData.splice(index, 1)
        toggleConfirmMenus(true)
      } else if (menu.content === '不再关注') {
        shrink()
      }
    },
    clickHandler() {
      console.log('click')
    },
    activeIndexChange(index) {
      console.log(index)
    },
    confirm(index, shrink) {
      // shrink()
    }
  }
}
</script>

<style lang="stylus" modules>
.swipe
  height: 100vh
  .scroll-wrapper
    height: 100%
    .swipe-item-wrapper
      .item-inner
        width: 100%
        height: 50px
        line-height: 50px
        color: #fff
        content-align: center
        background: gold
        margin-bottom: 10px
</style>

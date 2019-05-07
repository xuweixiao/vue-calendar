<template>
    <div class="progress-box" :style="{backgroundColor:progressColor,width:progressWidth}"></div>
</template>
<script>
import { getCatchData, setCatchData, removeCatchData } from '@/common/functions/catch'

export default {
  props: {
    // 这个很重要，直接影响了获取dom的方法，是根据class，id
    isClass: {
      require: true,
      type: Boolean
    },
    scrollElement: {
      require: true,
      type: String
    },
    mainBody: {
      require: true,
      type: String
    },
    intervalHeight: {
      type: Number,
      default () {
        return 50
      }
    },
    id: {
      require: true,
      type: String
    }
  },
  data () {
    return {
      progressColor: '#fff',
      progressWidth: '0%'
    }
  },
  mounted () {
    let scrollObj
    let mainBody
    if (this.isClass) {
      scrollObj = document.getElementsByClassName(this.scrollElement)[0]
      mainBody = document.getElementsByClassName(this.mainBody)[0]
    } else {
      scrollObj = document.getElementById(this.scrollElement)
      mainBody = document.getElementById(this.mainBody)
    }
    setCatchData(this.id, 1, 0)
    scrollObj.removeEventListener('scroll', null, false)
    scrollObj.addEventListener('scroll', () => {
      // 目标元素滚动距离最大值 = 文本内容高度 - 可视化屏幕高度（用户可以浏览内容区域高度）
      let mainHeight = mainBody.clientHeight - (window.innerHeight - this.intervalHeight)
      // 滚动进度 = 目标元素滚动距离 / 目标元素滚动距离最大值
      let ratio = Math.floor(scrollObj.scrollTop / mainHeight * 100)
      this.progressWidth = ratio + '%'
      if (ratio < 50) {
        this.progressColor = '#FF6F69'
      } else if (ratio < 98) {
        this.progressColor = '#FFC470'
      } else if (ratio < 100) {
        this.progressColor = '#63A65B'
      }
      let max = getCatchData(this.id, 1)
      if (ratio > max && ratio >= (max + 2)) {
        setCatchData(this.id, 1, ratio)
      }
    })
  },
  destroyed () {
    console.log(this.progressWidth, '销毁')
    removeCatchData(this.id + 1)
  }
}
</script>
<style lang="scss" scoped>
    .progress-box{
        width: 0%;
        height: 2px;
        position: fixed;
        top: 0px;
        left: 0;
        z-index: 2000;
    }
</style>

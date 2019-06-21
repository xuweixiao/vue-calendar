<template>
  <div class="echart-box">
    <!-- 正常图表 -->
    <p class="chart-title" v-if="!fullScreenStatus">
      {{ title }}
      <img
        @click="fullScreenOpenOrClose(true)"
        class="screen-full-img"
        :src="require('@/assets/img/icon_screen_full.png')">
    </p>
    <div :id="chartId" :style="{height: height,width:width}"/>
    <!-- 全屏 -->
    <section class="full-srceen-box" v-show="fullScreenShow">
        <div class="chart-rorate"
            :style="{width:fullHeight,marginTop:topSpace + 'px',marginLeft:leftSpace+'px'}">
            <p class="chart-title">
                {{ title }}
                <img
                    @click="fullScreenOpenOrClose(false)"
                    class="screen-full-img"
                    :src="require('@/assets/img/icon_close.png')">
            </p>
        </div>
        <div :id="`${chartId}full`"
          class="full-screen-echarts"
          :style="{height:fullHeight,width:fullWidth}"/>
    </section>
  </div>
</template>

<script>
// 引入图
import { replaceStr } from '@/common/functions/baseFuntion'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/component/graphic')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/grid')
require('echarts/lib/component/axis')
require('echarts/lib/component/markPoint')
require('echarts/lib/component/markLine')

export default {
  name: 'chart',
  props: {
    title: {
      type: String,
      default () {
        return '招生趋势'
      }
    },
    chartId: {
      type: String,
      default () {
        return 'bar'
      }
    },
    width: {
      type: String,
      default () {
        return '100%'
      }
    },
    height: {
      type: String,
      default () {
        return '200px'
      }
    },
    fullOption: {
      type: Object
    },
    option: {
      type: Object,
      require: true
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    enabledClick: {
      type: Boolean,
      default () {
        return false
      }
    },
    fullScreenStatus: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      bar: null,
      fullBar: null,
      empty: false,
      fullScreenShow: false
    }
  },
  computed: {
    fullWidth () {
      return window.innerWidth + 'px'
    },
    fullHeight () {
      return window.innerHeight + 'px'
    },
    topSpace () {
      return Math.round(Number(replaceStr(this.fullHeight, 'px', '')) / 2) - Math.round(57 / 2)
    },
    leftSpace () {
      return Number(replaceStr(this.fullWidth, 'px', '')) - Math.round(Number(replaceStr(this.fullHeight, 'px', '')) / 2) - Math.round(57 / 2)
    }
  },
  watch: {
    option: {
      handler () {
        this.option.series.length === 0 ? this.empty = true : (this.option.series[0].data.length === 0 ? this.empty = true : this.empty = false)
        if (this.empty) {
          this.bar.clear()
        } else {
          this.drawBar()
        }
      },
      deep: true
    },
    fullOption: {
      handler () {
        this.fullOption.series.length === 0 ? this.empty = true : (this.fullOption.series[0].data.length === 0 ? this.empty = true : this.empty = false)
        if (this.empty) {
          this.fullOption.clear()
        } else {
          this.drawFullBar()
        }
      },
      deep: true
    },
    height () {
      if (document.getElementById(this.barId) !== null) {
        this.drawBar()
      }
    },
    width () {
      if (document.getElementById(this.barId) !== null) {
        this.drawBar()
      }
    }
  },
  mounted () {
    this.bar = this.$echarts.init(document.getElementById(this.chartId))
    this.fullBar = this.$echarts.init(document.getElementById(this.chartId + 'full'))
    if (this.enabledClick) {
      this.bar.getZr().on('click', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (this.bar.containPixel('grid', pointInPixel)) {
          const pointInGrid = this.bar.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
          const xIndex = pointInGrid[[0]]
          const op = this.bar.getOption()
          const xValue = op.xAxis[0].data[xIndex]
          this.$emit('onDetail', xValue)
        }
      })
    }
    this.bar.on('legendselectchanged', params => {
      const legendObj = params.selected
      let selectedNum = 0
      for (const key in legendObj) {
        if (legendObj.hasOwnProperty(key)) {
          const element = legendObj[key]
          if (element) {
            selectedNum += 1
          }
        }
      }
      if (selectedNum === 0) {
        legendObj[params.name] = true
        this.option.legend.selected = legendObj
        this.bar.setOption(this.option)
      }
    })
  },
  beforeDestroy () {
    if (this.bar !== null && this.bar !== '' && !(typeof this.bar === 'undefined')) {
      this.bar.clear()
    }
    if (this.fullBar !== null && this.fullBar !== '' && !(typeof this.fullBar === 'undefined')) {
      this.fullBar.clear()
    }
  },
  methods: {
    drawBar () {
      if (this.bar !== null && this.bar !== '' && !(typeof this.bar === 'undefined')) {
        this.bar.resize()
        this.bar.setOption(this.option)
      }
    },
    drawFullBar () {
      if (this.fullBar !== null && this.fullBar !== '' && !(typeof this.fullBar === 'undefined')) {
        this.fullBar.resize()
        this.fullBar.setOption(this.fullOption)
      }
    },
    fullScreenOpenOrClose () {
      this.fullScreenShow = !this.fullScreenShow
      if (this.fullScreenStatus) {
        this.$emit('fullScreenOpenOrClose', false)
      } else {
        this.$emit('fullScreenOpenOrClose', true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/echarts.scss'
</style>
